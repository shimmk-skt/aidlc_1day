# Application Components

## Backend Components (packages/api)

### C1: AuthService
- **Purpose**: 사용자 인증 및 인가 관리
- **Responsibilities**: 로그인, 회원가입, JWT 발급/갱신/폐기, 비밀번호 정책, RBAC
- **Interfaces**: AuthController (routes) → AuthService → UserRepository

### C2: ProductService
- **Purpose**: 상품 카탈로그 관리
- **Responsibilities**: 상품 CRUD, AI 이미지 생성, 상품 설명 자동 생성, 상품 검색
- **Interfaces**: ProductController → ProductService → ProductRepository, BedrockClient

### C3: OrderService
- **Purpose**: 주문 lifecycle 관리
- **Responsibilities**: 주문 생성, 상태 전환 (state machine), 취소, 재주문
- **Interfaces**: OrderController → OrderService → OrderRepository, InventoryService, PaymentService

### C4: InventoryService
- **Purpose**: 재고 관리 및 실시간 추적
- **Responsibilities**: 재고 조회, atomic reservation, 재고 복원, 캐시 관리, KPI 계산
- **Interfaces**: InventoryController → InventoryService → InventoryRepository, RedisClient

### C5: PaymentService
- **Purpose**: 결제 처리 (Toss Payments)
- **Responsibilities**: 결제 승인, 취소, 환불, webhook 처리
- **Interfaces**: PaymentController → PaymentService → TossPaymentsClient, OrderService

### C6: ShippingService
- **Purpose**: 배송 관리 (멀티 캐리어)
- **Responsibilities**: 배송비 조회, 라벨 생성, 추적, webhook 수신
- **Interfaces**: ShippingController → ShippingService → ShippingCarrierClient (EasyPost/Shippo)

### C7: ReturnService
- **Purpose**: 반품/환불 처리
- **Responsibilities**: 반품 신청, 반품 라벨 생성, 반품 수신, 환불/교환 처리
- **Interfaces**: ReturnController → ReturnService → ReturnRepository, ShippingService, PaymentService, InventoryService

### C8: AnalyticsService
- **Purpose**: 비즈니스 분석 및 KPI
- **Responsibilities**: Dashboard 데이터 집계, 재고 KPI, 매출 분석
- **Interfaces**: AnalyticsController → AnalyticsService → DB Read Replica

### C9: AIService
- **Purpose**: AI/ML 기능 (Bedrock Claude)
- **Responsibilities**: 재고 Q&A, 수요 내러티브, 상품 설명 생성, 이미지 생성
- **Interfaces**: AIController → AIService → BedrockClient

### C10: ForecastService
- **Purpose**: 수요 예측 및 재주문 제안
- **Responsibilities**: 통계 기반 수요 예측, 동적 ROP 계산, 재주문 알림
- **Interfaces**: ForecastController → ForecastService → OrderRepository, InventoryRepository

### C11: RecommendationService
- **Purpose**: 상품 추천
- **Responsibilities**: 함께 구매한 상품, 개인화 추천
- **Interfaces**: RecommendationController → RecommendationService → OrderRepository

### C12: NotificationService
- **Purpose**: 알림 발송
- **Responsibilities**: 주문/배송 상태 알림, 재고 알림, WebSocket 브로드캐스트
- **Interfaces**: NotificationService → WebSocketServer, SES/SNS (Phase 4)

### C13: MarketplaceService (Phase 4)
- **Purpose**: Coupang Marketplace 연동
- **Responsibilities**: 상품 동기화, 주문 수신, 배송 상태 동기화
- **Interfaces**: MarketplaceController → MarketplaceService → CoupangWingClient

### C14: ERPIntegrationService (Phase 4)
- **Purpose**: ERP 연동 (어댑터 패턴)
- **Responsibilities**: 재무 데이터 동기화, 배치 reconciliation
- **Interfaces**: ERPIntegrationService → ERPAdapter (pluggable)

### C15: AddressService
- **Purpose**: 고객 주소록 관리
- **Responsibilities**: 주소 CRUD, 기본 주소 설정
- **Interfaces**: AddressController → AddressService → AddressRepository

---

## Frontend Components (packages/frontend)

### FC1: AuthModule
- **Purpose**: 인증 UI (로그인, 회원가입, 로그아웃)

### FC2: StorefrontModule
- **Purpose**: 상품 탐색 UI (목록, 상세, 추천)

### FC3: CheckoutModule
- **Purpose**: 결제 UI (Toss Payments 위젯, 주소 선택)

### FC4: OrderModule
- **Purpose**: 주문 관리 UI (내역, 상태, 재주문)

### FC5: SelfServiceModule
- **Purpose**: 셀프서비스 포털 (배송 추적, 반품, 주소록)

### FC6: AdminDashboardModule
- **Purpose**: Admin Dashboard (실시간 KPI, 주문/재고 관리)

### FC7: AIModule
- **Purpose**: AI 기능 UI (Q&A, 수요 예측, 추천 표시)

### FC8: WebSocketModule
- **Purpose**: 실시간 통신 (재고/주문 업데이트, 알림)

---

## Infrastructure Components

### IC1: Terraform Modules
- **Purpose**: AWS 인프라 정의 (VPC, ECS, RDS, ElastiCache, ALB, S3)

### IC2: Docker
- **Purpose**: 컨테이너 이미지 (API, Frontend)
