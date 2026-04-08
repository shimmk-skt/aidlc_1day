# Frontend Unit — Logical Components

## 디렉토리 구조 (타입 기반)

```
packages/frontend/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── playwright.config.ts
├── public/
├── src/
│   ├── main.tsx                    # 앱 엔트리포인트
│   ├── App.tsx                     # 라우터 + Provider 구성
│   ├── index.css                   # Tailwind directives
│   ├── types/                      # 공유 타입 정의
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── address.ts
│   │   ├── returns.ts
│   │   ├── payment.ts
│   │   ├── analytics.ts
│   │   ├── ai.ts
│   │   └── websocket.ts
│   ├── api/                        # API 클라이언트 레이어
│   │   ├── client.ts               # fetch wrapper (인터셉터, 토큰 갱신)
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── addresses.ts
│   │   ├── returns.ts
│   │   ├── payments.ts
│   │   ├── analytics.ts
│   │   ├── ai.ts
│   │   ├── forecast.ts
│   │   └── recommendations.ts
│   ├── hooks/                      # 커스텀 훅
│   │   ├── useAuth.ts              # (기존 AuthContext에서 분리)
│   │   ├── useCart.ts
│   │   ├── useWebSocket.ts
│   │   ├── useToast.ts
│   │   ├── useAIPanel.ts
│   │   └── queries/                # React Query 훅
│   │       ├── useProducts.ts
│   │       ├── useOrders.ts
│   │       ├── useAddresses.ts
│   │       ├── useDashboard.ts
│   │       ├── useForecast.ts
│   │       └── useRecommendations.ts
│   ├── context/                    # React Context Providers
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── WebSocketContext.tsx
│   │   ├── ToastContext.tsx
│   │   └── AIPanelContext.tsx
│   ├── components/                 # 공통 UI 컴포넌트
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── GlobalErrorBoundary.tsx
│   │   ├── PageErrorBoundary.tsx
│   │   ├── Toast.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Modal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Badge.tsx
│   │   ├── Pagination.tsx
│   │   └── AISidePanel.tsx
│   ├── pages/                      # 라우트 페이지
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Storefront.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── PaymentSuccess.tsx
│   │   ├── PaymentFail.tsx
│   │   ├── Orders.tsx
│   │   ├── OrderDetail.tsx
│   │   ├── AddressList.tsx
│   │   ├── ReturnRequest.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminProducts.tsx
│   │   ├── AdminOrders.tsx
│   │   └── AdminInventory.tsx
│   └── utils/                      # 유틸리티 함수
│       ├── validation.ts           # 폼 검증 함수
│       ├── format.ts               # 날짜, 통화 포맷
│       └── constants.ts            # 상수 (주문 상태 색상 등)
├── tests/                          # 테스트
│   ├── setup.ts                    # Vitest 설정
│   ├── unit/                       # 단위 테스트
│   │   ├── validation.test.ts
│   │   └── format.test.ts
│   ├── components/                 # 컴포넌트 테스트
│   │   ├── Login.test.tsx
│   │   ├── ProductCard.test.tsx
│   │   └── OrderTimeline.test.tsx
│   └── e2e/                        # E2E 테스트 (Playwright)
│       ├── auth.spec.ts
│       ├── checkout.spec.ts
│       └── admin.spec.ts
```

## 논리적 컴포넌트 매핑

### API Client Layer (`src/api/`)
| 파일 | 역할 | 연결 Backend 컴포넌트 |
|---|---|---|
| client.ts | fetch wrapper, 토큰 갱신 인터셉터 | 모든 API |
| auth.ts | 로그인, 회원가입, 토큰 갱신, 로그아웃 | C1 (AuthService) |
| products.ts | 상품 CRUD | C2 (ProductService) |
| orders.ts | 주문 CRUD, 상태 변경, 재주문 | C3 (OrderService) |
| addresses.ts | 주소 CRUD | C15 (AddressService) |
| returns.ts | 반품 신청 | C7 (ReturnService) |
| payments.ts | 결제 승인 | C5 (PaymentService) |
| analytics.ts | Dashboard 데이터 | C8 (AnalyticsService) |
| ai.ts | AI Q&A | C9 (AIService) |
| forecast.ts | 수요 예측 | C10 (ForecastService) |
| recommendations.ts | 상품 추천 | C11 (RecommendationService) |

### Context Layer (`src/context/`)
| Context | 상태 | 용도 |
|---|---|---|
| AuthContext | user, accessToken, refreshToken | 인증 상태 전역 관리 |
| CartContext | items: CartItem[] | 장바구니 (localStorage 동기화) |
| WebSocketContext | isConnected, ws instance | WebSocket 연결 + 이벤트 분배 |
| ToastContext | toasts: Toast[] | 알림 메시지 큐 |
| AIPanelContext | isOpen, activeTab | AI 사이드 패널 상태 |

### React Query Layer (`src/hooks/queries/`)
| 훅 | 쿼리 키 | WebSocket 무효화 |
|---|---|---|
| useProducts | ['products'] | inventory_update |
| useOrders | ['orders'] | order_update, new_order |
| useAddresses | ['addresses'] | 없음 (mutation 후 무효화) |
| useDashboard | ['dashboard'] | new_order, inventory_update |
| useForecast | ['forecast', productId] | inventory_update |
| useRecommendations | ['recommendations'] | 없음 (staleTime 기반) |

## Provider 구성 순서

```tsx
// App.tsx
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <WebSocketProvider>
      <CartProvider>
        <ToastProvider>
          <AIPanelProvider>
            <BrowserRouter>
              <GlobalErrorBoundary>
                <Routes>...</Routes>
              </GlobalErrorBoundary>
            </BrowserRouter>
          </AIPanelProvider>
        </ToastProvider>
      </CartProvider>
    </WebSocketProvider>
  </AuthProvider>
</QueryClientProvider>
```

순서 근거:
1. QueryClientProvider: 최상위 (React Query 인프라)
2. AuthProvider: 인증 상태 (WebSocket 연결에 토큰 필요)
3. WebSocketProvider: 인증 후 연결 (캐시 무효화에 queryClient 필요)
4. CartProvider: 인증 불필요 (localStorage 기반)
5. ToastProvider: 알림 인프라
6. AIPanelProvider: UI 상태
