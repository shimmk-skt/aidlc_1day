# Infra & DevOps — Deployment Architecture

## 1. 환경별 배포 구성

### 공통 아키텍처 (모든 환경 동일 구조)
```
CloudFront → ALB → ECS Fargate (API + Frontend)
                      ├── RDS PostgreSQL
                      ├── ElastiCache Redis
                      ├── S3
                      ├── Secrets Manager
                      └── CloudWatch / X-Ray
```

### 환경별 차이점
| 항목 | dev | staging | prod |
|---|---|---|---|
| VPC CIDR | 10.0.0.0/16 | 10.1.0.0/16 | 10.2.0.0/16 |
| ECS API Tasks | 1 | 1 | 2~10 |
| ECS API CPU/Mem | 256/512 | 512/1024 | 1024/2048 |
| RDS Class | db.t3.micro | db.t3.small | db.t3.medium |
| RDS Multi-AZ | No | No | Yes |
| Redis Node | cache.t3.micro | cache.t3.micro | cache.t3.small |
| Log Retention | 7일 | 30일 | 90일 |
| Auto Scaling | 1~2 | 1~2 | 2~10 |

## 2. 배포 파이프라인

### GitHub Actions Workflow 구성

#### ci.yml (PR / feature branch push)
```
Trigger: PR, push to feature/*
Steps:
  1. Checkout code
  2. Setup Node.js 20
  3. npm ci
  4. npm run lint
  5. npm run test
  6. npm run build
```

#### deploy-dev.yml (feature branch → dev)
```
Trigger: push to feature/*
Steps:
  1. Checkout code
  2. Configure AWS credentials (OIDC)
  3. Login to ECR
  4. Build & push API image (tag: dev-{sha})
  5. Build & push Frontend image (tag: dev-{sha})
  6. Terraform init (dev)
  7. Terraform plan (dev)
  8. Manual approval ← 수동 승인
  9. Terraform apply (dev)
  10. Update ECS API service (force new deployment)
  11. Update ECS Frontend service (force new deployment)
  12. Wait for service stability
```

#### deploy-staging.yml (main → staging)
```
Trigger: push to main
Steps: (deploy-dev.yml과 동일 구조, staging 환경 대상)
```

#### deploy-prod.yml (release tag → prod)
```
Trigger: tag release/*
Steps: (deploy-dev.yml과 동일 구조, prod 환경 대상)
```

#### terraform-plan.yml (infra PR)
```
Trigger: PR with changes in infra/
Steps:
  1. Checkout code
  2. Configure AWS credentials (OIDC)
  3. Terraform init
  4. Terraform plan
  5. Post plan output as PR comment
```

## 3. 롤백 절차

### 애플리케이션 롤백
```
1. ECR에서 이전 안정 이미지 태그 확인
2. ECS 서비스 업데이트 (이전 이미지 태그 지정)
3. ECS 서비스 안정화 대기
4. 헬스체크 확인
```

### 인프라 롤백
```
1. Git에서 이전 안정 커밋 확인
2. Revert commit 생성
3. Terraform plan으로 변경 사항 확인
4. 수동 승인 후 Terraform apply
```

## 4. Bootstrap 리소스 (Terraform 외부)

Terraform state를 저장하기 위한 리소스는 Terraform 자체로 관리할 수 없으므로 별도 bootstrap 필요:

| 리소스 | 용도 | 생성 방법 |
|---|---|---|
| S3 Bucket (state) | Terraform state 저장 | AWS CLI / Console |
| DynamoDB Table (lock) | State locking | AWS CLI / Console |
| IAM OIDC Provider | GitHub Actions 인증 | AWS CLI / Console |
| IAM Role (CI/CD) | GitHub Actions 실행 역할 | AWS CLI / Console |

## 5. 도메인 및 DNS (선택사항)

| 항목 | 서비스 | 비고 |
|---|---|---|
| 도메인 관리 | Route 53 (선택) | 도메인 보유시 |
| DNS 레코드 | CloudFront CNAME | 커스텀 도메인 연결 |
| ACM 인증서 | us-east-1 (CloudFront) + 리전 (ALB) | DNS 검증 |
