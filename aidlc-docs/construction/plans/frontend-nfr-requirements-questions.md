# Frontend NFR Requirements — 질문

아래 질문에 답변해 주세요. 각 질문의 `[Answer]:` 태그 뒤에 선택지 문자를 입력해 주세요.

---

## Question 1
Frontend 번들 크기 목표는 어떻게 설정하시겠습니까?

A) 엄격 — 초기 로드 번들 200KB 이하 (gzip), 코드 스플리팅 적극 활용
B) 표준 — 초기 로드 번들 500KB 이하 (gzip), 라우트 기반 코드 스플리팅
C) 유연 — 번들 크기 제한 없음, 기능 우선
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
접근성(Accessibility) 준수 수준은 어떻게 하시겠습니까?

A) WCAG 2.1 AA — 키보드 네비게이션, ARIA 라벨, 색상 대비, 스크린 리더 지원
B) 기본 수준 — ARIA 라벨과 키보드 네비게이션만 적용
C) 최소 — 시맨틱 HTML만 사용, 별도 접근성 작업 없음
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
Frontend 상태 관리 라이브러리를 사용하시겠습니까?

A) React Context만 — 추가 라이브러리 없이 Context API + useReducer로 관리
B) Zustand — 가볍고 간단한 상태 관리 (보일러플레이트 최소)
C) Redux Toolkit — 표준적이고 강력한 상태 관리 (DevTools, 미들웨어)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
API 호출 라이브러리와 서버 상태 관리는 어떻게 하시겠습니까?

A) fetch + 커스텀 훅 — 네이티브 fetch API에 인터셉터 패턴 직접 구현
B) Axios + React Query (TanStack Query) — 캐싱, 자동 재시도, 낙관적 업데이트 지원
C) fetch + React Query (TanStack Query) — 네이티브 fetch에 React Query 서버 상태 관리
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 5
Core Web Vitals 성능 목표를 어떻게 설정하시겠습니까?

A) 엄격 (Good 등급) — LCP < 2.5s, FID < 100ms, CLS < 0.1
B) 표준 — LCP < 4s, FID < 300ms, CLS < 0.25
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6
다국어(i18n) 지원이 필요합니까?

A) 한국어 전용 — 다국어 지원 불필요
B) 한국어 + 영어 — 2개 언어 지원 (i18n 프레임워크 도입)
C) 다국어 확장 가능 — i18n 프레임워크 도입하되 한국어만 우선 구현
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7
이미지 최적화 전략은 어떻게 하시겠습니까?

A) 기본 — 상품 이미지를 그대로 사용 (현재와 동일)
B) 클라이언트 최적화 — lazy loading + WebP 포맷 + srcset 반응형 이미지
C) CDN 최적화 — CloudFront + S3에서 이미지 리사이징/포맷 변환 (Infra 유닛 연계)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 8
Frontend 테스트 전략은 어떻게 하시겠습니까?

A) 단위 테스트만 — 비즈니스 로직 훅/유틸리티 함수 테스트 (Vitest)
B) 단위 + 컴포넌트 테스트 — Vitest + React Testing Library로 컴포넌트 렌더링/인터랙션 테스트
C) 단위 + 컴포넌트 + E2E — 위 항목 + Playwright/Cypress로 주요 사용자 흐름 E2E 테스트
X) Other (please describe after [Answer]: tag below)

[Answer]: C
