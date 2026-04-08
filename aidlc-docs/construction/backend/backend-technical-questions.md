# Backend 기술 결정 확인 질문

Phase 1 코드가 생성되었지만, 다음 Phase 진행 전에 BE 개발자와 확인이 필요한 기술적 결정 사항입니다.

---

## Question 1: DB 마이그레이션 전략
기존 SQLite 데이터를 PostgreSQL로 마이그레이션하는 방식은?

A) Clean start — 시드 데이터만 사용 (기존 운영 데이터 없음, 개발/스테이징 환경)
B) 데이터 마이그레이션 — 기존 SQLite의 실제 데이터를 PostgreSQL로 이관 (pgloader 등 사용)
C) 병행 운영 — 일정 기간 SQLite와 PostgreSQL 동시 운영 후 전환
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2: ORM/Query Builder 사용 여부
현재 raw SQL (pg-pool query)로 구현했는데, ORM 또는 Query Builder 도입 여부는?

A) Raw SQL 유지 — 현재 구현 그대로 (성능 최적, 직접 제어)
B) Prisma 도입 — 타입 안전 ORM, 마이그레이션 관리, 스키마 자동 생성
C) Drizzle ORM — 경량 TypeScript ORM, SQL에 가까운 문법
D) Knex.js — Query Builder만 (ORM 아님, 마이그레이션 지원)
X) Other (please describe after [Answer]: tag below)

[Answer]: X (가장 적합한 방식으로 추천해 줘.)

---

## Question 3: API 응답 형식 표준화
API 응답 형식을 어떻게 표준화할 것인가?

A) 현재 방식 유지 — 성공시 데이터 직접 반환, 에러시 { error: message }
B) Envelope 패턴 — 모든 응답을 { success: boolean, data: ..., error: ... } 형태로 래핑
C) JSON:API 스펙 — 표준 JSON:API 형식 준수
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 4: Toss Payments 테스트 환경
Toss Payments 통합 개발시 테스트 방식은?

A) Toss 테스트 키 사용 — Toss에서 제공하는 테스트 시크릿 키로 샌드박스 환경 사용
B) Mock 서버 — Toss API를 모킹하여 로컬에서 테스트
C) 둘 다 — 단위 테스트는 Mock, 통합 테스트는 Toss 테스트 키
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 5: WebSocket 라이브러리 선택
실시간 통신 구현에 사용할 라이브러리는?

A) ws — 현재 선택. 경량 네이티브 WebSocket (직접 인증/채널 관리 구현 필요)
B) Socket.IO — 자동 재연결, room/namespace, fallback 지원 (더 무겁지만 기능 풍부)
C) SSE (Server-Sent Events) — 서버→클라이언트 단방향만 필요하면 더 간단
X) Other (please describe after [Answer]: tag below)

[Answer]: X ( 적한한 방식으로 추천해 줘. )

---

## Question 6: 배송 캐리어 통합 서비스
멀티 캐리어 배송 API 통합에 사용할 서비스는?

A) EasyPost — 글로벌 캐리어 지원, 한국 캐리어 제한적
B) Shippo — EasyPost와 유사, 가격 경쟁력
C) 직접 통합 — CJ대한통운, 한진택배 등 한국 캐리어 API 직접 연동
D) 스마트택배 API — 한국 택배 통합 조회 서비스
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 7: 로컬 개발 환경
개발자 로컬 환경에서 PostgreSQL과 Redis를 어떻게 실행할 것인가?

A) Docker Compose — docker-compose.yml로 PostgreSQL + Redis 한번에 실행
B) 로컬 설치 — 개발자가 직접 PostgreSQL, Redis 설치
C) 클라우드 개발 DB — 공유 개발용 RDS/ElastiCache 사용
X) Other (please describe after [Answer]: tag below)

[Answer]: X (추천방식으로 할께)

---

## Question 8: 에러 로깅 및 모니터링 서비스
프로덕션 에러 추적에 사용할 서비스는?

A) CloudWatch만 — AWS 네이티브, 추가 비용 최소
B) Sentry — 전용 에러 추적, 스택 트레이스, 알림 (별도 비용)
C) Datadog — APM + 로그 + 메트릭 통합 (비용 높음)
D) CloudWatch + X-Ray — AWS 네이티브 로그 + 분산 트레이싱
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9: API 문서화
API 문서를 어떻게 관리할 것인가?

A) OpenAPI/Swagger — swagger-jsdoc + swagger-ui-express로 자동 생성
B) Postman Collection — Postman으로 API 문서 및 테스트 관리
C) 수동 Markdown — aidlc-docs에 수동 문서화
D) 문서화 불필요 (현재 단계에서)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10: Git 브랜치 전략
3개 unit 병렬 개발시 브랜치 전략은?

A) Git Flow — main/develop/feature/release 브랜치
B) Trunk-based — main 브랜치에 직접 커밋, feature flag 사용
C) GitHub Flow — main + feature 브랜치, PR 기반 머지
D) Unit별 브랜치 — backend/frontend/infra 장기 브랜치 후 통합
X) Other (please describe after [Answer]: tag below)

[Answer]: C
