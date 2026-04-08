# Story-Unit Mapping

## Unit 1: Backend (BE) — 32 stories

| Story ID | Story 제목 | Phase |
|---|---|---|
| US-1.1.1 | PostgreSQL 스키마 생성 | 1 |
| US-1.1.2 | Connection Pooling 구성 | 1 |
| US-1.1.3 | 시드 데이터 마이그레이션 | 1 |
| US-1.1.4 | Atomic Inventory Reservation | 1 |
| US-1.2.1 | 보안 헤더 적용 | 1 |
| US-1.2.2 | Rate Limiting 적용 | 1 |
| US-1.2.3 | 입력 검증 | 1 |
| US-1.2.4 | JWT 개선 | 1 |
| US-1.2.5 | 비밀번호 정책 | 1 |
| US-1.2.6 | 서비스 레이어 도입 | 1 |
| US-1.3.1 | Redis 연결 설정 | 1 |
| US-1.3.2 | 재고 데이터 캐싱 | 1 |
| US-1.3.3 | 세션 저장소 | 1 |
| US-2.1.1 | WebSocket 서버 설정 | 2 |
| US-2.1.2 | 실시간 재고 업데이트 브로드캐스트 | 2 |
| US-2.3.1 | 확장된 주문 상태 머신 | 2 |
| US-2.3.2 | 취소/보류/백오더 Flow | 2 |
| US-2.3.3 | 반품 상태 Flow | 2 |
| US-2.3.4 | 상태 변경 실시간 알림 | 2 |
| US-2.4.1 | Toss Payments SDK 통합 (server) | 2 |
| US-2.4.2 | 결제 승인 API | 2 |
| US-2.4.3 | 결제 취소/환불 | 2 |
| US-2.4.4 | Webhook 수신 | 2 |
| US-2.5.1 | 멀티 캐리어 배송비 조회 | 2 |
| US-2.5.2 | 배송 라벨 생성 | 2 |
| US-2.5.3 | 배송 추적 Webhook | 2 |
| US-3.1.1 | 재고 Q&A | 3 |
| US-3.1.2 | 수요 내러티브 생성 | 3 |
| US-3.1.3 | 상품 설명 자동 생성 | 3 |
| US-3.2.1 | 통계 기반 수요 예측 | 3 |
| US-3.2.2 | 동적 재주문 포인트 | 3 |
| US-3.2.3 | 재주문 알림 | 3 |
| US-3.3.1 | 함께 구매한 상품 | 3 |
| US-3.3.2 | 개인화 추천 | 3 |
| US-4.1.1 | Event Bus 도입 | 4 |
| US-4.1.2 | Inventory Service 추출 | 4 |
| US-4.1.3 | Order Service 추출 | 4 |
| US-4.1.4 | Notification Service | 4 |
| US-4.2.1 | 상품 동기화 (Coupang) | 4 |
| US-4.2.2 | 주문 수신 (Coupang) | 4 |
| US-4.2.3 | 배송 상태 동기화 (Coupang) | 4 |
| US-4.3.1 | 플러그인 통합 레이어 | 4 |
| US-4.3.2 | 재무 데이터 동기화 | 4 |
| US-N.1.1 | 구조화된 로깅 | NFR |
| US-N.1.2 | 헬스체크 Endpoint | NFR |
| US-N.1.3 | 글로벌 에러 핸들러 | NFR |

## Unit 2: Frontend (FE) — 14 stories

| Story ID | Story 제목 | Phase |
|---|---|---|
| US-2.1.3 | 재고 KPI Dashboard | 2 |
| US-2.1.4 | Admin Dashboard 실시간 주문 피드 | 2 |
| US-2.2.1 | 주문 내역 확장 | 2 |
| US-2.2.2 | 실시간 배송 추적 | 2 |
| US-2.2.3 | 반품 신청 | 2 |
| US-2.2.4 | 주소록 관리 | 2 |
| US-2.2.5 | 원클릭 재주문 | 2 |
| US-2.4.1 | Toss Payments SDK 통합 (client) | 2 |
| US-4.4.1 | 바코드 스캐닝 (PWA) | 4 |
| US-4.4.2 | 오프라인 지원 (PWA) | 4 |
| US-N.2.1 | Tailwind CSS 도입 | NFR |
| US-N.2.2 | 모바일 반응형 Admin Dashboard | NFR |

## Unit 3: Infra & DevOps — 2 stories

| Story ID | Story 제목 | Phase |
|---|---|---|
| US-N.3.1 | Terraform IaC | NFR |
| US-N.3.2 | ECS Fargate 배포 | NFR |
| US-N.3.3 | CI/CD 파이프라인 | NFR |

## 검증
- **총 story 수**: 44 (BE: 32 + FE: 14 + Infra: 3) = 49 (일부 story가 BE/FE 양쪽에 매핑 — US-2.4.1 Toss Payments는 server+client 양쪽)
- **미할당 story**: 없음
- **순환 의존성**: 없음 (FE→BE→INFRA 단방향)
