# Frontend Unit — Tech Stack Decisions

## 확정 기술 스택

| 카테고리 | 기술 | 버전 | 선택 근거 |
|---|---|---|---|
| UI 프레임워크 | React | 18.x | 기존 코드베이스 유지 |
| 언어 | TypeScript | 5.x | 기존 코드베이스 유지, strict 모드 |
| 빌드 도구 | Vite | 5.x | 기존 코드베이스 유지, 빠른 HMR |
| 라우팅 | React Router | v6 | 기존 코드베이스 유지 |
| CSS 프레임워크 | Tailwind CSS | 3.x | NFR-07 (모바일 반응형), 인라인 스타일 전체 교체 |
| 상태 관리 | React Context + useReducer | — | 추가 의존성 없음, 프로젝트 규모에 적합 |
| 서버 상태 | TanStack Query (React Query) | 5.x | 캐싱, 자동 재시도, 낙관적 업데이트 |
| API 호출 | fetch (native) | — | 추가 의존성 없음, React Query와 조합 |
| 차트 | Recharts | 2.x | React 친화적, 선언적 API (Q4 결정) |
| 결제 | Toss Payments SDK | — | 표준 위젯 사용 (Q3 결정) |
| 주소 검색 | Daum 우편번호 서비스 | — | 한국 주소 표준 (Q2 결정) |
| 단위/컴포넌트 테스트 | Vitest + React Testing Library | — | Vite 네이티브, 빠른 실행 |
| E2E 테스트 | Playwright | — | 크로스 브라우저, 안정적 |
| 코드 품질 | ESLint + Prettier | — | 일관된 코드 스타일 |

## 신규 의존성 (추가 설치 필요)

### dependencies
```
tailwindcss
@tanstack/react-query
recharts
```

### devDependencies
```
autoprefixer
postcss
vitest
@testing-library/react
@testing-library/jest-dom
@testing-library/user-event
jsdom
@playwright/test
```

## 제외된 기술 및 근거

| 기술 | 제외 근거 |
|---|---|
| Zustand / Redux Toolkit | React Context로 충분 (8개 모듈, 중간 규모) |
| Axios | fetch + React Query 조합으로 충분, 의존성 최소화 |
| i18n 프레임워크 | 한국어 전용, 다국어 불필요 |
| Chart.js / Nivo | Recharts가 React 친화적이고 가벼움 |
| Cypress | Playwright가 크로스 브라우저 지원 우수 |

## 외부 스크립트 (SRI 필수)

| 스크립트 | 로드 방식 | SRI |
|---|---|---|
| Toss Payments SDK | `<script>` 태그 | integrity hash 필수 (SECURITY-13) |
| Daum 우편번호 | `<script>` 태그 | integrity hash 필수 (SECURITY-13) |
