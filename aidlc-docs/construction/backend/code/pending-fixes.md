# Backend 보완 사항 (FE/Infra 병합 후 수정 예정)

## 🔴 확인 필요
1. **SQL Injection** — ai.service.ts `generateDemandNarrative`의 `${days}` 문자열 보간 → parameterized query 변경
2. **트랜잭션 미사용** — order.service.ts `create`에 PostgreSQL BEGIN/COMMIT/ROLLBACK 적용
3. **Bedrock 모델 ID 하드코딩** — 환경 변수로 분리
4. **N+1 쿼리** — forecastService.getReorderSuggestions 배치 최적화

## 🟡 제안 사항
5. **confirmReservation 미호출** — 결제 성공 후 reserved_qty 확정 로직 추가
6. **AI endpoint rate limiting 강화** — Bedrock 비용 제어
7. **추천 API Public 접근** — 의도 확인 또는 인증 추가
8. **Redis top-level await** — 초기화 함수 분리
9. **에러 핸들러 JSON:API 통일** — jsonApiError() 적용

## 🟢 미사용 의존성 정리
10. **Prisma** — 미사용, 제거 또는 실제 전환
11. **Swagger** — 미구현, 구현 또는 제거
12. **shippingService import** — return.service.ts에서 미사용 import 제거
