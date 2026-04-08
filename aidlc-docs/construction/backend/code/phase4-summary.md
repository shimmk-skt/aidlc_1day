# Phase 4 (Scale & Ecosystem) 코드 요약

## 변경 개요
Event Bus (Microservices 준비), Coupang Marketplace 통합, ERP 어댑터 패턴.
Phase 4의 Microservices 실제 분해(Strangler Fig)와 Notification Service(Lambda)는 Infra Unit과 함께 진행 예정.

## 생성 파일

### 설정 (src/config/)
| 파일 | 목적 |
|---|---|
| event-bus.ts | In-process 이벤트 버스 (CloudEvents 스키마). Phase 4 후반에 SQS/EventBridge로 교체 가능 |

### Service (src/services/)
| 파일 | 목적 |
|---|---|
| marketplace.service.ts | Coupang Wing API 통합 (Mock): 상품 동기화, 주문 수신, 배송 상태 동기화 |
| erp-integration.service.ts | ERP 어댑터 패턴: pluggable 인터페이스, null adapter 기본값 |

### Routes (src/routes/)
| 파일 | 목적 |
|---|---|
| marketplace.ts | POST sync-product, receive-order, sync-shipment |

## 수정 파일
| 파일 | 변경 내용 |
|---|---|
| src/index.ts | marketplace route 등록 |

## API Endpoints 추가 (3개)
| Method | Path | Auth | 기능 |
|---|---|---|---|
| POST | /api/marketplace/sync-product/:productId | Admin | 상품 Coupang 동기화 |
| POST | /api/marketplace/receive-order | Admin | Coupang 주문 수신 |
| POST | /api/marketplace/sync-shipment/:orderId | Admin | 배송 상태 Coupang 동기화 |

## 미구현 (Infra Unit 연계 필요)
- SQS/EventBridge 실제 연동 (현재 in-process event bus)
- Inventory/Order Service 독립 배포 (ECS 서비스 분리)
- Notification Service (Lambda + SES/SNS)
- 모바일 PWA (Frontend Unit)

## 구현된 Stories
US-4.1.1 (Event Bus), US-4.2.1~3 (Coupang), US-4.3.1~2 (ERP 어댑터)
