# Requirements Verification Questions

Research Agent 조사 결과와 기존 코드 분석을 바탕으로, 현대화 범위와 우선순위를 결정하기 위한 질문입니다.
각 질문의 `[Answer]:` 태그 뒤에 선택한 옵션 문자를 입력해 주세요.

---

## Question 1
이번 현대화 프로젝트의 범위를 어떻게 설정하시겠습니까? (Research에서 4단계 로드맵 제안)

A) Phase 1만 (Foundation) — 핵심 기술 부채 해결: SQLite→PostgreSQL 마이그레이션, 보안 강화, 입력 검증, Redis 캐싱
B) Phase 1 + Phase 2 (Foundation + Core Features) — 위 항목 + 실시간 재고 Dashboard, 고객 셀프서비스 포털, 주문 상태 Lifecycle, 배송 통합
C) Phase 1 + Phase 2 + Phase 3 (+ Intelligence) — 위 항목 + AI 수요 예측, 자동 재주문, AI 상품 추천
D) 전체 4단계 (+ Scale & Ecosystem) — 위 항목 + Microservices 분해, ERP 통합, Marketplace 통합
X) Other (please describe after [Answer]: )

[Answer]: D

---

## Question 2
Database 마이그레이션 대상으로 어떤 것을 선호하시나요?

A) Amazon RDS PostgreSQL — 관리형 서비스, Multi-AZ, Read Replica 지원
B) Amazon Aurora PostgreSQL — 더 높은 성능, 자동 스케일링, 비용 높음
C) Amazon DynamoDB — NoSQL, Serverless, 대규모 트래픽에 적합 (스키마 재설계 필요)
D) 현재 SQLite 유지 (개발/프로토타입 용도로만 사용)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
결제 시스템 통합이 필요합니까? (현재 결제 기능 없음)

A) Yes — Stripe 통합 (PCI DSS 4.0 준수, client-side tokenization)
B) Yes — 다른 결제 게이트웨이 선호 (PayPal, Square 등)
C) No — 결제 기능은 이번 범위에서 제외
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 4
배포 인프라를 어떻게 구성하시겠습니까?

A) AWS ECS Fargate — 컨테이너 기반, 서버리스 컴퓨팅, 자동 스케일링
B) AWS EC2 — 전통적 서버 기반, 직접 관리
C) AWS Lambda + API Gateway — 완전 서버리스
D) 현재 deploy.sh 스크립트 유지
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 5
Frontend 현대화 방향은 어떻게 하시겠습니까? (현재 인라인 스타일 사용)

A) Tailwind CSS 도입 — 유틸리티 퍼스트, 빠른 개발, 모바일 반응형 내장
B) CSS Modules — 컴포넌트 스코프 스타일, 기존 CSS 활용
C) Styled Components — CSS-in-JS, 동적 스타일링
D) 현재 인라인 스타일 유지
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6
실시간 기능의 범위를 어떻게 설정하시겠습니까?

A) WebSocket 기반 — 재고 실시간 업데이트 + 주문 상태 실시간 알림 + Admin 실시간 Dashboard
B) Server-Sent Events (SSE) — 서버→클라이언트 단방향 실시간 업데이트 (구현 간단)
C) Polling 기반 — 주기적 API 호출 (가장 간단, 실시간성 낮음)
D) 실시간 기능 불필요
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7
AI/ML 기능 확장 범위를 어떻게 설정하시겠습니까? (현재 Bedrock 이미지 생성만 구현)

A) 기존 이미지 생성 유지 + AI 수요 예측 (Amazon Forecast) + AI 상품 추천 (Amazon Personalize)
B) 기존 이미지 생성 유지 + Bedrock Claude 기반 재고 Q&A + 수요 내러티브 생성
C) 기존 이미지 생성 유지 + 기본 통계 기반 수요 예측 (ML 서비스 없이)
D) 기존 이미지 생성만 유지 (AI 확장 불필요)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 8
테스트 전략을 어떻게 설정하시겠습니까? (현재 테스트 0%)

A) 포괄적 — Unit Test + Integration Test + E2E Test (Jest + Supertest + Playwright)
B) 핵심만 — Unit Test + Integration Test (Jest + Supertest)
C) 최소한 — Unit Test만 (Jest)
D) 테스트 추가 불필요
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 9
고객 셀프서비스 포털에 어떤 기능을 포함하시겠습니까?

A) 전체 — 주문 내역, 실시간 배송 추적, 반품 신청, 주소록 관리, 원클릭 재주문
B) 핵심만 — 주문 내역, 주문 상태 확인, 반품 신청
C) 최소한 — 주문 내역 조회만 (현재 수준 유지)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10
IaC (Infrastructure as Code) 도구를 어떤 것으로 사용하시겠습니까?

A) AWS CDK (TypeScript) — 기존 TypeScript 스택과 일관성, 프로그래밍 방식
B) AWS CloudFormation — 선언적, AWS 네이티브
C) Terraform — 멀티 클라우드, 선언적
D) IaC 불필요 (deploy.sh 유지)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 11: Security Extensions
이 프로젝트에 보안 extension 규칙을 적용해야 합니까?

A) Yes — 모든 SECURITY 규칙을 blocking constraint로 적용 (프로덕션 수준 애플리케이션에 권장)
B) No — 모든 SECURITY 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 12
예상 사용자 규모와 트래픽은 어느 정도입니까?

A) 소규모 — 동시 사용자 100명 미만, 일일 주문 100건 미만
B) 중규모 — 동시 사용자 100~1,000명, 일일 주문 100~1,000건
C) 대규모 — 동시 사용자 1,000명 이상, 일일 주문 1,000건 이상
X) Other (please describe after [Answer]: tag below)

[Answer]: B
