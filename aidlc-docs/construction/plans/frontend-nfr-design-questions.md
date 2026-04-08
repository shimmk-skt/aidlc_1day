# Frontend NFR Design — 질문

아래 질문에 답변해 주세요. 각 질문의 `[Answer]:` 태그 뒤에 선택지 문자를 입력해 주세요.

---

## Question 1
Frontend 프로젝트 디렉토리 구조를 어떻게 구성하시겠습니까?

A) Feature 기반 — `src/features/{module}/` 아래 컴포넌트, 훅, 타입을 모듈별로 그룹핑
B) 타입 기반 — `src/components/`, `src/hooks/`, `src/pages/`, `src/utils/` 등 파일 타입별 그룹핑 (현재 구조 유지)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
React Query의 캐시 무효화 전략은 어떻게 하시겠습니까?

A) WebSocket 이벤트 기반 — 서버에서 변경 이벤트 수신 시 해당 쿼리 캐시 무효화
B) 시간 기반 — staleTime 설정으로 일정 시간 후 자동 재조회
C) 혼합 — 실시간 데이터(재고, 주문)는 WebSocket 기반, 나머지는 시간 기반
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
에러 바운더리(Error Boundary) 적용 범위는 어떻게 하시겠습니까?

A) 페이지 단위 — 각 라우트 페이지를 개별 에러 바운더리로 감싸기 (한 페이지 에러가 다른 페이지에 영향 없음)
B) 모듈 단위 — FC1~FC8 각 모듈을 에러 바운더리로 감싸기
C) 전역 + 페이지 — 전역 에러 바운더리 1개 + 각 페이지별 에러 바운더리
X) Other (please describe after [Answer]: tag below)

[Answer]: c
