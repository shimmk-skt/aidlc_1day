# Dependencies

## Internal Dependencies

```mermaid
graph LR
    Frontend["packages/frontend"] -->|REST API (HTTP)| API["packages/api"]
    API -->|AWS SDK| Bedrock["AWS Bedrock"]
    API -->|better-sqlite3| SQLite["SQLite DB"]
```

### packages/frontend depends on packages/api
- **Type**: Runtime (HTTP)
- **Reason**: Frontend가 Vite proxy를 통해 Backend API를 호출 (/api/*, /images/*)

## External Dependencies

### Backend (packages/api)

| Dependency | Version | Purpose | License |
|---|---|---|---|
| express | ^4.18.2 | HTTP 서버 프레임워크 | MIT |
| better-sqlite3 | ^9.2.2 | SQLite 동기식 DB 드라이버 | MIT |
| bcrypt | ^5.1.1 | 비밀번호 해싱 | MIT |
| jsonwebtoken | ^9.0.2 | JWT 토큰 생성/검증 | MIT |
| cors | ^2.8.5 | Cross-Origin Resource Sharing | MIT |
| @aws-sdk/client-bedrock-runtime | ^3.700.0 | AWS Bedrock AI 모델 호출 | Apache-2.0 |
| @types/express | ^4.17.21 | Express 타입 정의 (dev) | MIT |
| @types/better-sqlite3 | ^7.6.8 | better-sqlite3 타입 정의 (dev) | MIT |
| @types/bcrypt | ^5.0.2 | bcrypt 타입 정의 (dev) | MIT |
| @types/jsonwebtoken | ^9.0.5 | jsonwebtoken 타입 정의 (dev) | MIT |
| @types/cors | ^2.8.17 | cors 타입 정의 (dev) | MIT |
| @types/node | ^20.10.6 | Node.js 타입 정의 (dev) | MIT |
| typescript | ^5.3.3 | TypeScript 컴파일러 (dev) | Apache-2.0 |
| tsx | ^4.7.0 | TypeScript 실행기 (dev) | MIT |

### Frontend (packages/frontend)

| Dependency | Version | Purpose | License |
|---|---|---|---|
| react | ^18.2.0 | UI 라이브러리 | MIT |
| react-dom | ^18.2.0 | React DOM 렌더링 | MIT |
| react-router-dom | ^6.21.1 | 클라이언트 라우팅 | MIT |
| @types/react | ^18.2.47 | React 타입 정의 (dev) | MIT |
| @types/react-dom | ^18.2.18 | React DOM 타입 정의 (dev) | MIT |
| @vitejs/plugin-react | ^4.2.1 | Vite React 플러그인 (dev) | MIT |
| typescript | ^5.3.3 | TypeScript 컴파일러 (dev) | Apache-2.0 |
| vite | ^5.0.10 | 빌드 도구 (dev) | MIT |
