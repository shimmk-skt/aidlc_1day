# Build and Test Summary — 전체 통합 (Unit 1~3)

## Build Status

| Unit | 빌드 대상 | 명령어 | 상태 |
|---|---|---|---|
| Unit 1 (Backend) | TypeScript → dist/ | `pnpm --filter api run build` | 실행 대기 |
| Unit 2 (Frontend) | Vite → dist/ | `pnpm --filter frontend run build` | 실행 대기 |
| Unit 3 (Infra) | Terraform validate | `cd infra && terraform validate` | 실행 대기 |
| Docker (API) | node:20-alpine | `docker build packages/api/` | 실행 대기 |
| Docker (Frontend) | nginx:alpine | `docker build packages/frontend/` | 실행 대기 |

## Test Execution Summary

### Unit Tests
| 대상 | 도구 | 상태 |
|---|---|---|
| Backend Services | Jest + Supertest | 실행 대기 |
| Frontend Components | Vitest | 실행 대기 |
| Terraform | fmt + validate | 실행 대기 |
| Dockerfile | Hadolint | 실행 대기 |
| GitHub Actions | actionlint | 실행 대기 |

### Integration Tests (4 시나리오)
| 시나리오 | 상태 |
|---|---|
| Frontend → Backend API 통합 | 실행 대기 |
| Terraform 모듈 간 의존성 | 실행 대기 |
| CI/CD 파이프라인 검증 | 실행 대기 |
| Security Group 규칙 검증 | 실행 대기 |

### Security Tests
| 테스트 | 도구 | 상태 |
|---|---|---|
| 의존성 취약점 | pnpm audit | 실행 대기 |
| IaC 보안 | tfsec | 실행 대기 |
| Docker 이미지 | Trivy | 실행 대기 |
| Frontend 보안 헤더 | 수동 검토 | 실행 대기 |
| Backend 보안 | 수동 검토 | 실행 대기 |
| IAM 최소 권한 | Terraform plan | 실행 대기 |

### Performance Tests
| 테스트 | 도구 | 목표 | 상태 |
|---|---|---|---|
| API 부하 | k6 | p95 < 200ms | 실행 대기 |
| Frontend 성능 | Lighthouse | Score > 90 | 실행 대기 |

## 생성된 파일
1. ✅ build-instructions.md
2. ✅ unit-test-instructions.md
3. ✅ integration-test-instructions.md
4. ✅ security-test-instructions.md
5. ✅ performance-test-instructions.md
6. ✅ build-and-test-summary.md

## 실행 순서
1. `pnpm install` → `pnpm --filter api run build` → `pnpm --filter frontend run build`
2. `pnpm --filter api run test` → `pnpm --filter frontend run test`
3. `cd infra && terraform validate && terraform fmt -check`
4. Docker build (API + Frontend)
5. `docker compose up` → 통합 테스트
6. 보안 스캔 (pnpm audit, tfsec, trivy)
7. 성능 테스트 (k6, Lighthouse)

## Next Steps
- 모든 테스트 통과 후 → Operations Phase (배포 계획)
