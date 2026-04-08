# Frontend Unit — NFR Design Patterns

## 1. Performance Patterns

### 라우트 기반 코드 스플리팅
```typescript
// React.lazy + Suspense로 라우트별 번들 분리
const StorefrontPage = lazy(() => import('./pages/Storefront'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboard'));
```
- 각 라우트 페이지를 lazy import
- `<Suspense fallback={<LoadingSpinner />}>` 로 로딩 상태 처리
- 초기 번들에는 Layout, Navbar, AuthContext만 포함

### React Query 서버 상태 캐싱
```typescript
// 기본 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5분
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```
- 캐시 무효화: WebSocket 이벤트 수신 시 `queryClient.invalidateQueries()` 호출
- 낙관적 업데이트: 장바구니, 주소록 변경 시 즉시 UI 반영 후 서버 확인

### WebSocket 기반 캐시 무효화
```
WebSocket 이벤트 수신
  → inventory_update → invalidateQueries(['products']), invalidateQueries(['inventory'])
  → order_update → invalidateQueries(['orders', orderId])
  → new_order → invalidateQueries(['orders']), invalidateQueries(['dashboard'])
```

### 이미지 최적화
- `loading="lazy"` 속성으로 뷰포트 밖 이미지 지연 로드
- `<picture>` + `<source type="image/webp">` 로 WebP 우선 제공
- `srcset` + `sizes` 로 디바이스 해상도별 최적 이미지

---

## 2. Resilience Patterns

### 에러 바운더리 (전역 + 페이지)
```
App
├── GlobalErrorBoundary (최상위 — 예상치 못한 크래시 포착)
│   └── Layout
│       ├── PageErrorBoundary (각 라우트 페이지별)
│       │   └── StorefrontPage
│       ├── PageErrorBoundary
│       │   └── AdminDashboardPage
│       └── ...
```
- 전역: 앱 전체 크래시 방지, "문제가 발생했습니다" + 새로고침 버튼
- 페이지: 개별 페이지 에러 격리, "이 페이지를 불러올 수 없습니다" + 재시도 버튼

### API 호출 재시도 (React Query)
- 자동 재시도 3회 (exponential backoff)
- 401 응답: 재시도 안 함 → 토큰 갱신 흐름으로 전환
- 4xx 응답: 재시도 안 함 (클라이언트 에러)
- 5xx 응답: 재시도 수행

### WebSocket 재연결
```
연결 끊김 → 1초 대기 → 재연결 시도
  → 실패 → 2초 대기 → 재연결 시도
  → 실패 → 4초 대기 → 재연결 시도
  → 실패 → 8초 대기 → 재연결 시도
  → 실패 → 16초 대기 → 재연결 시도 (최대 5회)
  → 전부 실패 → 페이지 새로고침 시 재시도
```

### 토큰 갱신 인터셉터
```
API 호출 → 401 수신
  → refreshToken으로 POST /api/auth/refresh
    → 성공: 새 accessToken 저장 → 원래 요청 재시도
    → 실패 (401): 로그아웃 → 로그인 페이지
  → 동시 다발 401: 첫 번째 갱신 요청만 실행, 나머지는 대기 후 재시도
```

---

## 3. Security Patterns

### API 클라이언트 보안
- accessToken: 메모리(Context state)에만 저장, localStorage 사용 안 함
- refreshToken: httpOnly 쿠키로 관리 (Backend에서 설정)
- 모든 API 요청에 `Authorization: Bearer {accessToken}` 헤더 자동 첨부

### 입력 검증 (클라이언트)
- 모든 폼 제출 전 클라이언트 검증 수행
- 서버 검증의 보완 역할 (서버 검증이 최종 권한)
- XSS 방지: React의 기본 이스케이핑 활용, dangerouslySetInnerHTML 사용 금지

### 외부 스크립트 SRI
```html
<script src="https://js.tosspayments.com/..." 
        integrity="sha384-..." 
        crossorigin="anonymous"></script>
```

### CORS
- API 호출은 동일 origin 또는 설정된 API base URL로만 허용
- Vite dev server proxy로 개발 환경 CORS 해결

---

## 4. Accessibility Patterns

### 포커스 관리
- 모달 열림: 모달 내 첫 번째 포커스 가능 요소로 이동
- 모달 닫힘: 모달을 연 트리거 요소로 포커스 복원
- 포커스 트랩: 모달/다이얼로그 내에서 Tab 순환

### 라이브 리전
```html
<div aria-live="polite" aria-atomic="true">
  <!-- 토스트 알림, 실시간 업데이트 메시지 -->
</div>
```

### 폼 접근성
```html
<label htmlFor="email">이메일</label>
<input id="email" aria-invalid={!!error} aria-describedby="email-error" />
<span id="email-error" role="alert">{error}</span>
```

---

## 5. State Management Patterns

### Context 분리
```
AuthContext — 사용자 인증 상태 (user, tokens, login, logout)
CartContext — 장바구니 상태 (items, add, remove, clear)
WebSocketContext — WebSocket 연결 상태 (isConnected, subscribe)
ToastContext — 토스트 알림 (show, dismiss)
AIPanelContext — AI 사이드 패널 (isOpen, activeTab, toggle)
```
- 각 Context는 독립적, 불필요한 리렌더링 방지
- 서버 상태(상품, 주문 등)는 React Query가 관리 (Context 아님)
