# Phase 2 (Core Features) 코드 요약

## 변경 개요
Socket.IO 실시간 통신, Toss Payments 결제, 스마트택배 배송, 반품/환불, 주소록, JSON:API 응답 통일.

## 생성 파일

### 설정 (src/config/)
| 파일 | 목적 |
|---|---|
| socket.ts | Socket.IO 초기화, JWT 인증, room 관리 (admin/user:{id}), broadcast 함수 |

### Repository (src/repositories/)
| 파일 | 목적 |
|---|---|
| payment.repository.ts | 결제 CRUD |
| return.repository.ts | 반품 CRUD |
| shipment.repository.ts | 배송 CRUD |

### Service (src/services/)
| 파일 | 목적 |
|---|---|
| payment.service.ts | Toss Payments 결제 승인/취소/환불 (mock 지원) |
| shipping.service.ts | 스마트택배 배송비 조회/배송 생성/추적 |
| return.service.ts | 반품 신청/수신/환불 (재고 복원 포함) |
| address.service.ts | 주소록 CRUD |

### Routes (src/routes/)
| 파일 | 목적 |
|---|---|
| payments.ts | 결제 확인/취소 API |
| shipping.ts | 배송비/배송생성/추적/webhook API |
| returns.ts | 반품 신청/수신 API |
| addresses.ts | 주소록 CRUD API |

### 유틸리티 (src/utils/)
| 파일 | 목적 |
|---|---|
| json-api.ts | JSON:API 응답 헬퍼 (jsonApiSuccess, jsonApiList, jsonApiError) |

### 기타
| 파일 | 목적 |
|---|---|
| docker-compose.yml | PostgreSQL 16 + Redis 7 로컬 개발 환경 |

## 수정 파일
| 파일 | 변경 내용 |
|---|---|
| package.json | socket.io, @prisma/client, swagger 의존성 추가 |
| src/index.ts | HTTP server 분리, Socket.IO 초기화, Phase 2 routes 등록 |
| src/routes/auth.ts | JSON:API 응답 형식 적용 |
| src/routes/products.ts | JSON:API 응답 형식 적용 |
| src/routes/orders.ts | JSON:API 응답 형식 적용 |
| src/routes/analytics.ts | JSON:API 응답 형식 적용 |
| src/services/order.service.ts | Socket.IO broadcast 추가, admin 세부 역할 권한 체크 |

## 구현된 Stories
US-2.1.1~2, US-2.2.3~4, US-2.3.1~4, US-2.4.1~4, US-2.5.1~3 (14개)
