# Infra & DevOps — Infrastructure Design

## 1. AWS 서비스 매핑

| 논리 컴포넌트 | AWS 서비스 | 구성 |
|---|---|---|
| VPC | Amazon VPC | 10.{env}.0.0/16, 2 AZ |
| Public Subnet | VPC Subnet | ALB, NAT Gateway |
| Private Subnet | VPC Subnet | ECS, RDS, ElastiCache |
| Load Balancer | Application Load Balancer | HTTPS, 경로 기반 라우팅 |
| API Container | ECS Fargate | Node.js 20, 1024 CPU / 2048 MB (prod) |
| Frontend Container | ECS Fargate | Nginx Alpine, 256 CPU / 512 MB (prod) |
| Database | Amazon RDS PostgreSQL 15 | db.t3.medium (prod), Multi-AZ |
| Cache | Amazon ElastiCache Redis 7 | cache.t3.small (prod) |
| Object Storage | Amazon S3 | Assets, ALB Logs, Terraform State |
| Container Registry | Amazon ECR | API, Frontend 이미지 |
| CDN | Amazon CloudFront | S3 Origin + ALB Origin |
| SSL/TLS | AWS Certificate Manager | ALB + CloudFront 인증서 |
| Secret Store | AWS Secrets Manager | DB 비밀번호, API 키 |
| Monitoring | Amazon CloudWatch | Logs, Alarms, Dashboard, Container Insights |
| Tracing | AWS X-Ray | API 분산 추적 |
| Notification | Amazon SNS | 알람 알림 |
| State Lock | Amazon DynamoDB | Terraform state locking |
| CI/CD Auth | IAM OIDC Provider | GitHub Actions → AWS |

## 2. 네트워크 아키텍처

### VPC CIDR 설계
| 환경 | VPC CIDR | Public Subnet A | Public Subnet C | Private Subnet A | Private Subnet C |
|---|---|---|---|---|---|
| dev | 10.0.0.0/16 | 10.0.1.0/24 | 10.0.2.0/24 | 10.0.10.0/24 | 10.0.11.0/24 |
| staging | 10.1.0.0/16 | 10.1.1.0/24 | 10.1.2.0/24 | 10.1.10.0/24 | 10.1.11.0/24 |
| prod | 10.2.0.0/16 | 10.2.1.0/24 | 10.2.2.0/24 | 10.2.10.0/24 | 10.2.11.0/24 |

### Security Group 규칙
| SG | Inbound | Source | Port |
|---|---|---|---|
| ALB SG | HTTPS | 0.0.0.0/0 | 443 |
| ALB SG | HTTP (redirect) | 0.0.0.0/0 | 80 |
| ECS SG | API | ALB SG | 3001 |
| ECS SG | Frontend | ALB SG | 80 |
| RDS SG | PostgreSQL | ECS SG | 5432 |
| Redis SG | Redis | ECS SG | 6379 |

## 3. ECS 서비스 구성

### API Service
| 항목 | dev | staging | prod |
|---|---|---|---|
| CPU | 256 | 512 | 1024 |
| Memory | 512 | 1024 | 2048 |
| Desired Count | 1 | 1 | 2 |
| Min Tasks | 1 | 1 | 2 |
| Max Tasks | 2 | 2 | 10 |
| Health Check | /api/health | /api/health | /api/health |
| Log Retention | 7일 | 30일 | 90일 |

### Frontend Service
| 항목 | dev | staging | prod |
|---|---|---|---|
| CPU | 256 | 256 | 256 |
| Memory | 512 | 512 | 512 |
| Desired Count | 1 | 1 | 2 |
| Health Check | / | / | / |

## 4. ALB 라우팅 규칙

| Priority | Condition | Target Group |
|---|---|---|
| 1 | Path: /api/* | API Target Group (port 3001) |
| 2 | Default | Frontend Target Group (port 80) |

- HTTPS Listener (443): ACM 인증서
- HTTP Listener (80): HTTPS 리다이렉트

## 5. CloudFront 구성

| Origin | 경로 | 캐시 정책 |
|---|---|---|
| S3 (Assets) | /assets/* | CachingOptimized (TTL 24h) |
| ALB | Default (*) | CachingDisabled (API 동적 요청) |

## 6. Terraform 모듈 → AWS 리소스 매핑

| 모듈 | AWS 리소스 |
|---|---|
| networking | VPC, Subnets (4), IGW, NAT GW, Route Tables, Security Groups (4) |
| compute | ECS Cluster, Task Definitions (2), Services (2), ALB, Target Groups (2), Auto Scaling |
| database | RDS Subnet Group, RDS Instance, Parameter Group, Secrets Manager Secret |
| cache | ElastiCache Subnet Group, ElastiCache Replication Group |
| storage | ECR Repositories (2), S3 Buckets (3) |
| cdn | CloudFront Distribution, Origin Access Control, ACM Certificate (us-east-1) |
| monitoring | CloudWatch Log Groups, Alarms (9), Dashboard, X-Ray Sampling Rule, SNS Topic |
