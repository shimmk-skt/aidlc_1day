# Frontend Unit — NFR Requirements

## 1. Performance

### Core Web Vitals (Good 등급 목표)
| 지표 | 목표 | 측정 방법 |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse, Web Vitals API |
| FID (First Input Delay) | < 100ms | Lighthouse, Web Vitals API |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse, Web Vitals API |

### 번들 크기
| 항목 | 목표 |
|---|---|
| 초기 로드 번들 (gzip) | < 500KB |
| 코드 스플리팅 | 라우트 기반 (React.lazy + Suspense) |
| 트리 쉐이킹 | Vite 기본 설정 활용 |

### 이미지 최적화
| 기법 | 적용 |
|---|---|
| Lazy Loading | `loading="lazy"` 속성, 뷰포트 진입 시 로드 |
| WebP 포맷 | `<picture>` 태그로 WebP 우선, fallback PNG/JPEG |
| 반응형 이미지 | `srcset` + `sizes` 속성으로 디바이스별 최적 크기 |

### API 응답 처리
| 항목 | 목표 |
|---|---|
| 서버 상태 캐싱 | React Query staleTime/cacheTime 설정 |
| 자동 재시도 | 실패 시 3회 재시도 (exponential backoff) |
| 낙관적 업데이트 | 장바구니, 주소록 등 즉각 반영 |

---

## 2. Accessibility (WCAG 2.1 AA)

| 항목 | 요구사항 |
|---|---|
| 키보드 네비게이션 | 모든 인터랙티브 요소 Tab/Enter/Escape로 접근 가능 |
| ARIA 라벨 | 모든 폼 필드, 버튼, 링크에 aria-label 또는 연결된 label |
| 색상 대비 | 텍스트/배경 대비 최소 4.5:1 (일반), 3:1 (큰 텍스트) |
| 스크린 리더 | 시맨틱 HTML + aria-live 영역 (토스트, 실시간 업데이트) |
| 포커스 관리 | 모달 열림 시 포커스 트랩, 닫힘 시 원래 위치 복원 |
| 탭 타겟 크기 | 최소 44x44px (모바일) |
| 대체 텍스트 | 모든 이미지에 alt 속성 |
| 폼 에러 | aria-invalid + aria-describedby로 에러 메시지 연결 |

---

## 3. Security (Frontend 적용 범위)

| SECURITY Rule | Frontend 적용 |
|---|---|
| SECURITY-05 | 모든 폼 클라이언트 검증 (서버 검증의 보완) |
| SECURITY-08 | 라우트 가드 (ProtectedRoute), RBAC 기반 UI 분기 |
| SECURITY-09 | 에러 메시지에 내부 정보 노출 방지 |
| SECURITY-10 | lock file 커밋, 의존성 취약점 스캔 |
| SECURITY-12 | 토큰 메모리 저장 (accessToken), httpOnly 쿠키 (refreshToken은 BE 처리) |
| SECURITY-13 | 외부 CDN 스크립트 SRI hash 적용 (Daum 우편번호, Toss Payments SDK) |

---

## 4. Reliability

| 항목 | 요구사항 |
|---|---|
| 에러 바운더리 | React ErrorBoundary로 컴포넌트 크래시 격리 |
| API 실패 처리 | React Query retry + 사용자 피드백 (토스트) |
| WebSocket 재연결 | Exponential backoff 자동 재연결 (최대 5회) |
| 오프라인 감지 | navigator.onLine + 오프라인 배너 표시 |

---

## 5. Maintainability

| 항목 | 요구사항 |
|---|---|
| 코드 품질 | ESLint + Prettier 설정 |
| 타입 안전성 | TypeScript strict 모드 |
| 테스트 커버리지 | 비즈니스 로직 훅 80%+, 주요 컴포넌트 렌더링 테스트 |
| 디렉토리 구조 | 모듈 기반 (features/) + 공통 (components/, hooks/, utils/) |

---

## 6. Testing Strategy

### 테스트 피라미드
| 레벨 | 도구 | 범위 |
|---|---|---|
| 단위 테스트 | Vitest | 커스텀 훅, 유틸리티 함수, 비즈니스 로직 |
| 컴포넌트 테스트 | Vitest + React Testing Library | 컴포넌트 렌더링, 사용자 인터랙션, 폼 검증 |
| E2E 테스트 | Playwright | 주요 사용자 흐름 (로그인→상품탐색→결제→주문확인) |

### E2E 테스트 시나리오
- 회원가입 → 로그인 → 로그아웃
- 상품 탐색 → 장바구니 → 결제 → 주문 확인
- 주문 내역 → 배송 추적
- 반품 신청
- Admin 로그인 → Dashboard → 주문 상태 변경

---

## 7. Usability

| 항목 | 요구사항 |
|---|---|
| 언어 | 한국어 전용 |
| 반응형 | Tailwind 기본 breakpoints (sm/md/lg/xl) |
| 로딩 상태 | 스켈레톤 UI 또는 스피너 |
| 빈 상태 | 안내 메시지 + CTA |
| 토스트 알림 | 성공(초록), 에러(빨강), 정보(파랑) |
