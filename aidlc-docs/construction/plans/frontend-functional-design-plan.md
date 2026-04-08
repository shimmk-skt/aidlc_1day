# Frontend Unit — Functional Design Plan

## Unit 정보
- **Unit**: Unit 2 — Frontend (FE)
- **정의**: React 18 + TypeScript 기반 SPA의 전체 현대화
- **할당 Stories**: 14개 (US-2.1.3, US-2.1.4, US-2.2.1~US-2.2.5, US-2.4.1, US-4.4.1, US-4.4.2, US-N.2.1, US-N.2.2)
- **포함 모듈**: FC1(AuthModule), FC2(StorefrontModule), FC3(CheckoutModule), FC4(OrderModule), FC5(SelfServiceModule), FC6(AdminDashboardModule), FC7(AIModule), FC8(WebSocketModule)

---

## Execution Plan

### Step 1: 질문 수집 및 분석
- [x] Functional Design 질문 파일 생성
- [x] 사용자 답변 수집
- [x] 답변 분석 및 모호성 확인

### Step 2: Domain Entities 설계
- [x] Frontend 상태 모델 정의 (User, Product, Order, Address, Cart, Return 등)
- [x] API 응답 타입 정의
- [x] 공유 타입/인터페이스 정의

### Step 3: Business Logic Model 설계
- [x] 인증 흐름 (로그인, 회원가입, 토큰 갱신, 로그아웃)
- [x] 주문 흐름 (장바구니 → 결제 → 주문 확인)
- [x] 셀프서비스 흐름 (배송 추적, 반품, 주소록, 재주문)
- [x] Admin 흐름 (Dashboard KPI, 주문/재고 관리)
- [x] WebSocket 실시간 업데이트 흐름

### Step 4: Business Rules 설계
- [x] 폼 검증 규칙 (로그인, 회원가입, 주소, 반품)
- [x] 권한 기반 라우팅 규칙 (고객 vs Admin)
- [x] 주문 상태별 UI 표시 규칙
- [x] 에러 처리 및 사용자 피드백 규칙

### Step 5: Frontend Components 설계
- [x] 컴포넌트 계층 구조 정의
- [x] 각 모듈별 Props/State 정의
- [x] API 통합 포인트 매핑 (컴포넌트 ↔ Backend endpoint)
- [x] 사용자 인터랙션 흐름 정의

### Step 6: 산출물 생성
- [x] `domain-entities.md` 생성
- [x] `business-logic-model.md` 생성
- [x] `business-rules.md` 생성
- [x] `frontend-components.md` 생성

---

## Questions

아래 질문에 대한 답변은 별도 파일에서 수집합니다:
`aidlc-docs/construction/plans/frontend-functional-design-questions.md`
