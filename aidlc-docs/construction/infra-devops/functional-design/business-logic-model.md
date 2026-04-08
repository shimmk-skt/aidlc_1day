# Infra & DevOps — Business Logic Model

## 1. Terraform 모듈 구조

리소스 유형별 모듈 분리 (Q1: B). 각 모듈은 독립적으로 plan/apply 가능.

```
infra/
├── modules/
│   ├── networking/      # VPC, Subnets, NAT, IGW, Security Groups
│   ├── compute/         # ECS Cluster, Task Definitions, Services, ALB
│   ├── database/        # RDS PostgreSQL
│   ├── cache/           # ElastiCache Redis
│   ├── storage/         # S3 Buckets, ECR Repositories
│   ├── cdn/             # CloudFront Distribution
│   └── monitoring/      # CloudWatch, X-Ray, Container Insights, Alarms
├── environments/
│   ├── dev.tfvars
│   ├── staging.tfvars
│   └── prod.tfvars
├── main.tf              # 모듈 호출
├── variables.tf         # 공통 변수
├── outputs.tf           # 출력값
├── providers.tf         # AWS Provider 설정
└── backend.tf           # S3 Remote State
```

## 2. 모듈 간 의존성 흐름

```
networking → compute (VPC, Subnet IDs)
networking → database (Subnet Group, SG)
networking → cache (Subnet Group, SG)
compute → storage (ECR URI)
compute → cdn (ALB DNS)
compute → monitoring (ECS Cluster ARN, Service ARN)
database → monitoring (RDS Instance ID)
cache → monitoring (ElastiCache Cluster ID)
```

## 3. 환경별 구성 전략

동일 아키텍처, 인스턴스 크기만 차등 (Q2: A). tfvars 파일로 환경별 파라미터 관리.

| 파라미터 | dev | staging | prod |
|---|---|---|---|
| ECS Task CPU | 256 | 512 | 1024 |
| ECS Task Memory | 512 | 1024 | 2048 |
| ECS Desired Count | 1 | 1 | 2 |
| RDS Instance Class | db.t3.micro | db.t3.small | db.t3.medium |
| RDS Multi-AZ | false | false | true |
| ElastiCache Node Type | cache.t3.micro | cache.t3.micro | cache.t3.small |
| AZ 수 | 2 | 2 | 2 |

## 4. CI/CD 파이프라인 (GitHub Actions)

```
Push to branch
  → Lint & Test
  → Docker Build (단일 Dockerfile)
  → Push to ECR
  → Terraform Plan (해당 환경)
  → Manual Approval (prod만)
  → Terraform Apply
  → ECS Service Update (force new deployment)
  → Health Check 확인
```

### 파이프라인 트리거 규칙
- `feature/*` → dev 환경 자동 배포
- `main` → staging 환경 자동 배포
- `release/*` tag → prod 환경 (수동 승인 후 배포)

## 5. Docker 빌드 전략

단일 Dockerfile (Q4: A). API와 Frontend 각각 별도 Dockerfile.

- **API**: `node:20-alpine` 베이스, `npm ci --production`, 포트 3001
- **Frontend**: `node:20-alpine` 빌드 → `nginx:alpine` 서빙, 포트 80

## 6. Terraform State 관리

S3 Backend + DynamoDB Lock (Q7 분석 결과: GitHub 자체 Terraform state 저장 기능 없음, GitHub Actions에서 S3 backend가 표준).

- S3 Bucket: `inventrix-terraform-state-{account-id}`
- DynamoDB Table: `inventrix-terraform-lock`
- State 파일 경로: `env:{environment}/terraform.tfstate`
- S3 Versioning 활성화 (state 복구 가능)

## 7. 모니터링 구성 (CloudWatch + X-Ray + Container Insights)

| 대상 | 메트릭 | 알람 임계값 |
|---|---|---|
| ECS Service | CPUUtilization | > 80% (5분) |
| ECS Service | MemoryUtilization | > 80% (5분) |
| ALB | HTTPCode_Target_5XX_Count | > 10 (1분) |
| ALB | TargetResponseTime | > 2s (p95, 5분) |
| RDS | CPUUtilization | > 80% (5분) |
| RDS | FreeStorageSpace | < 5GB |
| RDS | DatabaseConnections | > 80% max |
| ElastiCache | CPUUtilization | > 80% (5분) |
| ElastiCache | CurrConnections | > 80% max |

- X-Ray: API 서비스 분산 추적 활성화
- Container Insights: ECS 클러스터 레벨 메트릭 수집
- CloudWatch Dashboard: 환경별 통합 대시보드

## 8. Auto Scaling 전략

CPU 기반 Target Tracking (Q9: A).

| 파라미터 | 값 |
|---|---|
| Target CPU | 70% |
| Min Tasks | 1 (dev/staging), 2 (prod) |
| Max Tasks | 2 (dev/staging), 10 (prod) |
| Scale-in Cooldown | 300초 |
| Scale-out Cooldown | 60초 |
