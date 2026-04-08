# Units of Work

## 분해 전략
- **Unit 수**: 3개 (Frontend, Backend, Infra&DevOps)
- **구현 순서**: 완전 병렬 (3개 unit 동시 진행)
- **근거**: 사용자 요청에 따라 기술 레이어 기반 분해. FE/BE/Infra 각각 독립적으로 개발 가능하며, API contract 기반으로 통합.

---

## Unit 1: Backend (BE)

### 정의
Node.js + Express + TypeScript 기반 API 서버의 전체 현대화.

### 책임
- SQLite → PostgreSQL 마이그레이션 (스키마, connection pooling, 시드 데이터)
- 서비스 레이어 도입 (Controller → Service → Repository)
- 보안 강화 (Helmet.js, rate limiting, 입력 검증, JWT 개선)
- Redis 캐싱 (재고, 세션)
- WebSocket 서버 (실시간 알림)
- 결제 통합 (Toss Payments)
- 배송 통합 (EasyPost/Shippo)
- 반품/환불 처리
- 주문 상태 Lifecycle (state machine)
- AI 기능 확장 (Bedrock Claude Q&A, 수요 내러티브, 상품 설명)
- 수요 예측 및 재주문 제안
- 상품 추천 엔진
- Coupang Marketplace 연동 (Phase 4)
- ERP 통합 레이어 (Phase 4)
- SQS/EventBridge 이벤트 버스 (Phase 4)
- 구조화된 로깅, 헬스체크, 글로벌 에러 핸들러

### 포함 컴포넌트
C1(AuthService), C2(ProductService), C3(OrderService), C4(InventoryService), C5(PaymentService), C6(ShippingService), C7(ReturnService), C8(AnalyticsService), C9(AIService), C10(ForecastService), C11(RecommendationService), C12(NotificationService), C13(MarketplaceService), C14(ERPIntegrationService), C15(AddressService)

### 기술 스택
- Node.js + Express + TypeScript
- PostgreSQL (pg-pool)
- Redis (ioredis)
- ws (WebSocket)
- Toss Payments SDK (server)
- EasyPost/Shippo SDK
- AWS Bedrock SDK
- Pino/Winston (로깅)
- express-validator, Helmet.js, express-rate-limit
- Jest + Supertest (테스트)

---

## Unit 2: Frontend (FE)

### 정의
React 18 + TypeScript 기반 SPA의 전체 현대화.

### 책임
- Tailwind CSS 전환 (인라인 스타일 제거)
- 모바일 반응형 디자인 (모바일 퍼스트)
- 고객 셀프서비스 포털 (주문 내역, 배송 추적, 반품, 주소록, 재주문)
- 결제 UI (Toss Payments 위젯)
- 실시간 업데이트 (WebSocket 클라이언트)
- Admin Dashboard 현대화 (실시간 KPI, 재고 관리, 주문 관리)
- AI 기능 UI (Q&A, 수요 예측 차트, 추천 섹션)
- 접근성 (ARIA, 키보드 네비게이션)
- 모바일 PWA (Phase 4 — 창고 바코드 스캐닝)

### 포함 컴포넌트
FC1(AuthModule), FC2(StorefrontModule), FC3(CheckoutModule), FC4(OrderModule), FC5(SelfServiceModule), FC6(AdminDashboardModule), FC7(AIModule), FC8(WebSocketModule)

### 기술 스택
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Toss Payments SDK (client)
- Recharts (차트)
- WebSocket (native API)

---

## Unit 3: Infra & DevOps

### 정의
AWS 인프라 정의, 컨테이너화, CI/CD 파이프라인.

### 책임
- Terraform IaC (VPC, ECS Fargate, RDS PostgreSQL, ElastiCache Redis, ALB, S3, CloudFront)
- Dockerfile 작성 (API, Frontend)
- ECS Task Definition, Service, Auto Scaling
- RDS Multi-AZ 설정, Read Replica
- CloudWatch + X-Ray 모니터링
- CI/CD 파이프라인 (빌드 → 테스트 → Docker → ECR → ECS)
- 환경별 구성 (dev/staging/prod)
- 보안 그룹, Private Subnet, NAT Gateway
- 의존성 취약점 스캔

### 포함 컴포넌트
IC1(Terraform Modules), IC2(Docker)

### 기술 스택
- Terraform
- Docker
- AWS ECS Fargate, RDS, ElastiCache, ALB, CloudFront, S3, SQS, EventBridge
- AWS CloudWatch, X-Ray
- ECR (Container Registry)
