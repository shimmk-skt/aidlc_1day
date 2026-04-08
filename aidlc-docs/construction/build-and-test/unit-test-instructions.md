# Unit Test Instructions — Unit 3: Infra & DevOps

## Terraform Validation

### 1. Terraform Format Check
```bash
cd infra
terraform fmt -check -recursive
```
모든 `.tf` 파일이 표준 포맷인지 확인. 실패시 `terraform fmt -recursive`로 자동 수정.

### 2. Terraform Validate
```bash
cd infra
terraform init -backend=false
terraform validate
```
구문 오류, 잘못된 참조, 누락된 변수 등을 검증.

### 3. 환경별 Plan 검증
```bash
# 각 환경별 plan이 오류 없이 생성되는지 확인
terraform plan -var-file=environments/dev.tfvars -detailed-exitcode
terraform plan -var-file=environments/staging.tfvars -detailed-exitcode
terraform plan -var-file=environments/prod.tfvars -detailed-exitcode
```

## Docker Validation

### 4. Dockerfile Lint (Hadolint)
```bash
# Hadolint 설치 (선택)
# brew install hadolint

hadolint packages/api/Dockerfile
hadolint packages/frontend/Dockerfile
```

### 5. Docker Build 테스트
```bash
docker build -t inventrix-api:test packages/api/
docker build -t inventrix-frontend:test packages/frontend/
```
빌드가 성공적으로 완료되는지 확인.

### 6. Docker 이미지 크기 확인
```bash
docker images | grep inventrix
```
- API: < 200MB 예상 (node:20-alpine)
- Frontend: < 50MB 예상 (nginx:alpine)

## GitHub Actions Validation

### 7. Workflow 구문 검증
```bash
# actionlint 설치 (선택)
# brew install actionlint

actionlint .github/workflows/ci.yml
actionlint .github/workflows/deploy.yml
actionlint .github/workflows/terraform-plan.yml
```

## 예상 결과
- Terraform fmt: 0 changes
- Terraform validate: Success
- Terraform plan: 각 환경별 리소스 생성 계획 출력
- Docker build: 2개 이미지 성공
- Workflow lint: 0 errors
