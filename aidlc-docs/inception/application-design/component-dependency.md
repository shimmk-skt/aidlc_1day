# Component Dependencies

## Dependency Diagram

```mermaid
graph TD
    subgraph Controllers
        AuthCtrl["AuthController"]
        ProdCtrl["ProductController"]
        OrderCtrl["OrderController"]
        InvCtrl["InventoryController"]
        PayCtrl["PaymentController"]
        ShipCtrl["ShippingController"]
        RetCtrl["ReturnController"]
        AnalCtrl["AnalyticsController"]
        AICtrl["AIController"]
        FcstCtrl["ForecastController"]
        RecCtrl["RecommendationController"]
        AddrCtrl["AddressController"]
    end

    subgraph Services
        AuthSvc["AuthService"]
        ProdSvc["ProductService"]
        OrderSvc["OrderService"]
        InvSvc["InventoryService"]
        PaySvc["PaymentService"]
        ShipSvc["ShippingService"]
        RetSvc["ReturnService"]
        AnalSvc["AnalyticsService"]
        AISvc["AIService"]
        FcstSvc["ForecastService"]
        RecSvc["RecommendationService"]
        NotifSvc["NotificationService"]
        AddrSvc["AddressService"]
    end

    subgraph External
        PG["PostgreSQL"]
        Redis["Redis"]
        Toss["Toss Payments"]
        Carrier["EasyPost/Shippo"]
        Bedrock["AWS Bedrock"]
        WS["WebSocket"]
    end

    OrderSvc --> InvSvc
    OrderSvc --> PaySvc
    OrderSvc --> NotifSvc
    RetSvc --> InvSvc
    RetSvc --> PaySvc
    RetSvc --> ShipSvc
    RetSvc --> NotifSvc
    ProdSvc --> AISvc
    FcstSvc --> InvSvc
    InvSvc --> Redis
    PaySvc --> Toss
    ShipSvc --> Carrier
    AISvc --> Bedrock
    NotifSvc --> WS
    AuthSvc --> PG
    ProdSvc --> PG
    OrderSvc --> PG
    InvSvc --> PG
    AddrSvc --> PG
```

## Dependency Matrix

| Service | Depends On |
|---|---|
| AuthService | UserRepository, Redis (refresh tokens) |
| ProductService | ProductRepository, AIService |
| OrderService | OrderRepository, InventoryService, PaymentService, NotificationService |
| InventoryService | InventoryRepository, Redis (cache) |
| PaymentService | TossPaymentsClient, OrderService (callback) |
| ShippingService | ShippingCarrierClient, OrderService (callback) |
| ReturnService | ReturnRepository, InventoryService, PaymentService, ShippingService, NotificationService |
| AnalyticsService | DB Read queries |
| AIService | BedrockClient, InventoryRepository, OrderRepository |
| ForecastService | OrderRepository, InventoryRepository |
| RecommendationService | OrderRepository |
| NotificationService | WebSocketServer |
| AddressService | AddressRepository |
| MarketplaceService (P4) | CoupangWingClient, OrderService, InventoryService |
| ERPIntegrationService (P4) | ERPAdapter, OrderRepository |

## Communication Patterns
- **Phase 1~3**: 동기 메서드 호출 (단일 프로세스 내)
- **Phase 4**: SQS/EventBridge 비동기 이벤트 (Microservices 간)
- **External**: REST API (Toss, EasyPost, Coupang), SDK (Bedrock)
- **Real-time**: WebSocket (클라이언트 알림)
