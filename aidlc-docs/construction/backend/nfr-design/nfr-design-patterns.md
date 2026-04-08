# NFR Design Patterns — Backend Unit

## Resilience Patterns
- **Circuit Breaker**: 외부 API (Toss, EasyPost, Bedrock) 호출시 실패 임계값 초과시 빠른 실패
- **Retry with Backoff**: 외부 API 일시적 실패시 지수 백오프 재시도 (최대 3회)
- **Graceful Degradation**: Redis 장애시 DB 직접 조회 fallback
- **Bulkhead**: 외부 API 호출을 별도 connection pool로 격리

## Performance Patterns
- **Cache-Aside**: 재고 데이터 Redis 캐시 (TTL 30초, 변경시 무효화)
- **Connection Pooling**: pg-pool (max 20 connections, idle timeout 30초)
- **Read Replica Routing**: 분석 쿼리를 read replica로 라우팅

## Security Patterns
- **Defense in Depth**: Helmet → Rate Limit → JWT Auth → Input Validation → Parameterized Query
- **Token Rotation**: Refresh token 사용시 기존 폐기 + 신규 발급
- **Fail Closed**: 인증/인가 실패시 접근 거부 (기본 deny)

## Observability Patterns
- **Structured Logging**: Pino (JSON format, requestId, timestamp, level)
- **Request Correlation**: 각 요청에 UUID requestId 부여, 모든 로그에 포함
- **Health Check**: GET /health (DB + Redis 연결 상태)
- **Error Boundary**: 글로벌 에러 핸들러 (unhandled rejection 포함)
