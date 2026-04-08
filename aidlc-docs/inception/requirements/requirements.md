# Inventrix 현대화 프로젝트 — Requirements Document

## Intent Analysis Summary
- **User Request**: Inventrix application의 아키텍처 향상, 새로운 기능 추가, 현대화. Research agent를 통한 업계 트렌드 반영.
- **Request Type**: Enhancement + Migration + New Feature (복합)
- **Scope**: System-wide (Frontend + Backend + DB + Infrastructure + AI/ML + 외부 통합)
- **Complexity**: Complex (전체 4단계 로드맵, Microservices 분해, 다수 외부 시스템 통합)
- **Depth**: Comprehensive

---

## 1. Functional Requirements

### FR-01: Database 마이그레이션 (Phase 1)
- SQLite에서 Amazon RDS PostgreSQL로 마이그레이션
- 기존 4개 테이블 (users, products, orders, order_items) 스키마 변환
- Connection pooling 구성 (pg-pool)
- 시드 데이터 마이그레이션 스크립트 작성
- 주문 생성시 atomic inventory reservation (race condition 해결)

### FR-02: 보안 강화 (Phase 1)
- Helmet.js 보안 헤더 적용 (CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- express-rate-limit 적용 (일반 API: 100req/15min, 인증 API: 10req/15min)
- express-validator 기반 모든 API endpoint 입력 검증
- JWT 개선: 15분 access token + 7일 refresh token + rotation
- JWT secret 환경 변수화 (하드코딩 제거)
- CORS 특정 origin 제한
- bcrypt 비밀번호 해싱 유지 + 비밀번호 정책 추가 (최소 8자)

### FR-03: Redis 캐싱 (Phase 1)
- Amazon ElastiCache Redis 도입
- 재고 데이터 캐싱 (sub-second 읽기)
- 세션 저장소 (JWT refresh token 관리)
- 상품 카탈로그 캐싱

### FR-04: 실시간 재고 Dashboard (Phase 2)
- WebSocket 기반 실시간 재고 업데이트
- Admin Dashboard에 실시간 재고 현황 표시
- 재고 부족/품절 실시간 알림
- 재고 KPI: Inventory Turnover, Days Sales of Inventory, Stockout Rate

### FR-05: 고객 셀프서비스 포털 (Phase 2)
- 주문 내역 조회 (현재 기능 확장)
- 실시간 배송 추적 (embedded, 외부 사이트 redirect 없음)
- 반품 신청 (사유 선택, 반품 라벨 생성)
- 주소록 관리 (저장된 주소로 빠른 주문)
- 원클릭 재주문 (이전 주문 기반)

### FR-06: 주문 상태 Lifecycle (Phase 2)
- 확장된 상태 머신: PENDING → CONFIRMED → PROCESSING → PICKED → PACKED → SHIPPED → DELIVERED
- 취소 flow: PENDING/CONFIRMED → CANCELLED
- 보류 flow: CONFIRMED → ON_HOLD
- 반품 flow: DELIVERED → RETURN_INITIATED → RETURN_RECEIVED → REFUNDED/EXCHANGED
- 백오더 flow: PROCESSING → BACKORDERED
- 각 상태 전환시 WebSocket 실시간 알림

### FR-07: Toss Payments 결제 통합 (Phase 2)
- Toss Payments SDK 클라이언트 사이드 통합
- 결제 승인/취소/환불 API
- Webhook 수신 (결제 성공/실패/환불 이벤트)
- 주문 생성 → 결제 → 확인 flow 구현

### FR-08: 배송 통합 (Phase 2)
- 멀티 캐리어 배송 API 통합 (EasyPost 또는 Shippo)
- 배송비 조회 (rate shopping)
- 배송 라벨 생성
- 배송 추적 webhook 수신
- 고객 포털에 실시간 배송 상태 표시

### FR-09: Bedrock Claude 기반 AI 기능 (Phase 3)
- 재고 Q&A: 자연어로 재고 현황 질의 ("이번 주 품절 위험 SKU는?")
- 수요 내러티브 생성: 주간/월간 수요 분석 보고서 자동 생성
- 기존 이미지 생성 기능 유지 (Amazon Nova Canvas)
- 상품 설명 자동 생성 (속성 기반)

### FR-10: 자동 재주문 제안 (Phase 3)
- 주문 이력 기반 기본 통계 수요 예측
- 동적 재주문 포인트 계산 (forecast × lead_time × safety_stock)
- 재주문 제안 알림 (Admin Dashboard)
- 설정 가능한 임계값 (서비스 레벨, 안전 재고 배수)

### FR-11: AI 상품 추천 (Phase 3)
- "함께 구매한 상품" (주문 이력 기반 연관 규칙)
- "이 상품을 본 고객이 본 상품" (조회 이력 기반)
- Storefront 및 ProductDetail 페이지에 추천 섹션 추가

### FR-12: Microservices 분해 (Phase 4)
- Strangler Fig 패턴으로 점진적 분해
- Order Service, Inventory Service, Auth Service, Notification Service, Analytics Service, AI/ML Service
- SQS + EventBridge 기반 비동기 이벤트 처리
- 서비스 간 REST API 통신 (동기) + 이벤트 (비동기)

### FR-13: Coupang Marketplace 통합 (Phase 4)
- Coupang Wing API 연동
- 상품 동기화 (Inventrix → Coupang)
- 주문 수신 (Coupang → Inventrix)
- 재고 실시간 동기화
- 배송 상태 동기화

### FR-14: ERP 통합 (Phase 4)
- Phase 4에서 구체적 ERP 대상 결정
- 플러그인 방식 통합 레이어 설계 (어댑터 패턴)
- 재고/가격/재무 데이터 동기화
- Webhook + 스케줄 배치 reconciliation

### FR-15: 모바일 PWA (Phase 4)
- 창고 직원용 바코드 스캐닝 PWA
- 오프라인 지원 (Service Worker)
- 입고/출고/재고 실사 기능

---

## 2. Non-Functional Requirements

### NFR-01: Performance
- API 응답 시간 (p95): < 200ms (표준 CRUD)
- 페이지 로드 시간: < 2초 (Google Core Web Vitals)
- 재고 읽기 지연: < 50ms (Redis 캐시)
- 주문 생성 처리량: > 100 orders/sec (PostgreSQL + connection pool)
- 동시 사용자: 100~1,000명 지원

### NFR-02: Scalability
- ECS Fargate 자동 스케일링 (CPU/메모리 기반)
- RDS PostgreSQL Read Replica (분석 쿼리 분리)
- Redis 클러스터 모드 (캐시 확장)
- 피크 트래픽 5~10x 대응

### NFR-03: Security (SECURITY Extension 전체 적용)
- SECURITY-01 ~ SECURITY-15 모든 규칙 blocking constraint로 적용
- Encryption at rest/in transit (TLS 1.2+)
- Access logging (ALB, API Gateway)
- 구조화된 로깅 (Winston/Pino)
- HTTP 보안 헤더 (Helmet.js)
- 입력 검증 (express-validator)
- Least-privilege IAM 정책
- 제한적 네트워크 구성 (Security Group, Private Subnet)
- Application-level 접근 제어 (RBAC)
- 보안 강화 및 설정 오류 방지
- 소프트웨어 공급망 보안 (lock file, 취약점 스캔)
- 보안 설계 원칙 (관심사 분리, 심층 방어, rate limiting)
- 인증 및 자격 증명 관리 (MFA admin, 세션 관리)
- 소프트웨어/데이터 무결성 검증
- 알림 및 모니터링
- 예외 처리 및 fail-safe 기본값

### NFR-04: Reliability
- 가용성 SLA: 99.9% (연간 ~8.7시간 다운타임)
- Multi-AZ RDS 배포
- 헬스체크 endpoint
- 글로벌 에러 핸들러

### NFR-05: Maintainability
- 서비스 레이어 도입 (Fat Routes 해소)
- Repository 패턴 (데이터 접근 추상화)
- Unit Test + Integration Test (Jest + Supertest)
- ESLint + Prettier 코드 품질 도구
- 구조화된 로깅

### NFR-06: Infrastructure
- AWS ECS Fargate (컨테이너 배포)
- Terraform IaC
- CloudFront CDN (정적 자산)
- ALB (Application Load Balancer)
- RDS PostgreSQL (Multi-AZ)
- ElastiCache Redis
- SQS + EventBridge (비동기 메시징)
- S3 (이미지, 내보내기)
- CloudWatch + X-Ray (모니터링)

### NFR-07: Frontend
- Tailwind CSS (모바일 반응형)
- 모바일 퍼스트 디자인
- 접근성 (ARIA, 키보드 네비게이션)
- WebSocket 실시간 업데이트

### NFR-08: Compliance
- PCI DSS 4.0 (Toss Payments client-side tokenization으로 범위 최소화)
- GDPR (데이터 내보내기/삭제 endpoint)
- 감사 로깅 (admin 작업 추적)

---

## 3. Phase별 실행 계획 요약

| Phase | 범위 | 핵심 산출물 |
|---|---|---|
| Phase 1 (Foundation) | DB 마이그레이션, 보안 강화, Redis, 서비스 레이어 | PostgreSQL, Helmet.js, Redis, JWT 개선 |
| Phase 2 (Core Features) | 실시간 Dashboard, 셀프서비스 포털, 결제, 배송 | WebSocket, Toss Payments, EasyPost/Shippo |
| Phase 3 (Intelligence) | AI Q&A, 수요 예측, 상품 추천 | Bedrock Claude, 통계 기반 예측, 추천 엔진 |
| Phase 4 (Scale & Ecosystem) | Microservices, Coupang, ERP, PWA | SQS/EventBridge, Coupang Wing API, 바코드 PWA |

---

## 4. 기술 스택 결정 사항

| 카테고리 | 현재 | 변경 후 |
|---|---|---|
| Database | SQLite | Amazon RDS PostgreSQL |
| Caching | 없음 | Amazon ElastiCache Redis |
| 배포 | deploy.sh (EC2) | AWS ECS Fargate |
| IaC | 없음 | Terraform |
| Frontend 스타일 | 인라인 스타일 | Tailwind CSS |
| 실시간 | 없음 | WebSocket (ws) |
| 결제 | 없음 | Toss Payments |
| 배송 | 없음 | EasyPost 또는 Shippo |
| AI/ML | Bedrock (이미지만) | Bedrock Claude (Q&A, 내러티브) + 통계 예측 |
| 메시징 | 없음 | SQS + EventBridge |
| 모니터링 | 없음 | CloudWatch + X-Ray |
| 테스트 | 없음 | Jest + Supertest |
| 보안 | 기본 JWT | Helmet.js + rate-limit + validator + MFA |
| Marketplace | 없음 | Coupang Wing API |
