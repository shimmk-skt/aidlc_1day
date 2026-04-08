# Unit Test Instructions — 전체 통합 (Unit 1~3)

## Unit 1: Backend Tests

### Jest 테스트 실행
```bash
pnpm --filter api run test
```

### 예상 결과
- `tests/services/order.service.test.ts` — 주문 서비스 로직
- `tests/services/errors.test.ts` — 에러 핸들링

## Unit 2: Frontend Tests

### Vitest 테스트 실행
```bash
pnpm --filter frontend run test
```

### 예상 결과
- 컴포넌트 렌더링 테스트
- 라우팅 테스트

## Unit 3: Terraform Validation

### Terraform 검증
```bash
cd infra
terraform fmt -check -recursive
terraform init -backend=false
terraform validate
```

### Dockerfile Lint
```bash
# brew install hadolint (선택)
hadolint packages/api/Dockerfile
hadolint packages/frontend/Dockerfile
```

### GitHub Actions Workflow Lint
```bash
# brew install actionlint (선택)
actionlint .github/workflows/ci.yml
actionlint .github/workflows/deploy.yml
actionlint .github/workflows/terraform-plan.yml
```

## Docker 이미지 빌드 테스트
```bash
docker build -t inventrix-api:test packages/api/
docker build -t inventrix-frontend:test packages/frontend/
docker images | grep inventrix
```
- API: < 200MB
- Frontend: < 50MB
