# Frontend Unit — Infrastructure Design

## Infrastructure 매핑

### Compute
| 논리 컴포넌트 | AWS 서비스 | 설정 |
|---|---|---|
| Frontend SPA (Nginx) | ECS Fargate | Nginx 컨테이너, 포트 80 |
| Auto Scaling | ECS Service Auto Scaling | CPU 70% 기준, min 2 / max 10 tasks |

### Networking
| 논리 컴포넌트 | AWS 서비스 | 설정 |
|---|---|---|
| Load Balancer | ALB (Application Load Balancer) | HTTPS(443) → Nginx(80) |
| SSL/TLS | ACM (Certificate Manager) | ALB에 인증서 연결 |
| DNS | Route 53 | ALB CNAME |
| API 라우팅 | ALB Path-based Routing | `/api/*` → Backend ECS, `/*` → Frontend ECS |

### Container
| 항목 | 설정 |
|---|---|
| Base Image | `nginx:alpine` |
| 빌드 | Multi-stage: Node.js(빌드) → Nginx(서빙) |
| 포트 | 80 |
| 헬스체크 | `GET /` → 200 OK |
| 이미지 레지스트리 | ECR (Elastic Container Registry) |

### Monitoring
| 논리 컴포넌트 | AWS 서비스 | 설정 |
|---|---|---|
| 컨테이너 로그 | CloudWatch Logs | Nginx access/error 로그 |
| 메트릭 | CloudWatch Metrics | ECS CPU/메모리, ALB 요청 수/지연 |
| 알림 | CloudWatch Alarms | 5xx 에러율 > 1%, CPU > 80% |

---

## 환경별 구성

| 항목 | dev | staging | prod |
|---|---|---|---|
| ECS Tasks | 1 | 2 | 2~10 (Auto Scaling) |
| API 연결 | Vite Proxy (localhost:3000) | ALB 내부 DNS | ALB 내부 DNS |
| 도메인 | localhost:5173 | staging.inventrix.dev | inventrix.dev |

---

## Nginx 설정 요점

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # SPA 라우팅 — 모든 경로를 index.html로
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 정적 자산 캐싱 (Vite 해시 파일명)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 보안 헤더
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "DENY";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # gzip 압축
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

---

## Dockerfile 구조

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
