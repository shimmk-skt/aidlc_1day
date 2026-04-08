# Infra & DevOps — Domain Entities

## Terraform 모듈 엔티티

### E1: Networking Module
| 리소스 | 설명 |
|---|---|
| VPC | CIDR: 10.{env}.0.0/16 (dev=0, staging=1, prod=2) |
| Public Subnets (2) | AZ-a, AZ-c. ALB, NAT Gateway 배치 |
| Private Subnets (2) | AZ-a, AZ-c. ECS, RDS, ElastiCache 배치 |
| Internet Gateway | Public Subnet 인터넷 접근 |
| NAT Gateway (1) | Private Subnet 아웃바운드 인터넷 (비용 최적화: 단일) |
| Route Tables | Public: IGW, Private: NAT |
| Security Groups | ALB SG, ECS SG, RDS SG, ElastiCache SG |

### E2: Compute Module
| 리소스 | 설명 |
|---|---|
| ECS Cluster | Fargate 전용 |
| API Task Definition | Node.js API 컨테이너 |
| Frontend Task Definition | Nginx 컨테이너 |
| API Service | ALB 연동, Auto Scaling |
| Frontend Service | ALB 연동, Auto Scaling |
| ALB | HTTPS 리스너, 경로 기반 라우팅 |
| Target Groups | API (/api/*), Frontend (/*) |

### E3: Database Module
| 리소스 | 설명 |
|---|---|
| RDS Subnet Group | Private Subnets |
| RDS Instance | PostgreSQL 15, 환경별 인스턴스 크기 |
| RDS Parameter Group | force_ssl=1, 한국어 locale |
| Secrets Manager | DB 자격 증명 저장 |

### E4: Cache Module
| 리소스 | 설명 |
|---|---|
| ElastiCache Subnet Group | Private Subnets |
| ElastiCache Replication Group | Redis 7, 단일 노드 (dev/staging), 클러스터 (prod) |

### E5: Storage Module
| 리소스 | 설명 |
|---|---|
| ECR Repository (API) | 이미지 lifecycle: 최근 10개 유지 |
| ECR Repository (Frontend) | 이미지 lifecycle: 최근 10개 유지 |
| S3 Bucket (Assets) | 상품 이미지, AI 생성 이미지 |
| S3 Bucket (ALB Logs) | ALB 접근 로그 |
| S3 Bucket (Terraform State) | Terraform state 파일 (bootstrap) |

### E6: CDN Module
| 리소스 | 설명 |
|---|---|
| CloudFront Distribution | Origin: S3 (정적 자산) + ALB (API) |
| Origin Access Control | S3 접근 제어 |
| ACM Certificate (us-east-1) | CloudFront용 SSL 인증서 |

### E7: Monitoring Module
| 리소스 | 설명 |
|---|---|
| CloudWatch Log Groups | ECS API, ECS Frontend |
| CloudWatch Alarms | CPU, Memory, 5XX, Response Time, RDS, Redis |
| CloudWatch Dashboard | 환경별 통합 대시보드 |
| X-Ray Sampling Rule | API 서비스 추적 |
| Container Insights | ECS 클러스터 메트릭 |
| SNS Topic | 알람 알림 수신 |

## Docker 엔티티

### E8: API Dockerfile
```
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist/ ./dist/
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

### E9: Frontend Dockerfile
```
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## CI/CD 엔티티

### E10: GitHub Actions Workflows
| Workflow | 트리거 | 동작 |
|---|---|---|
| ci.yml | PR, push (feature/*) | Lint, Test, Build |
| deploy-dev.yml | push (feature/*) | Docker Build → ECR → ECS (dev) |
| deploy-staging.yml | push (main) | Docker Build → ECR → ECS (staging) |
| deploy-prod.yml | tag (release/*) | Docker Build → ECR → ECS (prod, 수동 승인) |
| terraform-plan.yml | PR (infra 변경) | Terraform Plan 출력 |

### E11: IAM Roles
| Role | 용도 | 권한 범위 |
|---|---|---|
| ECS Task Role | 애플리케이션 런타임 | Bedrock, S3, SQS, Secrets Manager |
| ECS Execution Role | 컨테이너 시작 | ECR Pull, CloudWatch Logs |
| GitHub Actions OIDC Role | CI/CD 파이프라인 | ECR, ECS, Terraform State S3, DynamoDB |
