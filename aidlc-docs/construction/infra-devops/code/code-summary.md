# Code Generation Summary — Unit 3: Infra & DevOps

## 생성된 파일 목록

### Terraform (infra/)
| 파일 | 설명 |
|---|---|
| `infra/backend.tf` | S3 remote state backend 설정 |
| `infra/providers.tf` | AWS provider (ap-northeast-2 + us-east-1) |
| `infra/variables.tf` | 공통 변수 정의 |
| `infra/outputs.tf` | 주요 출력값 |
| `infra/main.tf` | 7개 모듈 호출 |
| `infra/modules/networking/` | VPC, Subnets, IGW, NAT, SGs |
| `infra/modules/database/` | RDS PostgreSQL, Secrets Manager |
| `infra/modules/cache/` | ElastiCache Redis |
| `infra/modules/storage/` | ECR, S3 Buckets |
| `infra/modules/compute/` | ECS Cluster, Services, ALB, Auto Scaling |
| `infra/modules/cdn/` | CloudFront, OAC |
| `infra/modules/monitoring/` | CloudWatch Alarms, Dashboard, SNS |
| `infra/environments/dev.tfvars` | dev 환경 변수 |
| `infra/environments/staging.tfvars` | staging 환경 변수 |
| `infra/environments/prod.tfvars` | prod 환경 변수 |

### Docker
| 파일 | 설명 |
|---|---|
| `packages/api/Dockerfile` | API 컨테이너 (node:20-alpine) |
| `packages/frontend/Dockerfile` | Frontend 컨테이너 (multi-stage: node build + nginx) |
| `packages/frontend/nginx.conf` | Nginx SPA 설정 |
| `.dockerignore` | Docker 빌드 제외 파일 |

### CI/CD (.github/workflows/)
| 파일 | 설명 |
|---|---|
| `ci.yml` | CI: lint, test, build, audit |
| `deploy.yml` | CD: Docker build → ECR → Terraform → ECS |
| `terraform-plan.yml` | Terraform Plan PR comment |

## Story 매핑
- US-N.3.1 (Terraform IaC): Step 1~9 ✅
- US-N.3.2 (ECS Fargate 배포): Step 10~12 ✅
- US-N.3.3 (CI/CD 파이프라인): Step 13~15 ✅
