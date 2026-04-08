# Infrastructure Design — Backend Unit

## Deployment Architecture

```
Route 53 (DNS)
  → CloudFront (정적 자산 CDN)
  → ALB (Application Load Balancer, HTTPS termination)
      → ECS Fargate Service (Backend API containers)
          → RDS PostgreSQL (Multi-AZ, Primary + Read Replica)
          → ElastiCache Redis (Cluster mode)
          → S3 (상품 이미지, 내보내기)
          → AWS Bedrock (AI 기능)
          → SQS (Phase 4 비동기 메시징)
```

## AWS Service Mapping

| Logical Component | AWS Service | Configuration |
|---|---|---|
| API Server | ECS Fargate | 2 tasks min, CPU 256, Memory 512MB, auto-scale |
| Database | RDS PostgreSQL 16 | db.t3.medium, Multi-AZ, 20GB gp3, Read Replica |
| Cache | ElastiCache Redis 7 | cache.t3.micro, 1 node |
| Load Balancer | ALB | HTTPS (ACM cert), health check /health |
| Container Registry | ECR | Backend Docker image |
| Object Storage | S3 | 상품 이미지, 배송 라벨 PDF |
| AI/ML | Bedrock | Claude 3, Nova Canvas |
| Monitoring | CloudWatch + X-Ray | 로그, 메트릭, 트레이싱 |
| Secrets | Secrets Manager | DB password, JWT secret, API keys |
| Networking | VPC | Public subnet (ALB), Private subnet (ECS, RDS, Redis) |

## Network Architecture
- VPC: 10.0.0.0/16
- Public Subnets: 10.0.1.0/24, 10.0.2.0/24 (ALB, NAT Gateway)
- Private Subnets: 10.0.10.0/24, 10.0.20.0/24 (ECS, RDS, Redis)
- NAT Gateway: 외부 API 호출용 (Toss, EasyPost, Bedrock)
- Security Groups:
  - ALB: 80/443 inbound from 0.0.0.0/0
  - ECS: 3000 inbound from ALB SG only
  - RDS: 5432 inbound from ECS SG only
  - Redis: 6379 inbound from ECS SG only

## Environment Variables
| Variable | Source | Description |
|---|---|---|
| DATABASE_URL | Secrets Manager | PostgreSQL 연결 문자열 |
| REDIS_URL | Parameter Store | Redis 연결 문자열 |
| JWT_SECRET | Secrets Manager | JWT 서명 키 |
| JWT_REFRESH_SECRET | Secrets Manager | Refresh token 서명 키 |
| TOSS_SECRET_KEY | Secrets Manager | Toss Payments API 키 |
| EASYPOST_API_KEY | Secrets Manager | EasyPost API 키 |
| AWS_REGION | ECS Task Definition | AWS 리전 |
| NODE_ENV | ECS Task Definition | production |
| PORT | ECS Task Definition | 3000 |
| CORS_ORIGIN | Parameter Store | 허용 origin |
