# Frontend Unit — Business Logic Model

## 1. 인증 흐름 (FC1: AuthModule)

### 로그인
```
사용자 → 이메일/비밀번호 입력 → POST /api/auth/login
  → 성공: accessToken + refreshToken 저장 → 메인 페이지 이동
  → 실패: 에러 메시지 표시 (잘못된 자격 증명)
```

### 회원가입
```
사용자 → 이메일/비밀번호/이름 입력 → 클라이언트 검증 → POST /api/auth/register
  → 성공: 자동 로그인 → 메인 페이지 이동
  → 실패: 에러 메시지 표시 (중복 이메일, 비밀번호 정책 미충족)
```

### 토큰 갱신
```
API 호출 → 401 응답 수신
  → refreshToken으로 POST /api/auth/refresh
    → 성공: 새 accessToken 저장 → 원래 요청 재시도
    → 실패: 로그아웃 처리 → 로그인 페이지 이동
```

### 로그아웃
```
사용자 → 로그아웃 클릭 → POST /api/auth/logout (refreshToken 폐기)
  → 로컬 토큰/사용자 정보 삭제 → 로그인 페이지 이동
```

---

## 2. 상품 탐색 및 장바구니 흐름 (FC2: StorefrontModule)

### 상품 목록
```
페이지 로드 → GET /api/products → 상품 그리드 렌더링
  → 카테고리 필터/검색 → 쿼리 파라미터로 재요청
```

### 상품 상세
```
상품 클릭 → GET /api/products/:id → 상세 정보 표시
  → 추천 상품 로드 (GET /api/recommendations/product/:id)
  → "함께 구매한 상품" 섹션 표시
```

### 장바구니 (클라이언트 상태)
```
"장바구니 담기" 클릭 → CartContext에 추가 (localStorage 동기화)
  → 수량 변경: CartContext 업데이트
  → 삭제: CartContext에서 제거
  → 결제 진행: Checkout 페이지로 이동
```

---

## 3. 결제 흐름 (FC3: CheckoutModule)

### Toss Payments 결제
```
Checkout 페이지 진입
  → 배송 주소 선택 (저장된 주소 목록 또는 신규 입력)
  → 주문 요약 확인
  → POST /api/orders (주문 생성, 상태: PENDING)
  → Toss Payments 표준 위젯 로드 (requestPayment)
    → 결제 성공: successUrl로 리다이렉트 → POST /api/payments/confirm → 주문 확인 페이지
    → 결제 실패: failUrl로 리다이렉트 → 에러 표시 + 재시도 옵션
```

---

## 4. 주문 관리 흐름 (FC4: OrderModule)

### 주문 내역
```
페이지 로드 → GET /api/orders → 주문 목록 렌더링
  → 주문 클릭 → GET /api/orders/:id → 상세 표시 (항목, 타임라인)
```

### 주문 상태 타임라인
```
주문 상세 → statusHistory 배열로 타임라인 렌더링
  → 데스크톱: 수평 스텝 바 (현재 상태 하이라이트)
  → 모바일: 수직 타임라인 (각 상태에 시간 표시)
  → WebSocket으로 실시간 상태 업데이트 수신
```

### 재주문
```
주문 내역 → "재주문" 버튼 클릭
  → POST /api/orders/:id/reorder (재고 확인 포함)
    → 성공: 새 주문 생성 → Checkout 흐름으로 이동
    → 실패: 재고 부족 상품 표시
```

---

## 5. 셀프서비스 흐름 (FC5: SelfServiceModule)

### 배송 추적
```
주문 상세 → 배송 상태 섹션
  → GET /api/orders/:id/tracking → 추적 정보 표시
  → WebSocket으로 실시간 배송 상태 업데이트
```

### 반품 신청
```
주문 상세 (DELIVERED 상태) → "반품 신청" 버튼
  → 반품 사유 선택 (드롭다운)
  → 설명 입력 (텍스트)
  → 사진 첨부 (파일 업로드, 최대 3장)
  → POST /api/returns (multipart/form-data)
    → 성공: 반품 라벨 URL 표시 + 반품 상태 추적
    → 실패: 에러 메시지 표시
```

### 주소록 관리
```
마이페이지 → 주소록 탭
  → GET /api/addresses → 주소 목록 표시
  → "주소 추가" → Daum 우편번호 API 팝업 → 주소 자동 완성 → 상세 주소 입력
  → POST /api/addresses → 목록 갱신
  → 수정/삭제/기본 주소 설정: PUT/DELETE /api/addresses/:id
```

---

## 6. Admin Dashboard 흐름 (FC6: AdminDashboardModule)

### 실시간 KPI Dashboard
```
Admin Dashboard 진입 → GET /api/analytics/dashboard → KPI 카드 + 차트 렌더링
  → WebSocket 연결 → 실시간 업데이트 수신
    → inventory_update: KPI 카드 갱신
    → new_order: 주문 피드에 추가 + 매출 차트 갱신
    → low_stock_alert: 알림 배지 표시
```

### 재고 관리
```
Admin Inventory → GET /api/products (재고 포함) → 재고 테이블 렌더링
  → 재고 수량 인라인 편집 → PUT /api/products/:id
  → 재고 부족 상품 하이라이트 (stock < 10: 노란색, stock = 0: 빨간색)
  → 수요 예측 차트 (Recharts) → GET /api/forecast/:productId
```

### 주문 관리
```
Admin Orders → GET /api/orders (전체) → 주문 테이블 렌더링
  → 상태 필터 (드롭다운)
  → 상태 변경: PUT /api/orders/:id/status → 실시간 반영
  → 배송 라벨 생성: POST /api/shipping/labels/:orderId
```

---

## 7. AI 사이드 패널 흐름 (FC7: AIModule)

### AI 사이드 패널
```
어느 페이지에서든 AI 버튼 클릭 → 사이드 패널 슬라이드 아웃
  → 탭 전환: Q&A / 수요 예측 / 추천
```

### AI Q&A (Admin 전용)
```
Q&A 탭 → 질문 입력 → POST /api/ai/ask → 스트리밍 응답 표시
  → 대화 이력 유지 (세션 내)
```

### 수요 예측 (Admin 전용)
```
수요 예측 탭 → 상품 선택 → GET /api/forecast/:productId
  → Recharts 라인 차트로 14일 예측 표시
  → 재주문 포인트 라인 표시
```

### 상품 추천 (고객)
```
추천 탭 → GET /api/recommendations/user/:userId
  → 개인화 추천 상품 목록 표시
  → 상품 클릭 → ProductDetail 페이지 이동
```

---

## 8. WebSocket 실시간 통신 (FC8: WebSocketModule)

### 연결 관리
```
앱 로드 + 인증 완료 → WebSocket 연결 (ws://host/ws?token=JWT)
  → 연결 성공: 이벤트 리스너 등록
  → 연결 끊김: exponential backoff 자동 재연결 (1s, 2s, 4s, 8s, 16s, 최대 5회)
  → 재연결 실패: 페이지 새로고침 시 재시도
  → 로그아웃: WebSocket 연결 종료
```

### 이벤트 분배
```
WebSocket 메시지 수신 → 이벤트 타입별 분배
  → inventory_update: InventoryContext 업데이트
  → order_update: OrderContext 업데이트
  → new_order: Admin Dashboard 주문 피드 추가
  → low_stock_alert: 토스트 알림 표시
  → reorder_alert: 토스트 알림 표시
```
