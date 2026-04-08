# Security Test Instructions — Unit 3: Infra & DevOps

## 1. Terraform Security Scan (tfsec)

```bash
# tfsec 설치
# brew install tfsec

cd infra
tfsec .
```

### 확인 항목
- RDS encryption at rest 활성화 (SECURITY-01)
- S3 bucket encryption 활성화 (SECURITY-01)
- ElastiCache encryption 활성화 (SECURITY-01)
- Security Group에 0.0.0.0/0 제한 (ALB만 허용)
- S3 public access block 설정
- CloudWatch log group 보존 기간 설정

## 2. Docker 이미지 취약점 스캔

```bash
# Trivy 설치
# brew install trivy

trivy image inventrix-api:test
trivy image inventrix-frontend:test
```

### 기준
- CRITICAL: 0개 (차단)
- HIGH: 검토 후 판단

## 3. GitHub Actions Workflow 보안 검토

### 확인 항목
- [ ] OIDC 인증 사용 (장기 자격 증명 없음)
- [ ] secrets 참조가 올바른지 확인
- [ ] permissions가 최소 권한으로 설정되었는지 확인
- [ ] 수동 승인 step이 포함되었는지 확인

## 4. IAM 최소 권한 검증

```bash
cd infra
# IAM policy 내용 확인
terraform plan -var-file=environments/dev.tfvars -out=tfplan
terraform show -json tfplan | jq '.planned_values.root_module.child_modules[] | select(.address | contains("compute")) | .resources[] | select(.type == "aws_iam_role_policy") | .values.policy' | jq -r '. | fromjson'
```

### 확인 항목
- ECS Task Role: S3, Bedrock, X-Ray, Secrets Manager만
- ECS Execution Role: ECR pull, CloudWatch Logs만
