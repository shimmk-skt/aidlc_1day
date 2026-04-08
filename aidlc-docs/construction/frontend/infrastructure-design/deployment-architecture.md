# Frontend Unit — Deployment Architecture

## 배포 아키텍처 다이어그램

```
+----------+     +-----+     +------------------+     +------------------+
|  Client  |---->| ALB |---->| Frontend ECS     |     | Backend ECS      |
| (Browser)|     |     |     | (Nginx container)|     | (Node.js)        |
+----------+     +--+--+     +------------------+     +------------------+
                    |                                         ^
                    |         /api/* path routing              |
                    +-----------------------------------------+
                    |
                    v
              +----------+
              | ACM Cert |
              | (HTTPS)  |
              +----------+
```

## 요청 흐름

### 정적 자산 요청 (HTML, JS, CSS, 이미지)
```
Client → ALB (HTTPS:443) → Frontend ECS Nginx (HTTP:80) → 정적 파일 응답
```

### API 요청
```
Client → ALB (HTTPS:443) → /api/* path rule → Backend ECS (HTTP:3000)
```

### WebSocket 연결
```
Client → ALB (HTTPS:443) → /ws path rule → Backend ECS (WS upgrade)
```

## ALB 라우팅 규칙

| 우선순위 | 조건 | 대상 |
|---|---|---|
| 1 | Path: `/api/*` | Backend Target Group (port 3000) |
| 2 | Path: `/ws` | Backend Target Group (port 3000, WebSocket) |
| 3 | Path: `/*` (기본) | Frontend Target Group (port 80) |

## CI/CD 파이프라인 (Frontend)

```
코드 푸시 → 빌드 트리거
  1. pnpm install
  2. pnpm lint
  3. pnpm test (Vitest)
  4. pnpm build (Vite)
  5. Docker build (multi-stage)
  6. Docker push → ECR
  7. ECS Service 업데이트 (rolling deployment)
  8. 헬스체크 확인
```

## 개발 환경

```
+----------+     +-------------------+     +-------------------+
|  Browser |---->| Vite Dev Server   |---->| Backend (local)   |
|          |     | localhost:5173    |     | localhost:3000    |
+----------+     | proxy: /api/*    |     |                   |
                 +-------------------+     +-------------------+
```

### vite.config.ts proxy 설정
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
      },
    },
  },
});
```
