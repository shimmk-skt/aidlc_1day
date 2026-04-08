# Infra & DevOps — NFR Design Patterns

## DP-01: Infrastructure as Code 패턴

### 패턴: Modular Terraform
- 리소스 유형별 7개 모듈 분리 (networking, compute, database, cache, storage, cdn, monitoring)
- 모듈 간 output → variable 체이닝으로 의존성 관리
- 환경별 tfvars 파일로 파라미터 차등 적용

### 적용 근거
- 모듈 독립 테스트 가능
- 팀 병렬 작업 가능
- 변경 영향 범위 최소화

---

## DP-02: GitOps 패턴

### 패턴: Git-Driven Infrastructure
- 인프라 변경은 Git commit으로만 추적
- `terraform plan` → 수동 승인 → `terraform apply` 흐름
- 로컬에서 plan 허용, apply는 CI/CD만

### 적용 근거
- 변경 이력 추적 (Git log)
- 승인 프로세스 강제
- 감사 추적 가능

---

## DP-03: Immutable Infrastructure 패턴

### 패턴: Immutable Container Deployment
- Docker 이미지 빌드 → ECR push → ECS 새 task 배포
- 기존 컨테이너 수정 없음, 항상 새 이미지로 교체
- 이미지 태그: `{env}-{git-sha}` (고유 식별)

### 적용 근거
- 환경 일관성 보장
- 롤백 용이 (이전 이미지 태그 지정)
- 구성 드리프트 방지

---

## DP-04: Defense in Depth 패턴

### 패턴: 다층 보안
```
Layer 1: CloudFront (WAF 연동 가능, HTTPS)
Layer 2: ALB (Security Group, HTTPS only)
Layer 3: ECS Tasks (Private Subnet, SG 제한)
Layer 4: RDS/ElastiCache (Private Subnet, SG 제한, 암호화)
Layer 5: Secrets Manager (자격 증명 격리)
```

### 적용 근거
- 단일 레이어 침해시에도 내부 리소스 보호
- SECURITY-01, SECURITY-02, SECURITY-03 준수

---

## DP-05: Observability 패턴

### 패턴: Three Pillars of Observability
- **Metrics**: CloudWatch Metrics + Container Insights (시스템 상태)
- **Logs**: CloudWatch Logs + 구조화된 JSON (이벤트 기록)
- **Traces**: X-Ray (요청 흐름 추적)

### 알람 에스컬레이션
```
CloudWatch Alarm → SNS Topic → 알림 수신
```

### 적용 근거
- 장애 원인 신속 파악
- 성능 병목 식별
- 비용 이상 감지

---

## DP-06: Backup & Recovery 패턴

### 패턴: Automated Backup
- RDS: 자동 백업 7일 보존 + 수동 스냅샷
- S3: 버전 관리 활성화
- Terraform State: S3 버전 관리
- 복구: Terraform 코드로 인프라 재생성 + RDS 스냅샷 복원

### RTO/RPO
| 항목 | RTO | RPO |
|---|---|---|
| 인프라 (Terraform) | ~30분 | 0 (코드 기반) |
| 데이터 (RDS) | ~1시간 | 최대 5분 (자동 백업) |
| 캐시 (Redis) | ~10분 | N/A (캐시 재구축) |

---

## DP-07: Cost Optimization 패턴

### 패턴: Right-Sizing + Tagging
- 환경별 인스턴스 크기 차등 (dev 최소 → prod 적정)
- 필수 태그로 비용 추적 (Cost Explorer)
- ECR lifecycle으로 불필요 이미지 자동 삭제
- NAT Gateway 단일 배치 (비용 최적화)

---

## DP-08: Auto Scaling 패턴

### 패턴: Target Tracking
- CPU 사용률 70% 목표
- Scale-out: 60초 cooldown (빠른 확장)
- Scale-in: 300초 cooldown (안정적 축소)
- prod: min 2 / max 10 tasks
