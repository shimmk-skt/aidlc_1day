# NFR Requirements — Backend Unit

## Performance
| Metric | Target | 측정 방법 |
|---|---|---|
| API 응답 시간 (p95) | < 200ms | CloudWatch X-Ray |
| 재고 조회 지연 | < 50ms | Redis 캐시 hit |
| 주문 생성 처리량 | > 100 orders/sec | 부하 테스트 |
| DB 쿼리 시간 (p95) | < 100ms | pg-pool 메트릭 |

## Scalability
- ECS Fargate 자동 스케일링 (CPU 70% 임계값)
- RDS Read Replica (분석 쿼리 분리)
- Redis 클러스터 (캐시 확장)
- 동시 사용자: 100~1,000명

## Availability
- 가용성 SLA: 99.9%
- RDS Multi-AZ (자동 failover)
- ECS 최소 2개 task (multi-AZ)
- 헬스체크: GET /health (DB + Redis 연결 확인)

## Security (SECURITY-01~15 적용)
- TLS 1.2+ (모든 통신)
- RDS 저장 암호화 (AES-256)
- Helmet.js 보안 헤더
- Rate limiting (일반 100/15min, 인증 10/15min)
- express-validator 입력 검증
- JWT 15분 access + 7일 refresh rotation
- CORS 특정 origin 제한
- Parameterized queries (SQL injection 방지)
- 구조화된 로깅 (PII 제외)
- 글로벌 에러 핸들러 (스택 트레이스 숨김)

## Tech Stack Decisions

| 카테고리 | 선택 | 근거 |
|---|---|---|
| Runtime | Node.js 22 + Express 4 | 기존 스택 유지, 안정성 |
| Language | TypeScript 5.x | 기존 유지, 타입 안전성 |
| DB | PostgreSQL 16 (pg + pg-pool) | 동시성, MVCC, JSON 지원 |
| Cache | Redis 7 (ioredis) | 재고 캐시, 세션, pub/sub |
| WebSocket | ws | 경량, Node.js 네이티브 |
| Validation | express-validator | Express 생태계 표준 |
| Security | helmet, express-rate-limit | 업계 표준 |
| Logging | pino | 고성능 구조화 로깅 |
| Testing | jest + supertest | Node.js 표준 |
| Payment | @tosspayments/payment-sdk | Toss Payments 공식 SDK |
| Shipping | easypost (npm) | 멀티 캐리어 통합 |
| AI | @aws-sdk/client-bedrock-runtime | 기존 통합 확장 |
