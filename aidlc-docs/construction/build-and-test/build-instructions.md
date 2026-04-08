# Build Instructions — 전체 통합 (Unit 1~3)

## Prerequisites
- Node.js 20 + pnpm
- Docker >= 24.0
- Terraform >= 1.5
- AWS CLI v2 (자격 증명 설정 완료)

## 1. 의존성 설치

```bash
cd /Users/1113039/ai-dlc/aidlc_1day
pnpm install
```

## 2. Backend 빌드 (Unit 1)

```bash
pnpm --filter api run build
```

### 확인 사항
- `packages/api/dist/` 디렉토리 생성
- TypeScript 컴파일 오류 없음

## 3. Frontend 빌드 (Unit 2)

```bash
pnpm --filter frontend run build
```

### 확인 사항
- `packages/frontend/dist/` 디렉토리 생성
- Vite 빌드 성공

## 4. Docker 이미지 빌드 (Unit 3)

```bash
# API
docker build -t inventrix-api:local packages/api/

# Frontend
docker build -t inventrix-frontend:local packages/frontend/
```

## 5. Docker Compose 통합 실행

```bash
docker compose up --build -d
```

### 확인 사항
- API: http://localhost:3001/api/health → 200 OK
- Frontend: http://localhost:5173 → 페이지 로드

## 6. Terraform 검증 (Unit 3)

```bash
cd infra
terraform init -backend=false
terraform validate
terraform fmt -check -recursive
```

## 7. Bootstrap (최초 배포 전)

```bash
# S3 Bucket (Terraform State)
aws s3api create-bucket \
  --bucket inventrix-terraform-state \
  --region ap-northeast-2 \
  --create-bucket-configuration LocationConstraint=ap-northeast-2

aws s3api put-bucket-versioning \
  --bucket inventrix-terraform-state \
  --versioning-configuration Status=Enabled

# DynamoDB Table (State Lock)
aws dynamodb create-table \
  --table-name inventrix-terraform-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-northeast-2
```

## Troubleshooting

### pnpm install 실패
- Node.js 20 버전 확인: `node -v`
- pnpm 설치: `corepack enable`

### Docker build 실패
- API: `pnpm --filter api run build`가 먼저 성공하는지 확인
- Frontend: `pnpm --filter frontend run build`가 먼저 성공하는지 확인
