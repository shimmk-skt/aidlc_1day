# User Stories — Inventrix 현대화 프로젝트

분류: Phase 기반 | Criteria: 간결 체크리스트 | Granularity: Task 수준
Personas: P1(신규고객), P2(일반고객), P3(VIP고객), P4(Operations Mgr), P5(Inventory Mgr), P6(Finance Mgr), P7(Warehouse Staff)

---

# Phase 1: Foundation

## Epic 1.1: Database 마이그레이션 (FR-01)

### US-1.1.1: PostgreSQL 스키마 생성
**As a** 개발자, **I want** SQLite 스키마를 PostgreSQL로 변환 **so that** 동시 쓰기와 확장성을 확보한다.
- [ ] users, products, orders, order_items 테이블 PostgreSQL DDL 작성
- [ ] 적절한 인덱스 생성 (orders.user_id, orders.status, products.stock 등)

### US-1.1.2: Connection Pooling 구성
**As a** 개발자, **I want** pg-pool 기반 connection pooling을 구성 **so that** DB 연결을 효율적으로 관리한다.
- [ ] pg-pool 설정 (max connections, idle timeout)
- [ ] 기존 better-sqlite3 호출을 pg-pool 쿼리로 교체

### US-1.1.3: 시드 데이터 마이그레이션
**As a** 개발자, **I want** 기존 시드 데이터를 PostgreSQL로 마이그레이션 **so that** 초기 데이터가 유지된다.
- [ ] 사용자 2명 + 상품 24개 시드 스크립트 작성
- [ ] 마이그레이션 스크립트 실행 검증

### US-1.1.4: Atomic Inventory Reservation
**As a** P2(일반고객), **I want** 주문시 재고가 원자적으로 예약 **so that** 동시 주문에서 overselling이 발생하지 않는다.
- [ ] PostgreSQL UPDATE ... WHERE available >= qty RETURNING 패턴 적용
- [ ] 재고 부족시 즉시 에러 반환

## Epic 1.2: 보안 강화 (FR-02)

### US-1.2.1: 보안 헤더 적용
**As a** P4(Operations Mgr), **I want** HTTP 보안 헤더가 적용 **so that** 웹 공격으로부터 보호된다.
- [ ] Helmet.js 미들웨어 추가 (CSP, HSTS, X-Frame-Options 등)
- [ ] CORS를 특정 origin으로 제한

### US-1.2.2: Rate Limiting 적용
**As a** 시스템, **I want** API endpoint에 rate limiting 적용 **so that** 무차별 대입 공격을 방지한다.
- [ ] 일반 API: 100req/15min, 인증 API: 10req/15min
- [ ] 초과시 429 Too Many Requests 반환

### US-1.2.3: 입력 검증
**As a** 시스템, **I want** 모든 API endpoint에서 입력을 검증 **so that** injection 공격을 방지한다.
- [ ] express-validator로 모든 request body/params 검증
- [ ] 문자열 최대 길이, 숫자 범위, 이메일 형식 검증

### US-1.2.4: JWT 개선
**As a** P1(신규고객), **I want** 안전한 토큰 관리 **so that** 세션이 안전하게 유지된다.
- [ ] Access token 15분 + Refresh token 7일 rotation 구현
- [ ] JWT secret 환경 변수화, 하드코딩 제거

### US-1.2.5: 비밀번호 정책
**As a** P1(신규고객), **I want** 강력한 비밀번호 정책 **so that** 계정이 안전하다.
- [ ] 최소 8자, 영문+숫자 조합 검증
- [ ] 회원가입시 정책 미충족시 에러 메시지 표시

### US-1.2.6: 서비스 레이어 도입
**As a** 개발자, **I want** route에서 비즈니스 로직을 서비스 레이어로 분리 **so that** 코드 유지보수성이 향상된다.
- [ ] AuthService, ProductService, OrderService, AnalyticsService 생성
- [ ] Route 핸들러는 서비스 호출만 수행

## Epic 1.3: Redis 캐싱 (FR-03)

### US-1.3.1: Redis 연결 설정
**As a** 개발자, **I want** Redis 클라이언트를 설정 **so that** 캐싱 인프라를 사용할 수 있다.
- [ ] ioredis 클라이언트 설정 (ElastiCache 연결)
- [ ] 연결 실패시 graceful fallback (DB 직접 조회)

### US-1.3.2: 재고 데이터 캐싱
**As a** P5(Inventory Mgr), **I want** 재고 데이터가 캐싱 **so that** 재고 조회가 50ms 이내로 응답한다.
- [ ] 상품 재고 Redis 캐시 (TTL 30초)
- [ ] 재고 변경시 캐시 무효화

### US-1.3.3: 세션 저장소
**As a** 시스템, **I want** refresh token을 Redis에 저장 **so that** 토큰 폐기가 가능하다.
- [ ] Refresh token hash를 Redis에 저장
- [ ] 로그아웃시 Redis에서 삭제

---

# Phase 2: Core Features

## Epic 2.1: 실시간 재고 Dashboard (FR-04)

### US-2.1.1: WebSocket 서버 설정
**As a** 개발자, **I want** WebSocket 서버를 Express에 통합 **so that** 실시간 통신이 가능하다.
- [ ] ws 라이브러리로 WebSocket 서버 설정
- [ ] 인증된 연결만 허용 (JWT 검증)

### US-2.1.2: 실시간 재고 업데이트 브로드캐스트
**As a** P5(Inventory Mgr), **I want** 재고 변경시 실시간 알림 **so that** 항상 최신 재고를 확인한다.
- [ ] 주문/재고 변경시 WebSocket으로 업데이트 브로드캐스트
- [ ] 재고 부족(10개 미만)/품절 알림 자동 발송

### US-2.1.3: 재고 KPI Dashboard
**As a** P5(Inventory Mgr), **I want** 핵심 재고 KPI를 Dashboard에서 확인 **so that** 재고 상태를 한눈에 파악한다.
- [ ] Inventory Turnover, Days Sales of Inventory, Stockout Rate 표시
- [ ] 실시간 갱신 (WebSocket)

### US-2.1.4: Admin Dashboard 실시간 주문 피드
**As a** P4(Operations Mgr), **I want** 신규 주문이 실시간으로 Dashboard에 표시 **so that** 즉시 처리할 수 있다.
- [ ] 새 주문 생성시 WebSocket으로 Admin에게 알림
- [ ] 주문 상태 변경시 실시간 반영

## Epic 2.2: 고객 셀프서비스 포털 (FR-05)

### US-2.2.1: 주문 내역 확장
**As a** P2(일반고객), **I want** 상세한 주문 내역을 확인 **so that** 과거 주문을 쉽게 관리한다.
- [ ] 주문 항목별 상품명, 수량, 가격 표시
- [ ] 주문 상태 타임라인 표시

### US-2.2.2: 실시간 배송 추적
**As a** P2(일반고객), **I want** 배송 상태를 앱 내에서 실시간 확인 **so that** 외부 사이트로 이동하지 않아도 된다.
- [ ] 배송 캐리어 tracking 정보 embedded 표시
- [ ] 배송 상태 변경시 WebSocket 알림

### US-2.2.3: 반품 신청
**As a** P2(일반고객), **I want** 셀프서비스로 반품을 신청 **so that** 고객센터 연락 없이 반품 처리한다.
- [ ] 반품 사유 선택 (불량, 오배송, 단순변심 등)
- [ ] 반품 라벨 자동 생성 (배송 API 연동)

### US-2.2.4: 주소록 관리
**As a** P3(VIP고객), **I want** 여러 배송 주소를 저장 **so that** 주문시 빠르게 주소를 선택한다.
- [ ] 주소 CRUD (추가, 수정, 삭제, 기본 주소 설정)
- [ ] 주문시 저장된 주소 선택 UI

### US-2.2.5: 원클릭 재주문
**As a** P3(VIP고객), **I want** 이전 주문을 한 번의 클릭으로 재주문 **so that** 반복 구매가 간편하다.
- [ ] 주문 내역에서 "재주문" 버튼
- [ ] 이전 주문 항목을 그대로 새 주문 생성 (재고 확인 포함)

## Epic 2.3: 주문 상태 Lifecycle (FR-06)

### US-2.3.1: 확장된 주문 상태 머신
**As a** P4(Operations Mgr), **I want** 세분화된 주문 상태 **so that** 주문 처리 과정을 정확히 추적한다.
- [ ] 상태: PENDING→CONFIRMED→PROCESSING→PICKED→PACKED→SHIPPED→DELIVERED
- [ ] 유효한 상태 전환만 허용 (state machine 패턴)

### US-2.3.2: 취소/보류/백오더 Flow
**As a** P4(Operations Mgr), **I want** 취소, 보류, 백오더 처리 **so that** 예외 상황을 관리한다.
- [ ] CANCELLED, ON_HOLD, BACKORDERED 상태 추가
- [ ] 취소시 재고 복원 로직

### US-2.3.3: 반품 상태 Flow
**As a** P4(Operations Mgr), **I want** 반품 상태를 추적 **so that** 반품 처리를 체계적으로 관리한다.
- [ ] RETURN_INITIATED→RETURN_RECEIVED→REFUNDED/EXCHANGED
- [ ] 반품 수신시 재고 복원 (상태에 따라)

### US-2.3.4: 상태 변경 실시간 알림
**As a** P2(일반고객), **I want** 주문 상태 변경시 실시간 알림 **so that** 주문 진행 상황을 즉시 안다.
- [ ] WebSocket으로 고객에게 상태 변경 알림
- [ ] Admin Dashboard에도 실시간 반영

## Epic 2.4: Toss Payments 결제 (FR-07)

### US-2.4.1: Toss Payments SDK 통합
**As a** P1(신규고객), **I want** Toss Payments로 안전하게 결제 **so that** 카드 정보가 보호된다.
- [ ] Toss Payments JavaScript SDK 클라이언트 통합
- [ ] 결제 위젯 UI 구현

### US-2.4.2: 결제 승인 API
**As a** 시스템, **I want** 결제 승인을 서버에서 처리 **so that** 결제가 안전하게 완료된다.
- [ ] POST /api/payments/confirm — Toss 결제 승인 API 호출
- [ ] 결제 성공시 주문 상태 CONFIRMED로 변경

### US-2.4.3: 결제 취소/환불
**As a** P4(Operations Mgr), **I want** 결제를 취소하거나 환불 **so that** 고객 요청을 처리한다.
- [ ] POST /api/payments/:id/cancel — 결제 취소
- [ ] 환불시 Toss API 호출 + 주문 상태 REFUNDED

### US-2.4.4: Webhook 수신
**As a** 시스템, **I want** Toss Payments webhook을 수신 **so that** 결제 이벤트를 실시간 처리한다.
- [ ] POST /webhooks/toss — 결제 성공/실패/환불 이벤트 처리
- [ ] Idempotent 처리 (중복 webhook 방지)

## Epic 2.5: 배송 통합 (FR-08)

### US-2.5.1: 멀티 캐리어 배송비 조회
**As a** P4(Operations Mgr), **I want** 여러 캐리어의 배송비를 비교 **so that** 최적 배송 옵션을 선택한다.
- [ ] EasyPost/Shippo API로 배송비 조회 (rate shopping)
- [ ] 비용/배송일 기준 정렬 표시

### US-2.5.2: 배송 라벨 생성
**As a** P4(Operations Mgr), **I want** 배송 라벨을 자동 생성 **so that** 수동 작업을 줄인다.
- [ ] 캐리어 선택 후 라벨 생성 API 호출
- [ ] PDF 라벨 다운로드

### US-2.5.3: 배송 추적 Webhook
**As a** 시스템, **I want** 배송 상태 변경을 webhook으로 수신 **so that** 주문 상태를 자동 업데이트한다.
- [ ] 캐리어 webhook 수신 endpoint
- [ ] 배송 완료시 주문 상태 DELIVERED로 자동 변경

---

# Phase 3: Intelligence

## Epic 3.1: Bedrock Claude AI (FR-09)

### US-3.1.1: 재고 Q&A
**As a** P5(Inventory Mgr), **I want** 자연어로 재고 현황을 질의 **so that** 복잡한 쿼리 없이 정보를 얻는다.
- [ ] "이번 주 품절 위험 SKU는?" 같은 질문 처리
- [ ] Bedrock Claude API 호출 + 재고 데이터 컨텍스트 전달

### US-3.1.2: 수요 내러티브 생성
**As a** P5(Inventory Mgr), **I want** 주간/월간 수요 분석 보고서를 자동 생성 **so that** 의사결정에 활용한다.
- [ ] 주문 이력 데이터 기반 Claude 분석 보고서 생성
- [ ] 트렌드, 이상치, 추천 사항 포함

### US-3.1.3: 상품 설명 자동 생성
**As a** P5(Inventory Mgr), **I want** 상품 속성으로 설명을 자동 생성 **so that** 상품 등록이 빨라진다.
- [ ] 상품명 + 카테고리 + 속성 → Claude로 설명 생성
- [ ] 생성된 설명 편집 후 저장

## Epic 3.2: 자동 재주문 제안 (FR-10)

### US-3.2.1: 통계 기반 수요 예측
**As a** P5(Inventory Mgr), **I want** 주문 이력 기반 수요 예측 **so that** 적정 재고를 유지한다.
- [ ] 이동 평균 + 계절성 기반 14일 수요 예측
- [ ] SKU별 예측 결과 Dashboard 표시

### US-3.2.2: 동적 재주문 포인트
**As a** P5(Inventory Mgr), **I want** 자동 계산된 재주문 포인트 **so that** 수동 임계값 관리가 불필요하다.
- [ ] ROP = (일평균 수요 × 리드타임) + 안전재고
- [ ] 설정 가능한 서비스 레벨 (90%, 95%, 99%)

### US-3.2.3: 재주문 알림
**As a** P5(Inventory Mgr), **I want** 재주문이 필요한 SKU 알림 **so that** 적시에 발주한다.
- [ ] 재고가 ROP 이하시 Dashboard 알림
- [ ] 추천 발주 수량 표시

## Epic 3.3: AI 상품 추천 (FR-11)

### US-3.3.1: 함께 구매한 상품
**As a** P2(일반고객), **I want** 함께 구매된 상품 추천 **so that** 관련 상품을 쉽게 발견한다.
- [ ] 주문 이력 기반 연관 규칙 분석
- [ ] ProductDetail 페이지에 "함께 구매한 상품" 섹션

### US-3.3.2: 개인화 추천
**As a** P3(VIP고객), **I want** 내 구매 이력 기반 맞춤 추천 **so that** 관심 상품을 빠르게 찾는다.
- [ ] 사용자 주문 이력 기반 collaborative filtering
- [ ] Storefront에 "추천 상품" 섹션

---

# Phase 4: Scale & Ecosystem

## Epic 4.1: Microservices 분해 (FR-12)

### US-4.1.1: Event Bus 도입
**As a** 개발자, **I want** SQS + EventBridge 기반 이벤트 버스 **so that** 서비스 간 비동기 통신이 가능하다.
- [ ] OrderPlaced, InventoryUpdated 등 핵심 이벤트 정의
- [ ] CloudEvents 표준 스키마 적용

### US-4.1.2: Inventory Service 추출
**As a** 개발자, **I want** 재고 로직을 독립 서비스로 분리 **so that** 독립 배포/스케일링이 가능하다.
- [ ] Strangler Fig 패턴으로 점진적 추출
- [ ] 재고 API를 별도 ECS 서비스로 배포

### US-4.1.3: Order Service 추출
**As a** 개발자, **I want** 주문 로직을 독립 서비스로 분리 **so that** 주문 처리를 독립적으로 스케일링한다.
- [ ] 주문 API를 별도 ECS 서비스로 배포
- [ ] 이벤트 기반 재고 연동 (OrderPlaced → InventoryReserved)

### US-4.1.4: Notification Service
**As a** P2(일반고객), **I want** 주문/배송 알림을 받기 **so that** 주문 진행을 놓치지 않는다.
- [ ] Lambda 기반 알림 서비스 (SES/SNS)
- [ ] 이벤트 구독으로 자동 알림 발송

## Epic 4.2: Coupang Marketplace (FR-13)

### US-4.2.1: 상품 동기화
**As a** P4(Operations Mgr), **I want** Inventrix 상품을 Coupang에 동기화 **so that** 멀티채널 판매가 가능하다.
- [ ] Coupang Wing API로 상품 등록/수정
- [ ] 가격/재고 실시간 동기화

### US-4.2.2: 주문 수신
**As a** P4(Operations Mgr), **I want** Coupang 주문을 Inventrix에서 관리 **so that** 통합 주문 관리가 가능하다.
- [ ] Coupang 주문 webhook 수신
- [ ] Inventrix 주문으로 변환 및 처리

### US-4.2.3: 배송 상태 동기화
**As a** 시스템, **I want** 배송 상태를 Coupang에 동기화 **so that** Coupang 고객도 추적 가능하다.
- [ ] 배송 상태 변경시 Coupang API로 업데이트
- [ ] 송장 번호 자동 전송

## Epic 4.3: ERP 통합 (FR-14)

### US-4.3.1: 플러그인 통합 레이어
**As a** 개발자, **I want** 어댑터 패턴 기반 통합 레이어 **so that** 다양한 ERP를 유연하게 연동한다.
- [ ] ERP 어댑터 인터페이스 정의
- [ ] Webhook + 배치 reconciliation 패턴

### US-4.3.2: 재무 데이터 동기화
**As a** P6(Finance Mgr), **I want** 매출/비용 데이터를 ERP에 동기화 **so that** 재무 보고가 자동화된다.
- [ ] 주문 완료시 ERP로 매출 데이터 전송
- [ ] 일일 배치 reconciliation

## Epic 4.4: 모바일 PWA (FR-15)

### US-4.4.1: 바코드 스캐닝
**As a** P7(Warehouse Staff), **I want** 모바일로 바코드를 스캔 **so that** 입고/출고를 빠르게 처리한다.
- [ ] 카메라 기반 바코드 스캐닝 (PWA)
- [ ] 스캔 결과로 재고 업데이트

### US-4.4.2: 오프라인 지원
**As a** P7(Warehouse Staff), **I want** 오프라인에서도 작업 **so that** 네트워크 불안정 환경에서도 사용한다.
- [ ] Service Worker 기반 오프라인 캐싱
- [ ] 온라인 복귀시 자동 동기화

---

# NFR Stories

## Epic N.1: 성능 및 모니터링

### US-N.1.1: 구조화된 로깅
**As a** 개발자, **I want** 구조화된 로깅 프레임워크 **so that** 문제를 빠르게 진단한다.
- [ ] Pino/Winston 로거 설정 (timestamp, requestId, level)
- [ ] 민감 데이터 로깅 방지

### US-N.1.2: 헬스체크 Endpoint
**As a** 시스템, **I want** 헬스체크 endpoint **so that** 로드밸런서가 서비스 상태를 확인한다.
- [ ] GET /health — DB, Redis 연결 상태 확인
- [ ] 200 OK 또는 503 Service Unavailable 반환

### US-N.1.3: 글로벌 에러 핸들러
**As a** 시스템, **I want** 글로벌 에러 핸들러 **so that** 미처리 예외가 안전하게 처리된다.
- [ ] Express 글로벌 에러 미들웨어
- [ ] 프로덕션에서 스택 트레이스 숨김, 일반 에러 메시지 반환

## Epic N.2: Frontend 현대화

### US-N.2.1: Tailwind CSS 도입
**As a** 개발자, **I want** Tailwind CSS로 전환 **so that** 모바일 반응형 UI를 효율적으로 구축한다.
- [ ] Tailwind CSS 설치 및 설정
- [ ] 기존 인라인 스타일을 Tailwind 클래스로 변환

### US-N.2.2: 모바일 반응형 Admin Dashboard
**As a** P4(Operations Mgr), **I want** 태블릿/모바일에서도 Dashboard 사용 **so that** 이동 중에도 관리한다.
- [ ] 반응형 레이아웃 (Tailwind breakpoints)
- [ ] 터치 친화적 UI (최소 44x44px 탭 타겟)

## Epic N.3: Infrastructure

### US-N.3.1: Terraform IaC
**As a** 개발자, **I want** Terraform으로 인프라를 관리 **so that** 인프라가 코드로 버전 관리된다.
- [ ] VPC, ECS Fargate, RDS, ElastiCache, ALB, S3 리소스 정의
- [ ] 환경별 변수 (dev/staging/prod)

### US-N.3.2: ECS Fargate 배포
**As a** 개발자, **I want** ECS Fargate에 컨테이너 배포 **so that** 서버 관리 없이 자동 스케일링된다.
- [ ] Dockerfile 작성 (API + Frontend)
- [ ] ECS Task Definition, Service, Auto Scaling 설정

### US-N.3.3: CI/CD 파이프라인
**As a** 개발자, **I want** 자동화된 빌드/테스트/배포 **so that** 안전하고 빠르게 배포한다.
- [ ] 빌드 → 테스트 → Docker 이미지 → ECR → ECS 배포
- [ ] 의존성 취약점 스캔 포함
