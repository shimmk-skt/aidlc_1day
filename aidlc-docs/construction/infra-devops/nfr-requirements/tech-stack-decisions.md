# Infra & DevOps — Tech Stack Decisions

## IaC (Infrastructure as Code)

| 항목 | 선택 | 근거 |
|---|---|---|
| IaC 도구 | Terraform | 요구사항 명시, AWS 리소스 전체 관리 |
| Terraform 버전 | >= 1.5 | S3 backend native lock 지원 |
| AWS Provider | >= 5.0 | 최신 리소스 지원 |
| State Backend | S3 + DynamoDB Lock | GitHub Actions CI/CD 표준 |
| 모듈 구조 | 리소스 유형별 분리 (7개 모듈) | FD Q1:B |

## 컨테이너

| 항목 | 선택 | 근거 |
|---|---|---|
| Container Runtime | AWS ECS Fargate | 서버리스 컨테이너, 관리 부담 최소화 |
| Container Registry | Amazon ECR | AWS 네이티브, ECS 통합 |
| API Base Image | node:20-alpine | 경량, LTS |
| Frontend Base Image | nginx:alpine | 정적 파일 서빙 |
| Dockerfile 전략 | 단일 Dockerfile (API, Frontend 각각) | FD Q4:A |

## CI/CD

| 항목 | 선택 | 근거 |
|---|---|---|
| CI/CD 도구 | GitHub Actions | FD Q3:A, 코드 저장소 통합 |
| AWS 인증 | OIDC (OpenID Connect) | 장기 자격 증명 없음, 보안 우수 |
| Terraform 실행 | 로컬 plan + CI apply | NFR Q1:B |
| 승인 프로세스 | 수동 승인 step | NFR Q2:B |

## 데이터베이스

| 항목 | 선택 | 근거 |
|---|---|---|
| DB 엔진 | Amazon RDS PostgreSQL 15 | 요구사항 명시 |
| 고가용성 | Single-AZ (dev/staging) + Multi-AZ (prod) | FD Q5:A |
| 백업 | 자동 백업 7일 보존 | NFR Q3:A |

## 캐시

| 항목 | 선택 | 근거 |
|---|---|---|
| 캐시 엔진 | Amazon ElastiCache Redis 7 | 요구사항 명시 |
| 노드 타입 | 환경별 차등 (t3.micro ~ t3.small) | FD Q2:A |

## 네트워크

| 항목 | 선택 | 근거 |
|---|---|---|
| AZ 수 | 2개 | FD Q8:A, 비용 효율적 고가용성 |
| NAT Gateway | 단일 | 비용 최적화 |
| SSL/TLS | ACM (AWS Certificate Manager) | FD Q10:A |
| CDN | CloudFront | 정적 자산 + API 가속 |

## 모니터링

| 항목 | 선택 | 근거 |
|---|---|---|
| 메트릭 | CloudWatch + Container Insights | FD Q6:C |
| 추적 | AWS X-Ray | FD Q6:C |
| 로깅 | CloudWatch Logs (awslogs driver) | ECS 네이티브 |
| 알림 | SNS Topic | CloudWatch Alarms 연동 |

## Secret 관리

| 항목 | 선택 | 근거 |
|---|---|---|
| Secret Store | AWS Secrets Manager | NFR Q5:A |
| 자동 rotation | RDS 비밀번호 | 보안 강화 |

## Auto Scaling

| 항목 | 선택 | 근거 |
|---|---|---|
| 전략 | CPU Target Tracking (70%) | FD Q9:A |
| Min/Max (prod) | 2 / 10 | 고가용성 + 피크 대응 |

## 배포

| 항목 | 선택 | 근거 |
|---|---|---|
| 전략 | Rolling Update | NFR Q6:C |
| 롤백 | 수동 (이전 이미지 태그 재배포) | NFR Q6:C |
