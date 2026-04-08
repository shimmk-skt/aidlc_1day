# Integration Test Instructions — 전체 통합 (Unit 1~3)

## Scenario 1: Frontend → Backend API 통합

### 설명
Frontend가 Backend API를 정상적으로 호출하는지 검증.

### 실행
```bash
docker compose up --build -d
sleep 10

# API Health
curl -f http://localhost:3001/api/health && echo "API OK"

# Frontend 로드
curl -f http://localhost:5173/ && echo "Frontend OK"

# 인증 Flow
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@inventrix.com","password":"admin123"}' \
  && echo "Auth OK"
```

### Cleanup
```bash
docker compose down
```

## Scenario 2: Terraform 모듈 간 의존성

### 설명
7개 Terraform 모듈의 output/variable 체이닝이 정상 동작하는지 확인.

### 실행
```bash
cd infra
terraform init -backend=false
terraform plan -var-file=environments/dev.tfvars 2>&1 | tee plan-output.txt
```

### 확인 사항
- networking → compute, database, cache 연결
- storage → compute (ECR URL)
- compute → cdn (ALB DNS)
- 모든 모듈 → monitoring

## Scenario 3: CI/CD 파이프라인 검증

### 설명
GitHub Actions workflow가 올바르게 구성되었는지 확인.

### 확인 사항
- [ ] ci.yml: pnpm install → lint → test → build → audit
- [ ] deploy.yml: OIDC 인증 → Docker build → ECR push → Terraform → ECS update
- [ ] terraform-plan.yml: PR 트리거 → plan → PR comment
- [ ] 환경별 트리거 규칙: feature/* → dev, main → staging, release/* → prod

## Scenario 4: Security Group 규칙 검증

### 실행
```bash
cd infra
terraform plan -var-file=environments/dev.tfvars -out=tfplan
terraform show -json tfplan | jq '.planned_values.root_module.child_modules[] | select(.address | contains("networking")) | .resources[] | select(.type == "aws_security_group")'
```

### 예상 결과
- ALB SG: 80, 443 from 0.0.0.0/0
- ECS SG: 3001, 80 from ALB SG only
- RDS SG: 5432 from ECS SG only
- Redis SG: 6379 from ECS SG only
