# Infra & DevOps — Logical Components

## 전체 논리 구성도

```
Internet
  │
  ▼
CloudFront (CDN) ─── S3 (Static Assets)
  │
  ▼
ALB (HTTPS, ACM Certificate)
  ├── /api/* → ECS API Service
  └── /*     → ECS Frontend Service
  
ECS Cluster (Fargate)
  ├── API Task (Node.js)
  │     ├── → RDS PostgreSQL (Private Subnet)
  │     ├── → ElastiCache Redis (Private Subnet)
  │     ├── → Secrets Manager
  │     ├── → S3 (이미지 업로드)
  │     ├── → Bedrock (AI)
  │     └── → CloudWatch Logs + X-Ray
  └── Frontend Task (Nginx)
        └── → CloudWatch Logs

Monitoring
  ├── CloudWatch Alarms → SNS Topic
  ├── CloudWatch Dashboard
  ├── Container Insights
  └── X-Ray Traces
```

## LC-01: Network Layer

| 컴포넌트 | 역할 | 배치 |
|---|---|---|
| VPC | 네트워크 격리 | 환경별 1개 |
| Public Subnet (x2) | ALB, NAT Gateway | AZ-a, AZ-c |
| Private Subnet (x2) | ECS, RDS, Redis | AZ-a, AZ-c |
| Internet Gateway | 인터넷 접근 | VPC |
| NAT Gateway (x1) | Private → 인터넷 | Public Subnet AZ-a |
| ALB | 로드 밸런싱, HTTPS 종료 | Public Subnet |

## LC-02: Compute Layer

| 컴포넌트 | 역할 | 스펙 (prod) |
|---|---|---|
| ECS Cluster | Fargate 컨테이너 호스팅 | Container Insights 활성화 |
| API Service | Node.js API 실행 | 1024 CPU, 2048 MB, min 2 tasks |
| Frontend Service | Nginx 정적 파일 서빙 | 256 CPU, 512 MB, min 2 tasks |
| Auto Scaling | CPU Target Tracking 70% | max 10 tasks |

## LC-03: Data Layer

| 컴포넌트 | 역할 | 스펙 (prod) |
|---|---|---|
| RDS PostgreSQL 15 | 주 데이터베이스 | db.t3.medium, Multi-AZ |
| ElastiCache Redis 7 | 캐시, 세션 | cache.t3.small |
| S3 (Assets) | 상품 이미지, AI 이미지 | SSE-S3 암호화 |
| S3 (ALB Logs) | ALB 접근 로그 | 90일 lifecycle |
| S3 (Terraform State) | IaC state 파일 | Versioning 활성화 |

## LC-04: Security Layer

| 컴포넌트 | 역할 |
|---|---|
| ACM Certificate | ALB/CloudFront SSL/TLS |
| Secrets Manager | DB 비밀번호, API 키 저장 |
| Security Groups (4개) | ALB SG, ECS SG, RDS SG, Redis SG |
| IAM Roles (3개) | ECS Task Role, Execution Role, GitHub OIDC Role |

## LC-05: CDN Layer

| 컴포넌트 | 역할 |
|---|---|
| CloudFront Distribution | 정적 자산 캐싱 + API 프록시 |
| Origin Access Control | S3 직접 접근 차단 |

## LC-06: CI/CD Layer

| 컴포넌트 | 역할 |
|---|---|
| GitHub Actions (5 workflows) | CI/CD 파이프라인 |
| ECR Repository (x2) | API, Frontend 이미지 저장 |
| OIDC Provider | GitHub → AWS 인증 |
| DynamoDB Table | Terraform state lock |

## LC-07: Monitoring Layer

| 컴포넌트 | 역할 |
|---|---|
| CloudWatch Log Groups | ECS 컨테이너 로그 |
| CloudWatch Alarms (9개) | CPU, Memory, 5XX, Response Time, RDS, Redis |
| CloudWatch Dashboard | 환경별 통합 대시보드 |
| X-Ray | API 분산 추적 |
| Container Insights | ECS 클러스터 메트릭 |
| SNS Topic | 알람 알림 |
