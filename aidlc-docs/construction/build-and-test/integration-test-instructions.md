# Integration Test Instructions — Unit 3: Infra & DevOps

## Purpose
Terraform 모듈 간 연결, Docker 컨테이너 간 통신, CI/CD 파이프라인 동작을 검증합니다.

## Scenario 1: Terraform 모듈 간 의존성 검증

### 설명
모든 모듈이 올바르게 연결되고 output/variable 체이닝이 정상 동작하는지 확인.

### 테스트 방법
```bash
cd infra
terraform init -backend=false
terraform plan -var-file=environments/dev.tfvars 2>&1 | tee plan-output.txt

# 확인 사항:
# 1. networking output이 compute, database, cache에 전달되는지
# 2. storage output(ECR URL)이 compute에 전달되는지
# 3. compute output(ALB DNS)이 cdn에 전달되는지
# 4. 모든 모듈의 output이 monitoring에 전달되는지
```

### 예상 결과
- Plan 생성 시 오류 없음
- 모든 모듈 간 참조가 해결됨

## Scenario 2: Docker Compose 통합 테스트

### 설명
API와 Frontend 컨테이너가 함께 동작하는지 로컬에서 검증.

### Setup
```bash
# docker-compose.test.yml 생성 (임시)
cat > docker-compose.test.yml << 'EOF'
services:
  api:
    build: ./packages/api
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=test
      - PORT=3001
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  frontend:
    build: ./packages/frontend
    ports:
      - "8080:80"
    depends_on:
      - api
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 10s
      timeout: 5s
      retries: 3
EOF
```

### 실행
```bash
docker compose -f docker-compose.test.yml up --build -d
sleep 15

# Health check
curl -f http://localhost:8080/ && echo "Frontend OK" || echo "Frontend FAIL"
curl -f http://localhost:3001/api/health && echo "API OK" || echo "API FAIL"
```

### Cleanup
```bash
docker compose -f docker-compose.test.yml down
rm docker-compose.test.yml
```

## Scenario 3: Security Group 규칙 검증

### 설명
Terraform plan에서 Security Group 규칙이 설계대로 생성되는지 확인.

### 테스트 방법
```bash
cd infra
terraform plan -var-file=environments/dev.tfvars -out=tfplan
terraform show -json tfplan | jq '.planned_values.root_module.child_modules[] | select(.address | contains("networking")) | .resources[] | select(.type == "aws_security_group") | {name: .values.name_prefix, ingress: .values.ingress}'
```

### 예상 결과
- ALB SG: 80, 443 from 0.0.0.0/0
- ECS SG: 3001, 80 from ALB SG
- RDS SG: 5432 from ECS SG
- Redis SG: 6379 from ECS SG
