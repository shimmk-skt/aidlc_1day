# Frontend Functional Design — 질문

아래 질문에 답변해 주세요. 각 질문의 `[Answer]:` 태그 뒤에 선택지 문자를 입력해 주세요.
제공된 옵션이 맞지 않으면 마지막 옵션(Other)을 선택하고 설명을 추가해 주세요.

---

## Question 1
Tailwind CSS 전환 시 기존 인라인 스타일을 어떤 범위까지 변환하시겠습니까?

A) 전체 변환 — 모든 기존 페이지/컴포넌트의 인라인 스타일을 Tailwind 클래스로 완전 교체
B) 신규 컴포넌트만 — 새로 만드는 컴포넌트만 Tailwind 적용, 기존 페이지는 점진적 전환
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
고객 셀프서비스 포털의 주소록 관리에서 주소 입력 방식은 어떻게 하시겠습니까?

A) 수동 입력 — 사용자가 직접 주소 필드를 입력 (도로명, 상세주소, 우편번호)
B) 우편번호 검색 API 연동 — Daum 우편번호 서비스 등으로 자동 완성
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 3
Toss Payments 결제 UI에서 지원할 결제 수단 범위는 어떻게 하시겠습니까?

A) 카드 결제만 — Toss Payments 카드 결제 위젯만 구현
B) 복합 결제 — 카드 + 간편결제(토스페이, 카카오페이 등) + 계좌이체
C) Toss Payments 표준 위젯 — Toss가 제공하는 기본 결제 위젯 그대로 사용 (모든 결제 수단 자동 포함)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 4
Admin Dashboard의 실시간 KPI 차트 라이브러리로 무엇을 사용하시겠습니까?

A) Recharts — React 친화적, 선언적 API, 가벼움
B) Chart.js (react-chartjs-2) — 범용적, 다양한 차트 타입
C) Nivo — D3 기반, 풍부한 시각화, 서버사이드 렌더링 지원
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
WebSocket 실시간 업데이트의 재연결 전략은 어떻게 하시겠습니까?

A) 자동 재연결 — 연결 끊김 시 exponential backoff로 자동 재연결 (최대 5회)
B) 사용자 알림 + 수동 재연결 — 연결 끊김 시 토스트 알림 표시, 사용자가 재연결 버튼 클릭
C) 자동 재연결 + 알림 — 자동 재연결 시도하면서 상태 표시, 실패 시 수동 재연결 옵션
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6
반품 신청 UI에서 반품 사유 선택 후 추가 정보 입력은 어떤 수준으로 하시겠습니까?

A) 사유 선택만 — 드롭다운에서 사유 선택 (불량, 오배송, 단순변심 등)
B) 사유 + 설명 — 사유 선택 + 자유 텍스트 설명 입력
C) 사유 + 설명 + 사진 — 사유 선택 + 설명 + 사진 첨부 (불량 증빙)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 7
모바일 반응형 디자인의 breakpoint 전략은 어떻게 하시겠습니까?

A) Tailwind 기본 breakpoints — sm(640px), md(768px), lg(1024px), xl(1280px)
B) 커스텀 breakpoints — 프로젝트 특성에 맞게 조정 (예: tablet-portrait, tablet-landscape 추가)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8
AI 기능 UI (Q&A, 수요 예측 차트, 추천 섹션)의 표시 위치와 방식은 어떻게 하시겠습니까?

A) 독립 페이지 — AI Q&A, 수요 예측, 추천을 각각 별도 페이지로 구성
B) 기존 페이지 내 섹션 — Q&A는 Admin Inventory에, 수요 예측은 Admin Dashboard에, 추천은 Storefront/ProductDetail에 임베드
C) 사이드 패널 — AI 기능을 슬라이드 아웃 패널로 어디서든 접근 가능
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 9
주문 상태 타임라인 UI의 표시 방식은 어떻게 하시겠습니까?

A) 수평 스텝 바 — 상태를 수평으로 나열, 현재 상태 하이라이트 (데스크톱 친화적)
B) 수직 타임라인 — 상태를 수직으로 나열, 각 상태에 시간 표시 (모바일 친화적)
C) 반응형 — 데스크톱에서는 수평, 모바일에서는 수직으로 자동 전환
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 10
Phase 4 PWA 기능 (바코드 스캐닝, 오프라인 지원)은 현재 Functional Design에 포함하시겠습니까?

A) 포함 — Phase 4 PWA 기능도 함께 설계 (Service Worker, 바코드 스캐닝 컴포넌트)
B) 제외 — Phase 2/3 기능만 설계, Phase 4는 별도 iteration에서 진행
X) Other (please describe after [Answer]: tag below)

[Answer]: B
