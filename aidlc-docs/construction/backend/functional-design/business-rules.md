# Business Rules — Backend Unit

## BR-01: 재고 예약 (Atomic Reservation)
- 주문 생성시 `UPDATE products SET reserved_qty = reserved_qty + :qty WHERE id = :id AND (stock - reserved_qty) >= :qty`
- 0 rows affected → 재고 부족 에러 (400)
- 주문 취소/반품시 `reserved_qty` 감소 및 `stock` 복원

## BR-02: GST 계산
- GST = subtotal × 0.10 (10%)
- total = subtotal + GST
- 소수점 2자리 반올림

## BR-03: 주문 상태 전환 (State Machine)
유효한 전환만 허용:
| From | Allowed To |
|---|---|
| pending | confirmed, cancelled |
| confirmed | processing, on_hold, cancelled |
| on_hold | confirmed, cancelled |
| processing | picked, backordered, cancelled |
| backordered | processing, cancelled |
| picked | packed |
| packed | shipped |
| shipped | delivered |
| delivered | return_initiated |
| return_initiated | return_received |
| return_received | refunded, exchanged |

무효한 전환 시도 → 400 에러

## BR-04: 주문 취소 규칙
- `pending`, `confirmed` 상태에서만 고객이 직접 취소 가능
- `processing` 이후는 Admin만 취소 가능
- 취소시: reserved_qty 감소, 결제 완료 상태면 환불 처리

## BR-05: 비밀번호 정책
- 최소 8자
- 영문 + 숫자 조합 필수
- 정규식: `/^(?=.*[A-Za-z])(?=.*\d).{8,}$/`

## BR-06: JWT 토큰 관리
- Access token: 15분 만료
- Refresh token: 7일 만료, DB(Redis)에 hash 저장
- Refresh 시 기존 토큰 폐기 + 새 토큰 발급 (rotation)
- 로그아웃시 refresh token 폐기

## BR-07: Rate Limiting
- 일반 API: 100 requests / 15분 / IP
- 인증 API (/api/auth/*): 10 requests / 15분 / IP
- 초과시 429 Too Many Requests

## BR-08: 결제 Flow (Toss Payments)
1. 주문 생성 → status: pending
2. 클라이언트에서 Toss 결제 위젯 호출
3. 결제 성공 → POST /api/payments/confirm (paymentKey, orderId, amount)
4. 서버에서 Toss 승인 API 호출 → 성공시 order status: confirmed
5. 결제 실패 → order status 유지 (pending), 재시도 가능

## BR-09: 배송 Flow
1. 주문 status: packed → Admin이 캐리어 선택 + 라벨 생성
2. 라벨 생성시 → order status: shipped, tracking_number 저장
3. 캐리어 webhook → shipment status 업데이트
4. delivered webhook → order status: delivered

## BR-10: 반품 Flow
1. 고객이 반품 신청 (delivered 상태에서만)
2. 반품 사유 선택 필수 (defective, wrong_item, changed_mind, other)
3. 반품 라벨 자동 생성 (ShippingService)
4. 반품 수신 → 상태 검수
5. 환불 처리 (PaymentService.refund)

## BR-11: 재주문 규칙
- 기존 주문의 모든 항목을 새 주문으로 복사
- 각 항목의 현재 재고 확인 (재고 부족 항목은 제외하고 알림)
- 현재 가격 적용 (주문 당시 가격이 아님)

## BR-12: 수요 예측 (통계 기반)
- 최근 90일 주문 데이터 기반 이동 평균
- 예측 기간: 14일
- ROP = (일평균 수요 × 리드타임) + (Z × σ × √리드타임)
- 기본 서비스 레벨: 95% (Z = 1.65)
- 기본 리드타임: 7일 (설정 가능)

## BR-13: 상품 추천
- 함께 구매한 상품: 동일 주문에 포함된 상품 빈도 기반 (최소 2회 이상)
- 개인화 추천: 사용자 주문 이력의 상품과 동일 카테고리 인기 상품

## BR-14: 재고 캐시 정책
- Redis TTL: 30초
- 재고 변경시 (주문, 취소, 반품, 수동 조정) 즉시 캐시 무효화
- 캐시 miss → DB 조회 → 캐시 저장

## BR-15: WebSocket 인증
- 연결시 JWT access token 검증 (query param 또는 첫 메시지)
- 토큰 만료시 연결 종료
- Admin 전용 채널과 Customer 전용 채널 분리

## BR-16: Coupang Marketplace 동기화 (Phase 4)
- 상품 동기화: Inventrix → Coupang (가격, 재고, 상품 정보)
- 주문 수신: Coupang → Inventrix (Coupang 주문을 Inventrix 주문으로 변환)
- 배송 동기화: Inventrix → Coupang (송장 번호, 배송 상태)

## BR-17: 입력 검증 규칙
| Field | Rule |
|---|---|
| email | 유효한 이메일 형식, 최대 255자 |
| name | 최소 1자, 최대 100자, trim |
| password | BR-05 참조 |
| price | 양수, 최대 소수점 2자리 |
| stock | 0 이상 정수 |
| quantity | 1 이상 정수, 최대 1000 |
| status | 허용된 ENUM 값만 |
| address fields | 각 필드 최대 255자 |
