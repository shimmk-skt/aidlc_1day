# Frontend Unit — Frontend Components

## 컴포넌트 계층 구조

```
App
├── AuthProvider (Context)
├── CartProvider (Context)
├── WebSocketProvider (Context)
├── ToastProvider (Context)
├── BrowserRouter
│   ├── /login → LoginPage
│   ├── /register → RegisterPage
│   └── Layout
│       ├── Navbar
│       ├── AISidePanel (슬라이드 아웃)
│       ├── / → StorefrontPage
│       │   ├── ProductGrid
│       │   │   └── ProductCard
│       │   └── RecommendationSection
│       ├── /products/:id → ProductDetailPage
│       │   ├── ProductInfo
│       │   ├── AddToCartButton
│       │   └── FrequentlyBoughtTogether
│       ├── /cart → CartPage
│       │   ├── CartItemList
│       │   │   └── CartItemRow
│       │   └── CartSummary
│       ├── /checkout → CheckoutPage (Protected)
│       │   ├── AddressSelector
│       │   ├── OrderSummary
│       │   └── TossPaymentWidget
│       ├── /checkout/success → PaymentSuccessPage
│       ├── /checkout/fail → PaymentFailPage
│       ├── /orders → OrderListPage (Protected)
│       │   └── OrderCard
│       ├── /orders/:id → OrderDetailPage (Protected)
│       │   ├── OrderTimeline
│       │   ├── OrderItemList
│       │   └── OrderActions (취소, 반품, 재주문)
│       ├── /my/addresses → AddressListPage (Protected)
│       │   ├── AddressCard
│       │   └── AddressForm (Daum 우편번호 API)
│       ├── /my/returns/:orderId → ReturnRequestPage (Protected)
│       │   └── ReturnForm (사유 + 설명 + 사진)
│       ├── /admin → AdminDashboardPage (Admin)
│       │   ├── KPICards
│       │   ├── RevenueChart (Recharts)
│       │   └── RecentOrdersFeed
│       ├── /admin/products → AdminProductsPage (Admin)
│       │   ├── ProductTable
│       │   └── ProductForm (생성/수정 모달)
│       ├── /admin/orders → AdminOrdersPage (Admin)
│       │   ├── OrderTable
│       │   └── StatusChangeDropdown
│       └── /admin/inventory → AdminInventoryPage (Admin)
│           ├── InventoryTable
│           ├── StockEditInline
│           └── ForecastChart (Recharts)
```

---

## 모듈별 상세

### FC1: AuthModule

#### LoginPage
- **Props**: 없음
- **State**: email, password, error, isLoading
- **API**: POST /api/auth/login
- **동작**: 폼 제출 → AuthContext.login() → 성공 시 `/` 이동

#### RegisterPage
- **Props**: 없음
- **State**: email, password, name, errors, isLoading
- **API**: POST /api/auth/register
- **동작**: 클라이언트 검증 → AuthContext.register() → 성공 시 `/` 이동

---

### FC2: StorefrontModule

#### StorefrontPage
- **Props**: 없음
- **State**: products, searchQuery, categoryFilter, isLoading
- **API**: GET /api/products?search=&category=
- **동작**: 페이지 로드 시 상품 목록 조회, 필터/검색 시 재조회

#### ProductDetailPage
- **Props**: URL params (id)
- **State**: product, recommendations, isLoading
- **API**: GET /api/products/:id, GET /api/recommendations/product/:id
- **동작**: 상품 상세 + 추천 상품 로드

#### ProductCard
- **Props**: product: Product
- **동작**: 클릭 시 `/products/:id` 이동, "장바구니 담기" 버튼

---

### FC3: CheckoutModule

#### CartPage
- **Props**: 없음
- **State**: CartContext에서 가져옴
- **동작**: 수량 변경, 삭제, Checkout 진행

#### CheckoutPage
- **Props**: 없음
- **State**: selectedAddress, orderSummary, isLoading
- **API**: GET /api/addresses, POST /api/orders
- **동작**: 주소 선택 → 주문 생성 → Toss Payments 위젯 호출

#### TossPaymentWidget
- **Props**: orderId, amount, orderName
- **동작**: Toss Payments SDK requestPayment() 호출

#### PaymentSuccessPage
- **Props**: URL query params (paymentKey, orderId, amount)
- **API**: POST /api/payments/confirm
- **동작**: 결제 승인 확인 → 주문 완료 표시

---

### FC4: OrderModule

#### OrderListPage
- **Props**: 없음
- **State**: orders, isLoading
- **API**: GET /api/orders
- **동작**: 주문 목록 표시, 클릭 시 상세 이동

#### OrderDetailPage
- **Props**: URL params (id)
- **State**: order, isLoading
- **API**: GET /api/orders/:id
- **WebSocket**: order_update 이벤트로 실시간 갱신
- **동작**: 주문 상세 + 타임라인 + 액션 버튼

#### OrderTimeline
- **Props**: statusHistory: StatusHistoryEntry[], currentStatus: OrderStatus
- **동작**: 데스크톱 수평 / 모바일 수직 반응형 타임라인

---

### FC5: SelfServiceModule

#### AddressListPage
- **Props**: 없음
- **State**: addresses, isLoading, showForm
- **API**: GET/POST/PUT/DELETE /api/addresses
- **동작**: 주소 CRUD, 기본 주소 설정

#### AddressForm
- **Props**: address?: Address (수정 시), onSubmit, onCancel
- **State**: formData, errors
- **외부 연동**: Daum 우편번호 API (window.daum.Postcode)
- **동작**: 우편번호 검색 → 주소 자동 완성 → 상세 주소 입력 → 저장

#### ReturnRequestPage
- **Props**: URL params (orderId)
- **State**: reason, description, photos, isLoading, errors
- **API**: POST /api/returns (multipart/form-data)
- **동작**: 사유 선택 → 설명 입력 → 사진 첨부 → 제출

---

### FC6: AdminDashboardModule

#### AdminDashboardPage
- **Props**: 없음
- **State**: dashboardData, isLoading
- **API**: GET /api/analytics/dashboard
- **WebSocket**: new_order, inventory_update 이벤트
- **동작**: KPI 카드 + 매출 차트 + 최근 주문 피드 실시간 갱신

#### KPICards
- **Props**: kpis: InventoryKPIs, totalRevenue, totalOrders, pendingOrders
- **동작**: 4~6개 KPI 카드 그리드 표시

#### RevenueChart
- **Props**: data: { date: string; revenue: number }[]
- **동작**: Recharts AreaChart로 매출 추이 표시

#### AdminInventoryPage
- **Props**: 없음
- **State**: products, forecastData, selectedProductId
- **API**: GET /api/products, GET /api/forecast/:productId, PUT /api/products/:id
- **동작**: 재고 테이블 + 인라인 수량 편집 + 수요 예측 차트

#### AdminOrdersPage
- **Props**: 없음
- **State**: orders, statusFilter, isLoading
- **API**: GET /api/orders, PUT /api/orders/:id/status
- **WebSocket**: new_order, order_update 이벤트
- **동작**: 주문 테이블 + 상태 필터 + 상태 변경

---

### FC7: AIModule

#### AISidePanel
- **Props**: 없음 (전역 상태로 열림/닫힘 관리)
- **State**: isOpen, activeTab, chatMessages, selectedProductId
- **동작**: 우측에서 슬라이드 인/아웃, 탭 전환

#### AIChatTab (Admin 전용)
- **Props**: 없음
- **State**: messages: AIChatMessage[], input, isLoading
- **API**: POST /api/ai/ask
- **동작**: 질문 입력 → 응답 표시 → 대화 이력 유지

#### AIForecastTab (Admin 전용)
- **Props**: 없음
- **State**: selectedProductId, forecastData
- **API**: GET /api/forecast/:productId
- **동작**: 상품 선택 → Recharts 라인 차트 표시

#### AIRecommendationTab (고객)
- **Props**: 없음
- **State**: recommendations
- **API**: GET /api/recommendations/user/:userId
- **동작**: 개인화 추천 목록 표시

---

### FC8: WebSocketModule

#### WebSocketProvider (Context)
- **State**: isConnected, lastEvent
- **동작**: 인증 시 연결, 로그아웃 시 해제, exponential backoff 재연결
- **제공 Hook**: useWebSocket() → { isConnected, subscribe(eventType, callback), unsubscribe }

---

## 공통 컴포넌트

| 컴포넌트 | 용도 |
|---|---|
| Toast | 알림 메시지 (성공/에러/정보) |
| LoadingSpinner | 로딩 상태 표시 |
| EmptyState | 빈 데이터 상태 (일러스트 + 메시지 + CTA) |
| Modal | 모달 다이얼로그 (생성/수정 폼) |
| ConfirmDialog | 확인/취소 다이얼로그 (삭제, 취소 등) |
| Badge | 상태 배지 (주문 상태, 재고 상태) |
| Pagination | 페이지네이션 |

---

## API 통합 포인트 매핑

| 모듈 | Backend Endpoint | 용도 |
|---|---|---|
| FC1 | POST /api/auth/login | 로그인 |
| FC1 | POST /api/auth/register | 회원가입 |
| FC1 | POST /api/auth/refresh | 토큰 갱신 |
| FC1 | POST /api/auth/logout | 로그아웃 |
| FC2 | GET /api/products | 상품 목록 |
| FC2 | GET /api/products/:id | 상품 상세 |
| FC3 | POST /api/orders | 주문 생성 |
| FC3 | POST /api/payments/confirm | 결제 승인 |
| FC4 | GET /api/orders | 주문 목록 |
| FC4 | GET /api/orders/:id | 주문 상세 |
| FC4 | POST /api/orders/:id/reorder | 재주문 |
| FC4 | PUT /api/orders/:id/cancel | 주문 취소 |
| FC5 | GET/POST/PUT/DELETE /api/addresses | 주소 CRUD |
| FC5 | GET /api/orders/:id/tracking | 배송 추적 |
| FC5 | POST /api/returns | 반품 신청 |
| FC6 | GET /api/analytics/dashboard | Dashboard 데이터 |
| FC6 | GET /api/products | 재고 목록 |
| FC6 | PUT /api/products/:id | 재고 수정 |
| FC6 | GET /api/orders | 전체 주문 |
| FC6 | PUT /api/orders/:id/status | 주문 상태 변경 |
| FC7 | POST /api/ai/ask | AI Q&A |
| FC7 | GET /api/forecast/:productId | 수요 예측 |
| FC7 | GET /api/recommendations/product/:id | 상품별 추천 |
| FC7 | GET /api/recommendations/user/:userId | 개인화 추천 |
| FC8 | WebSocket ws://host/ws | 실시간 이벤트 |
