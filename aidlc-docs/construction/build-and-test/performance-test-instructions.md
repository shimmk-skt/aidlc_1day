# Performance Test Instructions — 전체 통합

## Performance Requirements (NFR-01)
- API 응답 시간 (p95): < 200ms (표준 CRUD)
- 페이지 로드 시간: < 2초 (Core Web Vitals)
- 재고 읽기 지연: < 50ms (Redis 캐시)
- 주문 생성 처리량: > 100 orders/sec
- 동시 사용자: 100~1,000명

## 1. API 부하 테스트 (k6)

```bash
# brew install k6

cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('http://localhost:3001/api/products');
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
EOF

k6 run load-test.js
rm load-test.js
```

## 2. Frontend Lighthouse 성능 측정

```bash
# Chrome DevTools → Lighthouse 탭
# 또는 npx lighthouse http://localhost:5173 --output=json
```

### 목표
- Performance Score: > 90
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

## 3. 결과 분석
- p95 응답 시간이 200ms 초과시: DB 쿼리 최적화, Redis 캐시 확인
- 에러율 1% 초과시: 커넥션 풀 크기, rate limit 설정 확인
