# Infra & DevOps NFR Requirements — 질문

아래 질문에 답변해 주세요. 각 질문의 [Answer]: 태그 뒤에 선택지 문자를 입력해 주세요.
해당하는 옵션이 없으면 X를 선택하고 설명을 추가해 주세요.

---

## Question 1
Terraform 실행 환경은 어떻게 구성할까요?

A) GitHub Actions에서만 실행 — 로컬 실행 금지, CI/CD 파이프라인 통해서만 인프라 변경
B) 로컬 + GitHub Actions 병행 — 개발자가 로컬에서 plan 가능, apply는 CI/CD만
C) 로컬 자유 실행 — 개발자가 로컬에서 plan/apply 모두 가능
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
인프라 변경에 대한 승인 프로세스는 어떻게 할까요?

A) PR 기반 — Terraform plan 결과를 PR 코멘트로 출력, 리뷰 후 merge시 apply
B) 수동 승인 — GitHub Actions에서 plan 후 수동 승인 step을 거쳐 apply
C) 자동 적용 — plan 후 자동 apply (dev만), staging/prod는 수동 승인
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 3
재해 복구(DR) 전략은 어떤 수준으로 할까요?

A) 백업만 — RDS 자동 백업 (7일), S3 버전 관리, Terraform state 버전 관리
B) Pilot Light — 백업 + 다른 리전에 최소 인프라 대기 (RDS Read Replica cross-region)
C) 단일 리전만 — DR 별도 구성 없음, Terraform으로 재생성 가능
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
비용 관리 및 최적화 전략은 어떻게 할까요?

A) 태그 기반 비용 추적 — AWS Cost Explorer + 태그별 비용 분석
B) 태그 + 예산 알림 — AWS Budgets로 월별 예산 초과 알림 추가
C) 최소 관리 — 태그만 적용, 별도 비용 관리 도구 없음
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
Secret 관리 방식은 어떻게 할까요?

A) AWS Secrets Manager — DB 비밀번호, API 키 등 모든 secret을 Secrets Manager에 저장
B) AWS SSM Parameter Store (SecureString) — 비용 효율적, 간단한 secret 관리
C) GitHub Secrets + 환경 변수 — CI/CD에서 주입, AWS 서비스 미사용
X) Other (please describe after [Answer]: tag below)

[Answer]: A 

---

## Question 6
배포 롤백 전략은 어떻게 할까요?

A) ECS 자동 롤백 — deployment circuit breaker 활성화, 헬스체크 실패시 자동 롤백
B) Blue/Green 배포 — CodeDeploy 연동, 트래픽 전환 방식
C) Rolling Update만 — 수동 롤백 (이전 이미지 태그로 재배포)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

