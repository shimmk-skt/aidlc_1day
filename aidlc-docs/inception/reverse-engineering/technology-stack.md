# Technology Stack

## Programming Languages
- **TypeScript** - 5.3.3 - Frontend 및 Backend 전체

## Frameworks
- **React** - 18.2.0 - Frontend UI 라이브러리
- **Express** - 4.18.2 - Backend HTTP 서버 프레임워크
- **React Router** - 6.21.1 - 클라이언트 사이드 라우팅
- **Vite** - 5.0.10 - Frontend 빌드 도구 및 개발 서버

## Infrastructure
- **SQLite** (better-sqlite3 9.2.2) - 관계형 데이터베이스
- **AWS Bedrock** (Amazon Nova Canvas v1:0) - AI 이미지 생성
- **Static File Serving** - Express static middleware (상품 이미지)

## Build Tools
- **pnpm** - Workspace monorepo 패키지 매니저
- **tsc** (TypeScript 5.3.3) - TypeScript 컴파일러 (Backend 빌드)
- **Vite** (5.0.10) - Frontend 빌드 (React plugin)
- **tsx** (4.7.0) - TypeScript 실행기 (Backend 개발 모드, watch)

## Testing Tools
- 없음 (테스트 프레임워크 미설정)

## Security Libraries
- **bcrypt** (5.1.1) - 비밀번호 해싱 (salt rounds: 10)
- **jsonwebtoken** (9.0.2) - JWT 토큰 생성/검증 (만료: 7일)
- **cors** (2.8.5) - CORS 설정 (현재 전체 허용)

## AWS SDK
- **@aws-sdk/client-bedrock-runtime** (^3.700.0) - Bedrock 모델 호출
