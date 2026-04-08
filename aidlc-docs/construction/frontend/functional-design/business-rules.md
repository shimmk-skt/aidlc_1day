# Frontend Unit — Business Rules

## 1. 폼 검증 규칙

### 로그인 폼
| 필드 | 규칙 |
|---|---|
| email | 필수, 이메일 형식, 최대 255자 |
| password | 필수, 최소 8자 |

### 회원가입 폼
| 필드 | 규칙 |
|---|---|
| email | 필수, 이메일 형식, 최대 255자 |
| password | 필수, 최소 8자, 영문+숫자 조합 |
| name | 필수, 최소 2자, 최대 100자 |

### 주소 폼
| 필드 | 규칙 |
|---|---|
| name (수령인) | 필수, 최소 2자, 최대 50자 |
| phone | 필수, 한국 전화번호 형식 (010-XXXX-XXXX) |
| zipCode | 필수, Daum API에서 자동 입력 (수동 편집 불가) |
| address | 필수, Daum API에서 자동 입력 (수동 편집 불가) |
| addressDetail | 필수, 최소 1자, 최대 200자 |

### 반품 신청 폼
| 필드 | 규칙 |
|---|---|
| reason | 필수, ReturnReason enum 중 선택 |
| description | 선택, 최대 1000자 |
| photos | 선택, 최대 3장, 각 파일 5MB 이하, JPEG/PNG만 허용 |

---

## 2. 권한 기반 라우팅 규칙

| 경로 패턴 | 접근 권한 | 미인증 시 | 권한 부족 시 |
|---|---|---|---|
| `/login`, `/register` | 모든 사용자 | 허용 | N/A |
| `/` (Storefront) | 모든 사용자 | 허용 | N/A |
| `/products/:id` | 모든 사용자 | 허용 | N/A |
| `/orders` | 인증된 사용자 | → `/login` | N/A |
| `/my/*` (셀프서비스) | 인증된 사용자 | → `/login` | N/A |
| `/checkout` | 인증된 사용자 | → `/login` | N/A |
| `/admin/*` | admin 역할만 | → `/login` | → `/` |

### AI 사이드 패널 권한
| 탭 | 접근 권한 |
|---|---|
| Q&A | admin만 |
| 수요 예측 | admin만 |
| 추천 | 인증된 사용자 (고객 + admin) |

---

## 3. 주문 상태별 UI 표시 규칙

### 고객 주문 상세 — 가용 액션
| 상태 | 표시 색상 | 가용 액션 |
|---|---|---|
| PENDING | 회색 | 취소 |
| CONFIRMED | 파란색 | 취소 |
| PROCESSING | 파란색 | 없음 |
| PICKED | 파란색 | 없음 |
| PACKED | 파란색 | 없음 |
| SHIPPED | 보라색 | 배송 추적 |
| DELIVERED | 초록색 | 반품 신청, 재주문 |
| CANCELLED | 빨간색 | 재주문 |
| ON_HOLD | 노란색 | 없음 |
| BACKORDERED | 주황색 | 취소 |
| RETURN_INITIATED | 노란색 | 반품 라벨 다운로드 |
| RETURN_RECEIVED | 노란색 | 없음 |
| REFUNDED | 초록색 | 재주문 |
| EXCHANGED | 초록색 | 없음 |

### Admin 주문 관리 — 상태 전환 가능 목록
| 현재 상태 | 전환 가능 상태 |
|---|---|
| PENDING | CONFIRMED, CANCELLED |
| CONFIRMED | PROCESSING, ON_HOLD, CANCELLED |
| ON_HOLD | CONFIRMED, CANCELLED |
| PROCESSING | PICKED, BACKORDERED |
| BACKORDERED | PROCESSING, CANCELLED |
| PICKED | PACKED |
| PACKED | SHIPPED |
| SHIPPED | DELIVERED |
| DELIVERED | RETURN_INITIATED |
| RETURN_INITIATED | RETURN_RECEIVED |
| RETURN_RECEIVED | REFUNDED, EXCHANGED |

---

## 4. 에러 처리 규칙

### API 에러 응답 처리
| HTTP 상태 | 처리 |
|---|---|
| 400 | 폼 필드별 에러 메시지 표시 |
| 401 | 토큰 갱신 시도 → 실패 시 로그아웃 |
| 403 | "접근 권한이 없습니다" 메시지 |
| 404 | "요청한 리소스를 찾을 수 없습니다" 메시지 |
| 409 | 충돌 메시지 표시 (예: 재고 부족) |
| 429 | "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요" |
| 500 | "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요" |

### 사용자 피드백 패턴
| 상황 | 피드백 방식 |
|---|---|
| 폼 검증 실패 | 필드 아래 인라인 에러 메시지 (빨간색) |
| API 성공 | 토스트 알림 (초록색, 3초 자동 닫힘) |
| API 실패 | 토스트 알림 (빨간색, 수동 닫힘) |
| 로딩 중 | 버튼 비활성화 + 스피너 |
| 빈 상태 | 일러스트 + 안내 메시지 + CTA 버튼 |
| WebSocket 이벤트 | 토스트 알림 (파란색, 5초 자동 닫힘) |

---

## 5. 장바구니 규칙

| 규칙 | 설명 |
|---|---|
| 최대 수량 | 상품당 최대 99개 |
| 재고 초과 방지 | 장바구니 수량 > 재고 시 경고 표시 |
| 영속성 | localStorage에 저장, 로그인/로그아웃 시 유지 |
| 빈 장바구니 | Checkout 진행 불가, "장바구니가 비어있습니다" 표시 |

---

## 6. 반응형 디자인 규칙

### Tailwind Breakpoints (기본값)
| Breakpoint | 최소 너비 | 대상 디바이스 |
|---|---|---|
| (기본) | 0px | 모바일 |
| sm | 640px | 큰 모바일 |
| md | 768px | 태블릿 |
| lg | 1024px | 데스크톱 |
| xl | 1280px | 큰 데스크톱 |

### 레이아웃 규칙
| 컴포넌트 | 모바일 | 태블릿 | 데스크톱 |
|---|---|---|---|
| 네비게이션 | 햄버거 메뉴 | 축약 메뉴 | 전체 메뉴 |
| 상품 그리드 | 1열 | 2열 | 3~4열 |
| 주문 타임라인 | 수직 | 수직 | 수평 |
| Admin 테이블 | 카드 뷰 | 축약 테이블 | 전체 테이블 |
| AI 사이드 패널 | 전체 화면 오버레이 | 우측 1/2 패널 | 우측 1/3 패널 |
| 탭 타겟 | 최소 44x44px | 최소 44x44px | 기본 |
