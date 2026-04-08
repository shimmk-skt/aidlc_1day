# Build Instructions — Unit 3: Infra & DevOps

## Prerequisites
- Terraform >= 1.5
- Docker >= 24.0
- AWS CLI v2
- Node.js 20 + pnpm
- AWS 계정 및 자격 증명 설정

## 1. Bootstrap (최초 1회)

Terraform state 저장용 리소스를 먼저 생성합니다:

```bash
# S3 Bucket (Terraform State)
aws s3api create-bucket \
  --bucket inventrix-terraform-state \
  --region ap-northeast-2 \
  --create-bucket-configuration LocationConstraint=ap-northeast-2

aws s3api put-bucket-versioning \
  --bucket inventrix-terraform-state \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-encryption \
  --bucket inventrix-terraform-state \
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

# DynamoDB Table (State Lock)
aws dynamodb create-table \
  --table-name inventrix-terraform-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-northeast-2

# GitHub OIDC Provider
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

## 2. Terraform Init & Plan

```bash
cd infra

# dev 환경
terraform init -backend-config="key=env:dev/terraform.tfstate"
terraform plan -var-file=environments/dev.tfvars

# staging 환경
terraform init -reconfigure -backend-config="key=env:staging/terraform.tfstate"
terraform plan -var-file=environments/staging.tfvars

# prod 환경
terraform init -reconfigure -backend-config="key=env:prod/terraform.tfstate"
terraform plan -var-file=environments/prod.tfvars
```

## 3. Docker Build (로컬 테스트)

```bash
# API
cd packages/api
pnpm run build
docker build -t inventrix-api:local .

# Frontend
cd packages/frontend
docker build -t inventrix-frontend:local .
```

## 4. Docker 로컬 실행 테스트

```bash
# Frontend
docker run -d -p 8080:80 inventrix-frontend:local

# API (DB/Redis 없이 기본 확인)
docker run -d -p 3001:3001 inventrix-api:local

# 확인
curl http://localhost:8080/
curl http://localhost:3001/api/health
```

## Troubleshooting

### Terraform init 실패
- S3 bucket/DynamoDB table이 존재하는지 확인
- AWS 자격 증명이 올바른지 확인 (`aws sts get-caller-identity`)

### Docker build 실패
- `pnpm run build`가 먼저 성공하는지 확인 (API)
- Node.js 20 버전 확인
