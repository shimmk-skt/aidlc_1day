# Frontend Infrastructure Design — 질문

아래 질문에 답변해 주세요. 각 질문의 `[Answer]:` 태그 뒤에 선택지 문자를 입력해 주세요.

---

## Question 1
Frontend 배포 방식을 어떻게 하시겠습니까?

A) S3 + CloudFront — Vite 빌드 결과물을 S3에 업로드, CloudFront로 CDN 배포 (정적 호스팅)
B) ECS Fargate (Nginx) — Nginx 컨테이너에 빌드 결과물 포함, ECS Fargate로 배포
C) S3 + CloudFront (기본) + ECS Fargate (SSR 필요 시 확장) — 현재는 정적, 향후 SSR 전환 가능
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
개발 환경에서 Backend API 연결은 어떻게 하시겠습니까?

A) Vite Proxy — `vite.config.ts`에서 `/api` 요청을 로컬 Backend로 프록시
B) 환경 변수 — `VITE_API_URL` 환경 변수로 API base URL 설정
C) 둘 다 — 로컬 개발은 Vite Proxy, staging/prod는 환경 변수
X) Other (please describe after [Answer]: tag below)

[Answer]: A
