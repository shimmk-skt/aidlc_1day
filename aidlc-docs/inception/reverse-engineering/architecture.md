# System Architecture

## System Overview
Inventrix는 pnpm workspace 기반 monorepo로 구성된 full-stack e-commerce 플랫폼입니다. Frontend(React+TypeScript)와 Backend(Node.js+Express+TypeScript)로 구성되며, SQLite를 데이터 저장소로, AWS Bedrock를 AI 이미지 생성에 사용합니다.

## Architecture Diagram

```mermaid
graph TB
    subgraph Frontend["packages/frontend (React 18 + TypeScript)"]
        Vite["Vite Dev Server / Build"]
        Router["React Router v6"]
        AuthCtx["AuthContext (JWT 관리)"]
        Pages["Pages (Storefront, ProductDetail, Orders, Admin*)"]
        Layout["Layout Component (Navigation)"]
    end

    subgraph Backend["packages/api (Node.js + Express + TypeScript)"]
        Express["Express Server (port 3000)"]
        AuthMW["Auth Middleware (JWT)"]
        AuthRoutes["Auth Routes (/api/auth)"]
        ProductRoutes["Product Routes (/api/products)"]
        OrderRoutes["Order Routes (/api/orders)"]
        AnalyticsRoutes["Analytics Routes (/api/analytics)"]
        ImageGen["Image Generator Service"]
    end

    subgraph DataLayer["Data Layer"]
        SQLite["SQLite (better-sqlite3)"]
        StaticFiles["Static Files (public/images)"]
    end

    subgraph External["External Services"]
        Bedrock["AWS Bedrock (Amazon Nova Canvas)"]
    end

    Frontend -->|REST API calls| Express
    Vite -->|Proxy /api, /images| Express
    Express --> AuthMW
    AuthMW --> AuthRoutes
    AuthMW --> ProductRoutes
    AuthMW --> OrderRoutes
    AuthMW --> AnalyticsRoutes
    ProductRoutes --> ImageGen
    ImageGen --> Bedrock
    AuthRoutes --> SQLite
    ProductRoutes --> SQLite
    OrderRoutes --> SQLite
    AnalyticsRoutes --> SQLite
    Express --> StaticFiles
```

## Component Descriptions

### packages/frontend
- **Purpose**: React 기반 SPA (Single Page Application)
- **Responsibilities**: UI 렌더링, 클라이언트 라우팅, 인증 상태 관리, API 호출
- **Dependencies**: react, react-dom, react-router-dom
- **Type**: Application (Frontend)

### packages/api
- **Purpose**: RESTful API 서버
- **Responsibilities**: 비즈니스 로직, 데이터 접근, 인증/인가, AI 이미지 생성
- **Dependencies**: express, better-sqlite3, bcrypt, jsonwebtoken, cors, @aws-sdk/client-bedrock-runtime
- **Type**: Application (Backend)

## Data Flow

```mermaid
sequenceDiagram
    participant C as Customer (Browser)
    participant F as Frontend (React)
    participant A as API (Express)
    participant DB as SQLite
    participant B as AWS Bedrock

    Note over C,DB: 주문 생성 Flow
    C->>F: 상품 선택 + 수량 입력
    F->>A: POST /api/orders (JWT Bearer)
    A->>A: JWT 검증
    A->>DB: 상품 재고 확인
    A->>DB: 주문 생성 (orders)
    A->>DB: 주문 항목 생성 (order_items)
    A->>DB: 재고 차감 (products.stock)
    A-->>F: 201 Created (orderId, total)
    F-->>C: 주문 완료 메시지

    Note over C,B: AI 이미지 생성 Flow
    C->>F: 상품명 + 설명 입력
    F->>A: POST /api/products/generate-image (Admin JWT)
    A->>B: InvokeModel (Nova Canvas)
    B-->>A: Base64 이미지
    A->>A: 파일 저장 (public/images/)
    A-->>F: imageUrl
```

## Integration Points
- **External APIs**: AWS Bedrock Runtime (Amazon Nova Canvas v1:0) - 상품 이미지 생성
- **Databases**: SQLite (better-sqlite3) - 모든 데이터 저장 (users, products, orders, order_items)
- **Third-party Services**: 없음 (결제, 배송 등 미통합)

## Infrastructure Components
- **CDK Stacks**: 없음 (IaC 미구성)
- **Deployment Model**: deploy.sh 스크립트 기반 AWS 배포 (EC2 추정)
- **Networking**: 미정의 (로컬 개발 환경 중심)
