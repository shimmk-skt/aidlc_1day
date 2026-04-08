# Component Methods

참고: 상세 비즈니스 로직은 Functional Design (CONSTRUCTION phase)에서 정의됩니다.

## C1: AuthService
| Method | Input | Output | Purpose |
|---|---|---|---|
| login(email, password) | LoginDto | { accessToken, refreshToken, user } | 사용자 로그인 |
| register(email, password, name) | RegisterDto | { accessToken, refreshToken, user } | 회원가입 |
| refreshToken(refreshToken) | string | { accessToken, refreshToken } | 토큰 갱신 |
| revokeToken(refreshToken) | string | void | 토큰 폐기 (로그아웃) |
| validatePassword(password) | string | boolean | 비밀번호 정책 검증 |

## C2: ProductService
| Method | Input | Output | Purpose |
|---|---|---|---|
| findAll(filters?) | ProductFilterDto | Product[] | 상품 목록 조회 |
| findById(id) | number | Product | 상품 상세 조회 |
| create(data) | CreateProductDto | Product | 상품 생성 (Admin) |
| update(id, data) | number, UpdateProductDto | Product | 상품 수정 (Admin) |
| delete(id) | number | void | 상품 삭제 (Admin) |
| generateImage(name, desc) | string, string | string (url) | AI 이미지 생성 |
| generateDescription(name, attrs) | string, object | string | AI 설명 생성 |

## C3: OrderService
| Method | Input | Output | Purpose |
|---|---|---|---|
| create(userId, items) | number, OrderItemDto[] | Order | 주문 생성 (재고 예약 포함) |
| findByUser(userId) | number | Order[] | 사용자 주문 목록 |
| findById(id, userId?) | number, number? | OrderDetail | 주문 상세 (항목 포함) |
| transitionStatus(id, newStatus) | number, OrderStatus | Order | 상태 전환 (state machine) |
| cancel(id, userId) | number, number | Order | 주문 취소 (재고 복원) |
| reorder(originalOrderId, userId) | number, number | Order | 재주문 |

## C4: InventoryService
| Method | Input | Output | Purpose |
|---|---|---|---|
| getStock(productId) | number | InventoryInfo | 재고 조회 (캐시 우선) |
| reserve(productId, qty) | number, number | boolean | atomic 재고 예약 |
| release(productId, qty) | number, number | void | 재고 복원 (취소/반품) |
| getInventoryReport() | void | InventoryItem[] | 전체 재고 현황 |
| getKPIs() | void | InventoryKPIs | 재고 KPI (turnover, DSI, stockout rate) |
| invalidateCache(productId) | number | void | 캐시 무효화 |

## C5: PaymentService
| Method | Input | Output | Purpose |
|---|---|---|---|
| requestPayment(orderId, amount) | number, number | PaymentRequest | Toss 결제 요청 생성 |
| confirmPayment(paymentKey, orderId, amount) | string, number, number | Payment | 결제 승인 |
| cancelPayment(paymentId, reason) | string, string | Payment | 결제 취소 |
| refund(paymentId, amount?) | string, number? | Payment | 환불 (전체/부분) |
| handleWebhook(event) | TossWebhookEvent | void | Webhook 처리 |

## C6: ShippingService
| Method | Input | Output | Purpose |
|---|---|---|---|
| getRates(shipment) | ShipmentDto | ShippingRate[] | 배송비 조회 |
| createLabel(orderId, carrierId) | number, string | ShippingLabel | 배송 라벨 생성 |
| getTracking(trackingNumber) | string | TrackingInfo | 배송 추적 |
| handleWebhook(event) | CarrierWebhookEvent | void | 배송 상태 webhook |

## C7: ReturnService
| Method | Input | Output | Purpose |
|---|---|---|---|
| initiateReturn(orderId, reason) | number, ReturnReasonDto | Return | 반품 신청 |
| generateReturnLabel(returnId) | number | ShippingLabel | 반품 라벨 생성 |
| receiveReturn(returnId) | number | Return | 반품 수신 처리 |
| processRefund(returnId) | number | Return | 환불 처리 |

## C8: AnalyticsService
| Method | Input | Output | Purpose |
|---|---|---|---|
| getDashboard() | void | DashboardData | Admin Dashboard 데이터 |
| getRevenueReport(period) | DateRange | RevenueReport | 매출 보고서 |

## C9: AIService
| Method | Input | Output | Purpose |
|---|---|---|---|
| askInventoryQuestion(question) | string | string | 재고 Q&A (Claude) |
| generateDemandNarrative(period) | DateRange | string | 수요 내러티브 생성 |
| generateProductDescription(name, attrs) | string, object | string | 상품 설명 생성 |
| generateProductImage(name, desc) | string, string | string (url) | 상품 이미지 생성 |

## C10: ForecastService
| Method | Input | Output | Purpose |
|---|---|---|---|
| getForecast(productId, days) | number, number | ForecastResult | 수요 예측 |
| getReorderSuggestions() | void | ReorderSuggestion[] | 재주문 제안 목록 |
| calculateROP(productId) | number | ReorderPoint | 동적 재주문 포인트 |

## C11: RecommendationService
| Method | Input | Output | Purpose |
|---|---|---|---|
| getFrequentlyBoughtTogether(productId) | number | Product[] | 함께 구매한 상품 |
| getPersonalized(userId) | number | Product[] | 개인화 추천 |

## C12: NotificationService
| Method | Input | Output | Purpose |
|---|---|---|---|
| broadcastInventoryUpdate(productId, stock) | number, number | void | 재고 실시간 업데이트 |
| broadcastOrderUpdate(orderId, status) | number, string | void | 주문 상태 알림 |
| sendAlert(userId, message) | number, string | void | 개별 알림 |

## C13: MarketplaceService (Phase 4)
| Method | Input | Output | Purpose |
|---|---|---|---|
| syncProduct(productId) | number | void | 상품 Coupang 동기화 |
| receiveOrder(coupangOrder) | CoupangOrder | Order | Coupang 주문 수신 |
| syncShipmentStatus(orderId) | number | void | 배송 상태 동기화 |

## C14: ERPIntegrationService (Phase 4)
| Method | Input | Output | Purpose |
|---|---|---|---|
| syncFinancialData(order) | Order | void | 재무 데이터 동기화 |
| runReconciliation() | void | ReconciliationReport | 배치 reconciliation |

## C15: AddressService
| Method | Input | Output | Purpose |
|---|---|---|---|
| findByUser(userId) | number | Address[] | 사용자 주소 목록 |
| create(userId, data) | number, AddressDto | Address | 주소 추가 |
| update(id, data) | number, AddressDto | Address | 주소 수정 |
| delete(id) | number | void | 주소 삭제 |
| setDefault(id, userId) | number, number | void | 기본 주소 설정 |
