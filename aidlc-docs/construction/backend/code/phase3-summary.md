# Phase 3 (Intelligence) 코드 요약

## 변경 개요
Bedrock Claude AI 기능 (재고 Q&A, 수요 내러티브, 상품 설명), 통계 기반 수요 예측, 상품 추천.

## 생성 파일

### Service (src/services/)
| 파일 | 목적 |
|---|---|
| ai.service.ts | Bedrock Claude 통합: 재고 Q&A, 수요 내러티브 생성, 상품 설명 자동 생성 |
| forecast.service.ts | 이동 평균 수요 예측 (90일 데이터, 14일 예측), ROP/안전재고 계산, 재주문 제안 |
| recommendation.service.ts | 함께 구매한 상품 (연관 규칙 SQL), 개인화 추천 (카테고리 기반) |

### Routes (src/routes/)
| 파일 | 목적 |
|---|---|
| ai.ts | POST /api/ai/inventory-qa, demand-narrative, generate-description |
| forecast.ts | GET /api/forecast/:productId, /api/forecast/suggestions |
| recommendations.ts | GET /api/recommendations/personalized, /:productId/bought-together |

## 수정 파일
| 파일 | 변경 내용 |
|---|---|
| src/index.ts | Phase 3 routes 등록 (ai, forecast, recommendations) |

## API Endpoints 추가 (7개)
| Method | Path | Auth | 기능 |
|---|---|---|---|
| POST | /api/ai/inventory-qa | Admin | 재고 Q&A (Claude) |
| POST | /api/ai/demand-narrative | Admin | 수요 내러티브 생성 |
| POST | /api/ai/generate-description | Admin | 상품 설명 자동 생성 |
| GET | /api/forecast/:productId | Admin | SKU별 수요 예측 |
| GET | /api/forecast/suggestions | Admin | 재주문 제안 목록 |
| GET | /api/recommendations/personalized | Customer | 개인화 추천 |
| GET | /api/recommendations/:productId/bought-together | Public | 함께 구매한 상품 |

## 구현된 Stories
US-3.1.1~3, US-3.2.1~3, US-3.3.1~2 (8개)
