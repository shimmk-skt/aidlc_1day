# Infra & DevOps — NFR Requirements

## NFR-INFRA-01: Terraform 실행 및 거버넌스

### 실행 환경
- **로컬**: `terraform plan` 허용 (개발자 검증용)
- **CI/CD (GitHub Actions)**: `terraform apply` 전용 — 로컬 apply 금지
- OIDC 기반 IAM Role로 GitHub Actions에서 AWS 인증

### 변경 승인 프로세스
- GitHub Actions에서 `terraform plan` 자동 실행
- plan 결과 확인 후 **수동 승인 step**을 거쳐 `terraform apply`
- 모든 환경(dev/staging/prod)에 수동 승인 적용

### State 관리
- S3 Backend + DynamoDB Lock
- S3 Versioning 활성화 (state 복구)
- 환경별 별도 state 파일 (`env:{environment}/terraform.tfstate`)

---

## NFR-INFRA-02: 가용성 및 재해 복구

### 가용성
- 2개 AZ 배포 (모든 환경)
- RDS: dev/staging Single-AZ, prod Multi-AZ
- ECS: prod 최소 2 tasks (AZ 분산)
- ALB cross-zone load balancing 활성화

### 재해 복구 (DR)
- **전략**: 백업 기반 복구
- RDS 자동 백업: 7일 보존
- S3 버전 관리 활성화
- Terraform state S3 버전 관리
- Terraform 코드로 인프라 재생성 가능 (IaC 기반 DR)

---

## NFR-INFRA-03: 보안

### Secret 관리
- **AWS Secrets Manager** 사용
- DB 비밀번호, API 키, 외부 서비스 자격 증명 저장
- ECS Task에서 Secrets Manager 참조 (환경 변수 주입)
- Terraform으로 secret 리소스 정의 (값은 수동 설정)
- 자동 rotation 설정 (RDS 비밀번호)

### 네트워크 보안
- Private Subnet: ECS, RDS, ElastiCache
- Security Group 최소 권한 (BR-01 참조)
- NAT Gateway: Private Subnet 아웃바운드만
- ALB: HTTPS만 (HTTP → HTTPS 리다이렉트)

### IAM
- Least-privilege 원칙
- ECS Task Role / Execution Role 분리
- GitHub Actions OIDC Role (장기 자격 증명 없음)

### 암호화
- 모든 데이터 저장소 encryption at rest (BR-02 참조)
- 모든 통신 TLS 1.2+ (BR-02 참조)

---

## NFR-INFRA-04: 배포 및 롤백

### 배포 전략
- **Rolling Update** (ECS 기본)
- Minimum healthy percent: 100%
- Maximum percent: 200%
- Health check grace period: 60초

### 롤백 전략
- **수동 롤백**: 이전 ECR 이미지 태그로 ECS 서비스 업데이트
- ECR 이미지 lifecycle: 최근 10개 유지 (롤백 가능 범위)
- Terraform: `terraform plan` 으로 변경 사항 확인 후 이전 커밋으로 revert & apply

---

## NFR-INFRA-05: 모니터링 및 관측성

### CloudWatch
- ECS Container Insights 활성화
- CloudWatch Alarms (CPU, Memory, 5XX, Response Time, RDS, Redis)
- CloudWatch Dashboard (환경별 통합)
- Log Groups: 보존 기간 dev 7일, staging 30일, prod 90일

### X-Ray
- API 서비스 분산 추적
- Sampling rule 설정

### 알림
- SNS Topic → 알람 수신
- 알람 임계값: business-logic-model.md 참조

---

## NFR-INFRA-06: 비용 관리

### 태그 기반 비용 추적
- 필수 태그: Project, Environment, ManagedBy, Owner (BR-09 참조)
- AWS Cost Explorer에서 태그별 비용 분석
- 환경별 비용 분리 추적

### 비용 최적화
- dev/staging: 최소 사양 인스턴스
- NAT Gateway: 단일 (비용 최적화)
- ECR lifecycle: 오래된 이미지 자동 삭제

---

## NFR-INFRA-07: 취약점 관리

- CI/CD에서 `npm audit` 실행
- ECR scan on push 활성화
- prod 배포시 CRITICAL 취약점 차단
