# Security Test Instructions — 전체 통합 (Unit 1~3)

## 1. 의존성 취약점 스캔
```bash
pnpm audit --audit-level=critical
```

## 2. Terraform IaC 보안 스캔
```bash
# brew install tfsec
cd infra && tfsec .
```

### 확인 항목 (SECURITY Extension)
- [x] SECURITY-01: RDS/Redis/S3 encryption at rest + TLS 강제
- [x] SECURITY-02: ALB access logs → S3, CloudFront logging
- [x] SECURITY-03: ECS → CloudWatch Logs (awslogs driver)

## 3. Docker 이미지 취약점 스캔
```bash
# brew install trivy
trivy image inventrix-api:test
trivy image inventrix-frontend:test
```
- CRITICAL: 0개 필수

## 4. Frontend 보안 검토
- [ ] nginx.conf: X-Content-Type-Options, X-Frame-Options, Referrer-Policy 헤더
- [ ] HTTPS 리다이렉트 (ALB 레벨)
- [ ] API 호출시 JWT 토큰 전달

## 5. Backend 보안 검토
- [ ] Helmet.js 보안 헤더
- [ ] Rate limiting (일반 100req/15min, 인증 10req/15min)
- [ ] express-validator 입력 검증
- [ ] JWT: 15분 access + 7일 refresh + rotation
- [ ] CORS 특정 origin 제한
- [ ] Secrets Manager에서 DB 자격 증명 로드

## 6. IAM 최소 권한 검증
```bash
cd infra
terraform plan -var-file=environments/dev.tfvars -out=tfplan
terraform show -json tfplan | jq '.planned_values.root_module.child_modules[] | select(.address | contains("compute")) | .resources[] | select(.type == "aws_iam_role_policy") | .values.policy'
```
- ECS Task Role: S3, Bedrock, X-Ray, Secrets Manager만
- ECS Execution Role: ECR pull, CloudWatch Logs만
