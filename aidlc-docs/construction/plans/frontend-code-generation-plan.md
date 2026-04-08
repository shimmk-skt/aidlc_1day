# Frontend Unit — Code Generation Plan

## Unit 정보
- **Unit**: Unit 2 — Frontend (FE)
- **프로젝트 타입**: Brownfield (기존 코드 수정 + 신규 파일 생성)
- **코드 위치**: `packages/frontend/`
- **할당 Stories**: US-2.1.3, US-2.1.4, US-2.2.1~US-2.2.5, US-2.4.1, US-N.2.1, US-N.2.2 (Phase 4 PWA 제외)

## 기존 파일 (수정 대상)
- `package.json` — 의존성 추가
- `vite.config.ts` — proxy 설정, Tailwind 플러그인
- `tsconfig.json` — strict 모드
- `index.html` — 외부 스크립트 (Toss, Daum)
- `src/main.tsx` — Provider 구성
- `src/App.tsx` — 라우터 + 코드 스플리팅
- `src/index.css` — Tailwind directives
- `src/context/AuthContext.tsx` — 토큰 갱신 로직 추가
- `src/components/Layout.tsx` — Tailwind 전환 + 반응형
- `src/pages/Login.tsx` — Tailwind 전환
- `src/pages/Register.tsx` — Tailwind 전환
- `src/pages/Storefront.tsx` — Tailwind + 추천 섹션
- `src/pages/ProductDetail.tsx` — Tailwind + 추천 + 장바구니
- `src/pages/Orders.tsx` — Tailwind + 상세 확장
- `src/pages/AdminDashboard.tsx` — Tailwind + 실시간 KPI
- `src/pages/AdminProducts.tsx` — Tailwind 전환
- `src/pages/AdminOrders.tsx` — Tailwind + 상태 변경
- `src/pages/AdminInventory.tsx` — Tailwind + 수요 예측

---

## Execution Steps

### Step 1: 프로젝트 설정 및 의존성
- [x] `package.json` 수정 — 신규 의존성 추가 (tailwindcss, @tanstack/react-query, recharts 등)
- [x] `tailwind.config.js` 생성
- [x] `postcss.config.js` 생성
- [x] `vite.config.ts` 수정 — proxy 설정 (/api, /ws)
- [x] `tsconfig.json` 수정 — strict 모드
- [x] `index.html` 수정 — Toss Payments SDK, Daum 우편번호 스크립트 (SRI)
- [x] `src/index.css` 수정 — Tailwind directives
- [x] `nginx.conf` 생성 — SPA 라우팅, 보안 헤더, gzip
- [x] `Dockerfile` 생성 — multi-stage 빌드
- [x] `playwright.config.ts` 생성
- Stories: US-N.2.1 (Tailwind 설정)

### Step 2: 공유 타입 정의
- [x] `src/types/auth.ts` 생성
- [x] `src/types/product.ts` 생성
- [x] `src/types/order.ts` 생성
- [x] `src/types/address.ts` 생성
- [x] `src/types/returns.ts` 생성
- [x] `src/types/payment.ts` 생성
- [x] `src/types/analytics.ts` 생성
- [x] `src/types/ai.ts` 생성
- [x] `src/types/websocket.ts` 생성

### Step 3: 유틸리티 및 API Client Layer
- [x] `src/utils/validation.ts` 생성 — 폼 검증 함수
- [x] `src/utils/format.ts` 생성 — 날짜, 통화 포맷
- [x] `src/utils/constants.ts` 생성 — 주문 상태 색상, 라벨
- [x] `src/api/client.ts` 생성 — fetch wrapper, 토큰 갱신 인터셉터
- [x] `src/api/auth.ts` 생성
- [x] `src/api/products.ts` 생성
- [x] `src/api/orders.ts` 생성
- [x] `src/api/addresses.ts` 생성
- [x] `src/api/returns.ts` 생성
- [x] `src/api/payments.ts` 생성
- [x] `src/api/analytics.ts` 생성
- [x] `src/api/ai.ts` 생성
- [x] `src/api/forecast.ts` 생성
- [x] `src/api/recommendations.ts` 생성

### Step 4: Context Providers
- [x] `src/context/AuthContext.tsx` 수정 — 토큰 갱신, refreshToken 관리
- [x] `src/context/CartContext.tsx` 생성 — 장바구니 (localStorage 동기화)
- [x] `src/context/WebSocketContext.tsx` 생성 — WebSocket 연결, 재연결, 이벤트 분배
- [x] `src/context/ToastContext.tsx` 생성 — 토스트 알림
- [x] `src/context/AIPanelContext.tsx` 생성 — AI 사이드 패널 상태

### Step 5: React Query Hooks
- [x] `src/hooks/queries/useProducts.ts` 생성
- [x] `src/hooks/queries/useOrders.ts` 생성
- [x] `src/hooks/queries/useAddresses.ts` 생성
- [x] `src/hooks/queries/useDashboard.ts` 생성
- [x] `src/hooks/queries/useForecast.ts` 생성
- [x] `src/hooks/queries/useRecommendations.ts` 생성

### Step 6: 공통 UI 컴포넌트
- [x] `src/components/Navbar.tsx` 생성 — 반응형 네비게이션 (햄버거 메뉴)
- [x] `src/components/Layout.tsx` 수정 — Tailwind 전환, Navbar 분리
- [x] `src/components/ProtectedRoute.tsx` 생성 — 라우트 가드 분리
- [x] `src/components/GlobalErrorBoundary.tsx` 생성
- [x] `src/components/PageErrorBoundary.tsx` 생성
- [x] `src/components/Toast.tsx` 생성
- [x] `src/components/LoadingSpinner.tsx` 생성
- [x] `src/components/EmptyState.tsx` 생성
- [x] `src/components/Modal.tsx` 생성
- [x] `src/components/ConfirmDialog.tsx` 생성
- [x] `src/components/Badge.tsx` 생성
- [x] `src/components/Pagination.tsx` 생성
- [x] `src/components/AISidePanel.tsx` 생성
- [x] `src/components/OrderTimeline.tsx` 생성 — 반응형 (수평/수직)
- Stories: US-N.2.1, US-N.2.2

### Step 7: 앱 엔트리포인트 및 라우터
- [x] `src/main.tsx` 수정 — QueryClientProvider 추가
- [x] `src/App.tsx` 수정 — Provider 구성, 코드 스플리팅, 신규 라우트 추가
- Stories: 전체

### Step 8: 인증 페이지 (FC1: AuthModule)
- [x] `src/pages/Login.tsx` 수정 — Tailwind 전환, 접근성
- [x] `src/pages/Register.tsx` 수정 — Tailwind 전환, 비밀번호 정책 표시, 접근성

### Step 9: 상품 탐색 페이지 (FC2: StorefrontModule)
- [x] `src/pages/Storefront.tsx` 수정 — Tailwind, React Query, 추천 섹션, 반응형 그리드
- [x] `src/pages/ProductDetail.tsx` 수정 — Tailwind, 장바구니 담기, 추천 상품
- Stories: US-3.3.1, US-3.3.2 (추천 UI)

### Step 10: 장바구니 및 결제 (FC3: CheckoutModule)
- [x] `src/pages/Cart.tsx` 생성 — 장바구니 페이지
- [x] `src/pages/Checkout.tsx` 생성 — 주소 선택 + Toss Payments 위젯
- [x] `src/pages/PaymentSuccess.tsx` 생성 — 결제 성공
- [x] `src/pages/PaymentFail.tsx` 생성 — 결제 실패
- Stories: US-2.4.1 (Toss Payments client)

### Step 11: 주문 관리 (FC4: OrderModule)
- [x] `src/pages/Orders.tsx` 수정 — Tailwind, 주문 카드, 상세 링크
- [x] `src/pages/OrderDetail.tsx` 생성 — 주문 상세, 타임라인, 액션 버튼
- Stories: US-2.2.1 (주문 내역 확장), US-2.2.5 (재주문)

### Step 12: 셀프서비스 (FC5: SelfServiceModule)
- [x] `src/pages/AddressList.tsx` 생성 — 주소록 CRUD + Daum 우편번호
- [x] `src/pages/ReturnRequest.tsx` 생성 — 반품 신청 (사유+설명+사진)
- Stories: US-2.2.2 (배송 추적), US-2.2.3 (반품), US-2.2.4 (주소록)

### Step 13: Admin Dashboard (FC6: AdminDashboardModule)
- [x] `src/pages/AdminDashboard.tsx` 수정 — Tailwind, 실시간 KPI, Recharts, 주문 피드
- [x] `src/pages/AdminProducts.tsx` 수정 — Tailwind, 반응형 테이블
- [x] `src/pages/AdminOrders.tsx` 수정 — Tailwind, 상태 변경 드롭다운, 실시간
- [x] `src/pages/AdminInventory.tsx` 수정 — Tailwind, 인라인 편집, 수요 예측 차트
- Stories: US-2.1.3 (재고 KPI), US-2.1.4 (실시간 주문 피드), US-N.2.2 (반응형 Admin)

### Step 14: 단위/컴포넌트 테스트
- [x] `tests/setup.ts` 생성 — Vitest 설정
- [x] `tests/unit/validation.test.ts` 생성
- [x] `tests/unit/format.test.ts` 생성
- [x] `tests/components/Login.test.tsx` 생성
- [x] `tests/components/OrderTimeline.test.tsx` 생성
- [x] `tests/components/Badge.test.tsx` 생성

### Step 15: E2E 테스트
- [x] `tests/e2e/auth.spec.ts` 생성
- [x] `tests/e2e/checkout.spec.ts` 생성
- [x] `tests/e2e/admin.spec.ts` 생성

### Step 16: 문서 및 배포 산출물
- [x] `aidlc-docs/construction/frontend/code/code-summary.md` 생성
