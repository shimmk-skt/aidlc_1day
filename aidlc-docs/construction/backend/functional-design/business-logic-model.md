# Business Logic Model — Backend Unit

## 주문 생성 Flow

```
Client POST /api/orders { items, addressId }
  │
  ├─ 입력 검증 (express-validator)
  ├─ JWT 인증 확인
  │
  ├─ OrderService.create(userId, items, addressId)
  │   ├─ items 각각에 대해:
  │   │   └─ InventoryService.reserve(productId, qty)
  │   │       └─ UPDATE products SET reserved_qty += qty WHERE (stock - reserved_qty) >= qty
  │   │           ├─ 성공 → 계속
  │   │           └─ 실패 → 이미 예약된 항목 rollback, 400 에러
  │   │
  │   ├─ subtotal 계산 (각 item.price × item.qty 합산)
  │   ├─ GST = subtotal × 0.10
  │   ├─ total = subtotal + GST
  │   │
  │   ├─ DB Transaction:
  │   │   ├─ INSERT orders (status: pending)
  │   │   └─ INSERT order_items (각 항목)
  │   │
  │   ├─ NotificationService.broadcastOrderUpdate(orderId, 'pending')
  │   └─ return { orderId, subtotal, gst, total, status }
  │
  └─ Response 201 Created
```

## 결제 확인 Flow

```
Client POST /api/payments/confirm { paymentKey, orderId, amount }
  │
  ├─ PaymentService.confirmPayment(paymentKey, orderId, amount)
  │   ├─ Toss API POST /v1/payments/confirm
  │   │   ├─ 성공:
  │   │   │   ├─ INSERT payments (status: succeeded)
  │   │   │   ├─ OrderService.transitionStatus(orderId, 'confirmed')
  │   │   │   ├─ InventoryService: reserved_qty → stock 차감 확정
  │   │   │   └─ NotificationService.broadcastOrderUpdate()
  │   │   └─ 실패:
  │   │       ├─ INSERT payments (status: failed)
  │   │       └─ InventoryService.release() — 예약 해제
  │   └─ return payment
  │
  └─ Response 200 OK
```

## 반품 Flow

```
Client POST /api/returns { orderId, reason }
  │
  ├─ ReturnService.initiateReturn(orderId, reason)
  │   ├─ 주문 상태 확인 (delivered만 허용)
  │   ├─ INSERT returns (status: initiated)
  │   ├─ OrderService.transitionStatus(orderId, 'return_initiated')
  │   ├─ ShippingService.createReturnLabel() → return_label_url
  │   ├─ NotificationService.broadcastOrderUpdate()
  │   └─ return { returnId, returnLabelUrl }
  │
  └─ Response 201 Created

반품 수신:
Admin PATCH /api/returns/:id/receive
  │
  ├─ ReturnService.receiveReturn(returnId)
  │   ├─ UPDATE returns (status: received)
  │   ├─ OrderService.transitionStatus(orderId, 'return_received')
  │   ├─ InventoryService.release(items) — 재고 복원
  │   ├─ PaymentService.refund(paymentId)
  │   ├─ OrderService.transitionStatus(orderId, 'refunded')
  │   └─ NotificationService.broadcastOrderUpdate()
  │
  └─ Response 200 OK
```

## AI Q&A Flow

```
Admin POST /api/ai/inventory-qa { question }
  │
  ├─ AIService.askInventoryQuestion(question)
  │   ├─ 현재 재고 데이터 조회 (top 50 products by relevance)
  │   ├─ 최근 주문 트렌드 데이터 조회
  │   ├─ Bedrock Claude API 호출:
  │   │   ├─ system prompt: 재고 관리 전문가 역할
  │   │   ├─ context: 재고 데이터 + 주문 트렌드
  │   │   └─ user message: 사용자 질문
  │   └─ return Claude 응답 텍스트
  │
  └─ Response 200 OK { answer }
```

## 수요 예측 Flow

```
ForecastService.getForecast(productId, days=14)
  │
  ├─ 최근 90일 일별 판매량 조회
  ├─ 이동 평균 계산 (7일 window)
  ├─ 표준편차 계산
  ├─ 14일 예측 생성 (이동 평균 기반)
  ├─ ROP 계산:
  │   ├─ avg_daily_demand = 90일 평균
  │   ├─ safety_stock = 1.65 × σ × √lead_time
  │   └─ ROP = (avg_daily_demand × lead_time) + safety_stock
  │
  └─ return { forecast[], reorderPoint, safetyStock, avgDailyDemand }
```

## WebSocket 연결 관리

```
Client WebSocket connect ws://host/ws?token=JWT
  │
  ├─ JWT 검증
  │   ├─ 유효 → 연결 수락, 역할별 채널 구독
  │   │   ├─ admin → admin_channel (모든 주문/재고 업데이트)
  │   │   └─ customer → user_{userId}_channel (본인 주문만)
  │   └─ 무효 → 연결 거부 (4001)
  │
  ├─ 이벤트 수신 (서버 → 클라이언트):
  │   ├─ inventory_update: { productId, stock, reserved_qty }
  │   ├─ order_update: { orderId, status, timestamp }
  │   ├─ new_order: { orderId, total, customerName } (admin only)
  │   └─ alert: { type, message }
  │
  └─ 연결 종료: 토큰 만료 또는 클라이언트 disconnect
```
