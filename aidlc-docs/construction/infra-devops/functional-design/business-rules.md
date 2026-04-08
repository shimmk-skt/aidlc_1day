# Infra & DevOps — Business Rules & Constraints

## BR-01: 네트워크 격리 규칙
- Public Subnet: ALB, NAT Gateway만 배치
- Private Subnet: ECS Tasks, RDS, ElastiCache 배치
- RDS Security Group: ECS Tasks SG에서만 5432 포트 인바운드 허용
- ElastiCache Security Group: ECS Tasks SG에서만 6379 포트 인바운드 허용
- ECS Tasks Security Group: ALB SG에서만 애플리케이션 포트 인바운드 허용

## BR-02: 암호화 규칙 (SECURITY-01)
- RDS: storage_encrypted = true (AWS managed key)
- RDS: TLS 연결 강제 (rds.force_ssl = 1)
- ElastiCache: transit_encryption_enabled = true, at_rest_encryption_enabled = true
- S3: SSE-S3 기본 암호화, bucket policy로 비TLS 요청 거부
- ALB: HTTPS 리스너만 (HTTP → HTTPS 리다이렉트)
- CloudFront: TLS 1.2 최소 프로토콜

## BR-03: SSL/TLS 인증서 규칙 (Q10: ACM)
- ACM 퍼블릭 인증서 사용
- ALB HTTPS 리스너에 ACM 인증서 연결
- CloudFront에 ACM 인증서 연결 (us-east-1 리전)
- 자동 갱신 활성화

## BR-04: 접근 로깅 규칙 (SECURITY-02)
- ALB: access log → S3 버킷 (`inventrix-alb-logs-{env}`)
- CloudFront: standard logging → S3 버킷
- S3 로그 버킷: 90일 lifecycle 정책

## BR-05: IAM 최소 권한 규칙
- ECS Task Role: 필요한 AWS 서비스만 접근 (Bedrock, S3, SQS)
- ECS Execution Role: ECR pull, CloudWatch Logs 쓰기만
- CI/CD Role: OIDC 기반, 필요한 리소스만 접근
- Terraform State S3: CI/CD Role만 접근

## BR-06: 환경 분리 규칙
- 환경별 별도 VPC (CIDR 겹침 없음)
- 환경별 별도 Terraform state 파일
- 환경별 별도 ECR 태그 전략 (`{env}-{git-sha}`)
- 환경 간 네트워크 격리 (cross-env 접근 불가)

## BR-07: 배포 규칙
- dev: 자동 배포 (feature branch push)
- staging: 자동 배포 (main branch push)
- prod: 수동 승인 필수 (release tag)
- Rolling update (ECS deployment circuit breaker 활성화)
- Health check 통과 후에만 이전 task 종료

## BR-08: 고가용성 규칙
- 2개 AZ 배포 (Q8: A)
- RDS: dev/staging Single-AZ, prod Multi-AZ (Q5: A)
- ECS: prod 최소 2 tasks (AZ 분산)
- ALB: cross-zone load balancing 활성화

## BR-09: 태깅 규칙
- 모든 AWS 리소스에 필수 태그:
  - `Project`: inventrix
  - `Environment`: dev/staging/prod
  - `ManagedBy`: terraform
  - `Owner`: team

## BR-10: 취약점 스캔 규칙
- CI/CD에서 `npm audit` 실행
- Docker 이미지 ECR 스캔 활성화 (scan on push)
- 심각도 CRITICAL 발견 시 배포 차단 (prod만)

## BR-11: 로깅 규칙 (SECURITY-03)
- ECS Tasks → CloudWatch Logs (awslogs driver)
- Log Group 보존: dev 7일, staging 30일, prod 90일
- 구조화된 JSON 로그 포맷 (timestamp, requestId, level, message)
