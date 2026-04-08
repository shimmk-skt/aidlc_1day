# Component Inventory

## Application Packages
- **packages/api** - Node.js + Express REST API 서버 (비즈니스 로직, 데이터 접근, AI 이미지 생성)
- **packages/frontend** - React 18 + TypeScript SPA (고객/관리자 UI)

## Infrastructure Packages
- 없음 (CDK, Terraform, CloudFormation 미사용)
- `deploy.sh` - Bash 기반 AWS 배포 스크립트 (IaC 아님)
- `destroy.sh` - AWS 리소스 정리 스크립트

## Shared Packages
- 없음 (공유 모델, 유틸리티, 클라이언트 패키지 미존재)

## Test Packages
- 없음 (단위 테스트, 통합 테스트, E2E 테스트 미구성)

## Total Count
- **Total Packages**: 2
- **Application**: 2 (api, frontend)
- **Infrastructure**: 0
- **Shared**: 0
- **Test**: 0
