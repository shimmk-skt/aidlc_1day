# Phase 1 (Foundation) 코드 요약

## 변경 개요
SQLite → PostgreSQL 마이그레이션, 서비스 레이어 도입, 보안 강화, Redis 캐싱.

## 생성/수정 파일

### 설정 (src/config/)
| 파일 | 목적 |
|---|---|
| env.ts | 환경 변수 로딩 (dotenv) |
| database.ts | PostgreSQL connection pool (pg-pool) |
| redis.ts | Redis 클라이언트 (ioredis, graceful fallback) |
| schema.sql | PostgreSQL DDL (12 테이블, 인덱스) |
| migrate.ts | 마이그레이션 실행 스크립트 |
| seed.ts | 시드 데이터 (users 2명, products 24개) |

### Repository (src/repositories/)
| 파일 | 목적 |
|---|---|
| user.repository.ts | 사용자 CRUD |
| product.repository.ts | 상품 CRUD + atomic reserve/release/confirm |
| order.repository.ts | 주문 CRUD + 항목 관리 |
| address.repository.ts | 주소록 CRUD |
| refresh-token.repository.ts | Refresh token hash 저장/검증/폐기 |

### Service (src/services/)
| 파일 | 목적 |
|---|---|
| auth.service.ts | 로그인, 회원가입, JWT rotation, 비밀번호 정책 |
| product.service.ts | 상품 CRUD (repository 위임) |
| order.service.ts | 주문 생성 (atomic reservation), state machine 상태 전환 |
| inventory.service.ts | 재고 예약/해제, Redis 캐시 (30초 TTL), KPI |

### Middleware (src/middleware/)
| 파일 | 목적 |
|---|---|
| auth.ts | JWT 인증, requireAdmin, requireRole |
| validate.ts | express-validator 래퍼 |
| rate-limit.ts | 일반 100/15min, 인증 10/15min |
| error-handler.ts | 글로벌 에러 핸들러 (프로덕션 스택 트레이스 숨김) |
| request-id.ts | UUID 요청 ID (correlation) |

### Routes (src/routes/)
| 파일 | 목적 |
|---|---|
| auth.ts | 로그인/회원가입/refresh/logout |
| products.ts | 상품 CRUD + AI 이미지 생성 |
| orders.ts | 주문 CRUD + 상태 변경 |
| analytics.ts | Dashboard + 재고 현황 + KPI |
| health.ts | 헬스체크 (DB + Redis) |

### 유틸리티 (src/utils/)
| 파일 | 목적 |
|---|---|
| logger.ts | Pino 구조화 로깅 (PII redact) |
| errors.ts | 8개 커스텀 에러 클래스 |

### 기타
| 파일 | 목적 |
|---|---|
| src/types/index.ts | AuthUser, OrderStatus, ORDER_TRANSITIONS |
| src/index.ts | Express 앱 진입점 (Helmet, CORS, rate limit) |
| .env.example | 환경 변수 템플릿 |
| jest.config.ts | Jest ESM 설정 |

### 삭제
| 파일 | 사유 |
|---|---|
| src/db.ts | SQLite (better-sqlite3) 제거 → PostgreSQL 대체 |

## 구현된 Stories
US-1.1.1~4, US-1.2.1~6, US-1.3.1~3, US-N.1.1~3 (13개)
