# Infra & DevOps Functional Design — 질문

아래 질문에 답변해 주세요. 각 질문의 [Answer]: 태그 뒤에 선택지 문자를 입력해 주세요.
해당하는 옵션이 없으면 X를 선택하고 설명을 추가해 주세요.

---

## Question 1
Terraform 모듈 구조를 어떻게 구성할까요?

A) 단일 모듈 — 모든 리소스를 하나의 모듈에 정의 (소규모 프로젝트에 적합)
B) 리소스 유형별 모듈 분리 — networking, compute, database, cache, cdn, monitoring 등 개별 모듈
C) 환경별 workspace — 모듈은 공유하되 Terraform workspace로 dev/staging/prod 분리
D) Terragrunt 기반 — Terragrunt로 DRY 원칙 적용, 환경별 구성 관리
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
환경(dev/staging/prod)별 인프라 차이를 어떻게 관리할까요?

A) 동일 아키텍처, 인스턴스 크기만 다름 — dev는 최소 사양, prod는 프로덕션 사양
B) dev는 단순화 (Single-AZ, 최소 리소스), staging은 prod와 동일 구성
C) dev만 구성 — staging/prod는 추후 확장
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
CI/CD 파이프라인 도구로 무엇을 사용할까요?

A) GitHub Actions
B) AWS CodePipeline + CodeBuild
C) GitLab CI/CD
D) Jenkins
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
Docker 이미지 빌드 전략은 어떻게 할까요?

A) 단일 Dockerfile — API와 Frontend 각각 하나의 Dockerfile (단순)
B) Multi-stage Dockerfile — 빌드/런타임 분리로 이미지 크기 최적화
C) Distroless 베이스 이미지 — 최소 공격 표면 (보안 강화)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
RDS PostgreSQL의 고가용성 구성은 어떻게 할까요?

A) Single-AZ (dev/staging) + Multi-AZ (prod) — 비용 최적화
B) 모든 환경 Multi-AZ — 일관된 아키텍처
C) Single-AZ만 — 비용 절감 우선
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6
모니터링 및 알림 구성 범위는 어떻게 할까요?

A) CloudWatch 기본 메트릭 + 알람 (CPU, 메모리, 디스크, 5xx 에러)
B) CloudWatch + X-Ray 분산 추적 + 커스텀 Dashboard
C) CloudWatch + X-Ray + Container Insights + 상세 커스텀 메트릭
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 7
Terraform state 관리 방식은 어떻게 할까요?

A) S3 Backend + DynamoDB Lock — 표준 원격 state 관리
B) Terraform Cloud — 원격 실행 및 state 관리
C) 로컬 state — 개인 개발 환경용 (프로덕션 비권장)
X) Other (please describe after [Answer]: tag below)

[Answer]: Github 에서 제공 혹은 널리 이용되는 Terraform State 저장 방식이 있다면 그걸 이용해줘

---

## Question 8
VPC 네트워크 설계에서 가용 영역(AZ) 수는 몇 개로 할까요?

A) 2개 AZ — 최소 고가용성 (비용 효율적)
B) 3개 AZ — 표준 고가용성 (권장)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9
ECS Fargate Auto Scaling 전략은 어떻게 할까요?

A) CPU 기반 Target Tracking — CPU 사용률 기준 스케일링
B) CPU + 메모리 복합 — 두 메트릭 모두 모니터링
C) 요청 수 기반 — ALB 요청 수 기준 스케일링
D) Step Scaling — 단계별 세밀한 스케일링 정책
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10
SSL/TLS 인증서 관리 방식은 어떻게 할까요?

A) ACM (AWS Certificate Manager) — 무료 퍼블릭 인증서, ALB/CloudFront 연동
B) Let's Encrypt — 자체 관리
C) 자체 서명 인증서 — 개발 환경 전용
X) Other (please describe after [Answer]: tag below)

[Answer]: A 
