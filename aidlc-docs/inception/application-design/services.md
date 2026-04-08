# Services & Orchestration

## Service Layer Architecture

```
Controller (Route) → Service → Repository → Database
                        ↓
                   External Client (Toss, EasyPost, Bedrock, Coupang)
                        ↓
                   Event Publisher (WebSocket, SQS/EventBridge in Phase 4)
```

## Orchestration Patterns

### 주문 생성 Orchestration (OrderService)
```
OrderService.create()
  1. InventoryService.reserve(items)     — atomic 재고 예약
  2. OrderRepository.create(order)       — 주문 저장
  3. PaymentService.requestPayment()     — 결제 요청 생성
  4. NotificationService.broadcastOrderUpdate() — 실시간 알림
```

### 결제 완료 Orchestration (PaymentService webhook)
```
PaymentService.handleWebhook(payment_succeeded)
  1. OrderService.transitionStatus(CONFIRMED)
  2. NotificationService.broadcastOrderUpdate()
```

### 배송 완료 Orchestration (ShippingService webhook)
```
ShippingService.handleWebhook(delivered)
  1. OrderService.transitionStatus(DELIVERED)
  2. NotificationService.broadcastOrderUpdate()
```

### 반품 Orchestration (ReturnService)
```
ReturnService.receiveReturn()
  1. InventoryService.release(items)     — 재고 복원
  2. PaymentService.refund()             — 환불 처리
  3. OrderService.transitionStatus(REFUNDED)
  4. NotificationService.broadcastOrderUpdate()
```

### Phase 4: Event-Driven Orchestration (SQS/EventBridge)
```
OrderPlaced Event →
  ├── InventoryService (재고 예약)
  ├── NotificationService (알림)
  ├── AnalyticsService (기록)
  └── MarketplaceService (Coupang 동기화)
```

## Service Communication

| From | To | Pattern | Phase |
|---|---|---|---|
| OrderService | InventoryService | 동기 (메서드 호출) → Phase 4: 이벤트 | 1→4 |
| OrderService | PaymentService | 동기 (메서드 호출) | 2 |
| OrderService | NotificationService | 동기 (WebSocket broadcast) → Phase 4: 이벤트 | 2→4 |
| PaymentService | OrderService | Webhook → 동기 호출 | 2 |
| ShippingService | OrderService | Webhook → 동기 호출 | 2 |
| ReturnService | InventoryService, PaymentService | 동기 (메서드 호출) | 2 |
| ForecastService | OrderRepository, InventoryRepository | 동기 (DB 조회) | 3 |
| MarketplaceService | OrderService, InventoryService | 이벤트 (SQS) | 4 |
| ERPIntegrationService | OrderRepository | 배치 (스케줄) | 4 |
