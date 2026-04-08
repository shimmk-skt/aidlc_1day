# Backend Code Generation Plan

## Unit Context
- **Unit**: Backend (BE)
- **Workspace Root**: /Users/1111476/Downloads/inventrix-code
- **Code Location**: packages/api/src/ (Brownfield — 기존 파일 수정 + 신규 파일 생성)
- **Stories**: 32개 (Phase 1: 13, Phase 2: 14, Phase 3: 8, Phase 4: 10, NFR: 3) — Phase 1 우선 구현

## Phase 1 (Foundation) Code Generation Steps

### Step 1: 프로젝트 구조 및 의존성 설정
- [x] package.json 업데이트 (pg, ioredis, helmet, express-rate-limit, express-validator, pino, ws, dotenv 추가)
- [x] tsconfig.json 업데이트 (strict mode)
- [x] .env.example 생성 (환경 변수 템플릿)
- [x] 디렉토리 구조 생성: src/{config, services, repositories, middleware, routes, utils, types}

### Step 2: 설정 및 유틸리티
- [x] src/config/database.ts — PostgreSQL connection pool 설정
- [x] src/config/redis.ts — Redis 클라이언트 설정 (graceful fallback)
- [x] src/config/env.ts — 환경 변수 로딩 및 검증
- [x] src/utils/logger.ts — Pino 구조화 로깅
- [x] src/utils/errors.ts — 커스텀 에러 클래스 (AppError, ValidationError, NotFoundError)
- [x] src/types/index.ts — 공통 타입 정의

### Step 3: Database 스키마 및 마이그레이션
- [x] src/config/schema.sql — PostgreSQL DDL (12 entities, 인덱스 포함)
- [x] src/config/seed.ts — 시드 데이터 (users 2명, products 24개)
- [x] src/config/migrate.ts — 마이그레이션 실행 스크립트

### Step 4: Repository 레이어
- [x] src/repositories/user.repository.ts
- [x] src/repositories/product.repository.ts
- [x] src/repositories/order.repository.ts
- [x] src/repositories/address.repository.ts
- [x] src/repositories/refresh-token.repository.ts

### Step 5: 핵심 서비스 레이어
- [x] src/services/auth.service.ts — 로그인, 회원가입, JWT rotation, 비밀번호 정책
- [x] src/services/product.service.ts — 상품 CRUD
- [x] src/services/order.service.ts — 주문 생성 (atomic reservation), 상태 전환 (state machine)
- [x] src/services/inventory.service.ts — 재고 예약/해제, 캐시 관리, KPI

### Step 6: 미들웨어
- [x] src/middleware/auth.ts — JWT 인증 (access + refresh), requireAdmin, requireRole
- [x] src/middleware/validate.ts — express-validator 래퍼
- [x] src/middleware/rate-limit.ts — rate limiting 설정
- [x] src/middleware/error-handler.ts — 글로벌 에러 핸들러
- [x] src/middleware/request-id.ts — 요청 ID 생성 (correlation)

### Step 7: Routes (Controllers)
- [x] src/routes/auth.ts — refresh/logout endpoint 추가
- [x] src/routes/products.ts — 입력 검증 추가
- [x] src/routes/orders.ts — atomic reservation, state machine
- [x] src/routes/analytics.ts — 재고 KPI 추가
- [ ] src/routes/health.ts — 신규 (헬스체크)
- **Stories**: US-1.2.3, US-N.1.2

### Step 8: 앱 진입점 수정
- [x] src/index.ts — 수정 (Helmet, CORS 제한, rate limit, 에러 핸들러, 로거 통합)

### Step 9: Phase 1 Unit Tests
- [x] tests/services/order.service.test.ts
- [x] tests/services/errors.test.ts
- [x] jest.config.ts

### Step 10: Phase 1 코드 요약 문서
- [ ] aidlc-docs/construction/backend/code/phase1-summary.md

---

## Phase 2~4 Steps (후속 진행)
Phase 1 완료 후 Phase 2 (결제, 배송, WebSocket, 셀프서비스), Phase 3 (AI, 예측, 추천), Phase 4 (Microservices, Coupang) 순서로 진행.
