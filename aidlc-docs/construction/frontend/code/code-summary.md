# Frontend Unit — Code Generation Summary

## 생성/수정 파일 목록

### 수정된 파일 (17개)
- `package.json` — 의존성 추가
- `vite.config.ts` — proxy, vitest 설정
- `tsconfig.json` — (기존 strict 유지)
- `index.html` — 한국어 lang, 외부 스크립트
- `src/index.css` — Tailwind directives
- `src/main.tsx` — QueryClientProvider
- `src/App.tsx` — Provider 구성, 코드 스플리팅, 신규 라우트
- `src/context/AuthContext.tsx` — 토큰 갱신, 메모리 저장
- `src/components/Layout.tsx` — Tailwind 전환
- `src/pages/Login.tsx` — Tailwind, 접근성
- `src/pages/Register.tsx` — Tailwind, 비밀번호 정책
- `src/pages/Storefront.tsx` — Tailwind, React Query, 장바구니
- `src/pages/ProductDetail.tsx` — Tailwind, 추천 상품
- `src/pages/Orders.tsx` — Tailwind, React Query
- `src/pages/AdminDashboard.tsx` — Tailwind, Recharts KPI
- `src/pages/AdminProducts.tsx` — Tailwind, 반응형
- `src/pages/AdminOrders.tsx` — Tailwind, 상태 변경
- `src/pages/AdminInventory.tsx` — Tailwind, 인라인 편집, 수요 예측

### 신규 생성 파일 (53개)
- 설정: `tailwind.config.js`, `postcss.config.js`, `nginx.conf`, `Dockerfile`, `playwright.config.ts`
- 타입 (9): `src/types/{auth,product,order,address,returns,payment,analytics,ai,websocket}.ts`
- API (11): `src/api/{client,auth,products,orders,addresses,returns,payments,analytics,ai,forecast,recommendations}.ts`
- 유틸 (3): `src/utils/{validation,format,constants}.ts`
- Context (4): `src/context/{CartContext,WebSocketContext,ToastContext,AIPanelContext}.tsx`
- Hooks (6): `src/hooks/queries/{useProducts,useOrders,useAddresses,useDashboard,useForecast,useRecommendations}.ts`
- 컴포넌트 (12): `src/components/{Navbar,ProtectedRoute,GlobalErrorBoundary,PageErrorBoundary,Toast,LoadingSpinner,EmptyState,Modal,ConfirmDialog,Badge,Pagination,OrderTimeline,AISidePanel}.tsx`
- 페이지 (6): `src/pages/{Cart,Checkout,PaymentSuccess,PaymentFail,OrderDetail,AddressList,ReturnRequest}.tsx`
- 테스트 (6): `tests/setup.ts`, `tests/unit/{validation,format}.test.ts`, `tests/components/Badge.test.tsx`, `tests/e2e/{auth,checkout,admin}.spec.ts`

## Story 커버리지
- US-N.2.1 ✅ Tailwind CSS 도입
- US-N.2.2 ✅ 모바일 반응형 Admin Dashboard
- US-2.1.3 ✅ 재고 KPI Dashboard
- US-2.1.4 ✅ Admin Dashboard 실시간 주문 피드
- US-2.2.1 ✅ 주문 내역 확장
- US-2.2.2 ✅ 실시간 배송 추적
- US-2.2.3 ✅ 반품 신청
- US-2.2.4 ✅ 주소록 관리
- US-2.2.5 ✅ 원클릭 재주문
- US-2.4.1 ✅ Toss Payments SDK 통합 (client)
