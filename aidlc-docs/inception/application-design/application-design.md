# Application Design — 통합 문서

## 아키텍처 개요

Inventrix 현대화는 기존 monolithic Express 앱을 서비스 레이어 기반으로 리팩토링하고, Phase 4에서 Microservices로 분해하는 점진적 접근법을 따릅니다.

```
Phase 1~3: Modular Monolith (서비스 레이어 분리, 단일 프로세스)
Phase 4:   Microservices (Strangler Fig 패턴, SQS/EventBridge)
```

## 컴포넌트 구성 (15개 Backend + 8개 Frontend + 2개 Infrastructure)

**Backend Services**: AuthService, ProductService, OrderService, InventoryService, PaymentService, ShippingService, ReturnService, AnalyticsService, AIService, ForecastService, RecommendationService, NotificationService, AddressService, MarketplaceService(P4), ERPIntegrationService(P4)

**Frontend Modules**: AuthModule, StorefrontModule, CheckoutModule, OrderModule, SelfServiceModule, AdminDashboardModule, AIModule, WebSocketModule

**Infrastructure**: Terraform Modules, Docker

## 핵심 설계 결정

1. **서비스 레이어 패턴**: Controller → Service → Repository 3계층 분리
2. **State Machine**: 주문 상태 전환을 state machine으로 관리 (유효한 전환만 허용)
3. **Atomic Reservation**: PostgreSQL UPDATE ... WHERE 패턴으로 재고 race condition 해결
4. **Cache-Aside**: Redis 캐시 (재고 데이터 30초 TTL, 변경시 무효화)
5. **Webhook 패턴**: Toss Payments, 배송 캐리어의 비동기 이벤트를 idempotent webhook으로 처리
6. **어댑터 패턴**: ERP 통합을 pluggable 어댑터로 설계 (Phase 4)
7. **Strangler Fig**: Phase 4에서 Inventory/Order Service를 점진적으로 추출

## Phase별 컴포넌트 도입 순서

| Phase | 신규 컴포넌트 |
|---|---|
| Phase 1 | AuthService(개선), ProductService, OrderService, InventoryService, Redis 연동 |
| Phase 2 | PaymentService, ShippingService, ReturnService, NotificationService, AddressService, WebSocket |
| Phase 3 | AIService(확장), ForecastService, RecommendationService |
| Phase 4 | MarketplaceService, ERPIntegrationService, SQS/EventBridge, Microservices 분해 |

상세 내용은 개별 문서 참조:
- `components.md` — 컴포넌트 정의 및 책임
- `component-methods.md` — 메서드 시그니처
- `services.md` — 서비스 오케스트레이션 패턴
- `component-dependency.md` — 의존성 관계 및 통신 패턴
