# Requirements Clarification Questions

답변 분석 중 2가지 모호한 점과 1가지 잠재적 모순이 발견되었습니다. 아래 질문에 답변해 주세요.

---

## Ambiguity 1: 결제 게이트웨이 선택
Q3에서 "B) 다른 결제 게이트웨이 선호 (PayPal, Square 등)"를 선택하셨습니다. 구체적으로 어떤 결제 게이트웨이를 사용하시겠습니까?

### Clarification Question 1
어떤 결제 게이트웨이를 통합하시겠습니까?

A) PayPal — 글로벌 인지도 높음, Checkout SDK 제공, PCI 범위 축소 가능
B) Square — POS 통합 강점, 온/오프라인 통합 결제
C) Toss Payments — 한국 시장 특화, 간편결제 지원
D) 복수 게이트웨이 (PayPal + Stripe 등 — 고객 선택 가능)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Potential Contradiction: EC2 vs Microservices
Q1(D)에서 전체 4단계(Microservices 분해 포함)를 선택하셨고, Q4(B)에서 EC2를 선택하셨습니다. Microservices 아키텍처에서 EC2는 각 서비스별 인스턴스 관리 부담이 커질 수 있습니다.

### Clarification Question 2
Microservices 배포 전략을 어떻게 하시겠습니까?

A) EC2 유지 — Docker Compose로 단일 EC2에 여러 서비스 배포 (초기 단순, 스케일링 제한)
B) EC2 + Docker — 여러 EC2 인스턴스에 서비스별 컨테이너 배포 (수동 관리)
C) 초기 EC2 → Phase 4에서 ECS Fargate로 전환 (점진적 마이그레이션)
D) 처음부터 ECS Fargate로 변경 (Q4 답변 수정)
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Ambiguity 2: ERP/Marketplace 통합 범위
Q1(D)에서 전체 4단계를 선택하셨는데, ERP 통합과 Marketplace 통합의 구체적 대상이 필요합니다.

### Clarification Question 3
ERP 통합 대상은 무엇입니까?

A) QuickBooks — 중소기업 회계/재고 관리, API 잘 정비됨
B) NetSuite — 대기업 ERP, 포괄적 기능
C) SAP Business One — 중견기업 ERP
D) ERP 통합은 Phase 4에서 구체화 (지금은 미정)
X) Other (please describe after [Answer]: tag below)

[Answer]: D

### Clarification Question 4
Marketplace 통합 대상은 무엇입니까?

A) Amazon Marketplace — 글로벌 최대 마켓플레이스
B) eBay — 글로벌 경매/판매 플랫폼
C) Coupang — 한국 시장 특화
D) 복수 마켓플레이스 (Amazon + eBay 등)
E) Marketplace 통합은 Phase 4에서 구체화 (지금은 미정)
X) Other (please describe after [Answer]: tag below)

[Answer]: C
