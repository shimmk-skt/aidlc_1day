#!/bin/bash
set -e

###############################################################################
# Inventrix — Terraform + ECS 배포 스크립트
#
# 배포 흐름:
#   1. Bootstrap (S3 + DynamoDB for Terraform state)
#   2. Terraform init → plan → apply (인프라 프로비저닝)
#   3. Docker build → ECR push (API + Frontend 이미지)
#   4. DB Migration (ECS run-task)
#   5. ECS 서비스 업데이트 (새 이미지 배포)
#   6. Health check
###############################################################################

REGION="${AWS_REGION:-ap-northeast-2}"
PROJECT="inventrix"
ENV="${1:-dev}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "============================================"
echo "  Inventrix ECS Deploy — env: $ENV"
echo "============================================"
echo ""

# ── AWS Profile 선택 ──
PROFILES=($(aws configure list-profiles 2>/dev/null))
if [[ ${#PROFILES[@]} -gt 0 ]]; then
  echo "Available AWS Profiles:"
  for i in "${!PROFILES[@]}"; do echo "  $((i+1)). ${PROFILES[$i]}"; done
  echo ""
  read -p "Select profile number [1]: " PROFILE_INPUT
  idx=$(( ${PROFILE_INPUT:-1} - 1 ))
  AWS_PROFILE="${PROFILES[$idx]:-${PROFILES[0]}}"
else
  AWS_PROFILE="default"
fi
export AWS_PROFILE
export AWS_REGION="$REGION"
echo "Profile: $AWS_PROFILE | Region: $REGION | Env: $ENV"
echo ""

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_API="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/${PROJECT}-${ENV}-api"
ECR_FE="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/${PROJECT}-${ENV}-frontend"
IMAGE_TAG="${ENV}-$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)"

# ── Step 1: Bootstrap (최초 1회) ──
echo "── Step 1: Bootstrap (Terraform State) ──"
BUCKET="${PROJECT}-terraform-state"
LOCK_TABLE="${PROJECT}-terraform-lock"

if ! aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  echo "Creating S3 bucket: $BUCKET"
  aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" \
    --create-bucket-configuration LocationConstraint="$REGION"
  aws s3api put-bucket-versioning --bucket "$BUCKET" \
    --versioning-configuration Status=Enabled
  aws s3api put-bucket-encryption --bucket "$BUCKET" \
    --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"aws:kms"}}]}'
  aws s3api put-public-access-block --bucket "$BUCKET" \
    --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
else
  echo "S3 bucket exists: $BUCKET ✓"
fi

if ! aws dynamodb describe-table --table-name "$LOCK_TABLE" &>/dev/null; then
  echo "Creating DynamoDB table: $LOCK_TABLE"
  aws dynamodb create-table --table-name "$LOCK_TABLE" \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST
  aws dynamodb wait table-exists --table-name "$LOCK_TABLE"
else
  echo "DynamoDB table exists: $LOCK_TABLE ✓"
fi
echo ""

# ── Step 2: Terraform ──
echo "── Step 2: Terraform (Infrastructure) ──"
cd "$SCRIPT_DIR/infra"

terraform init -reconfigure \
  -backend-config="bucket=$BUCKET" \
  -backend-config="key=env:${ENV}/terraform.tfstate" \
  -backend-config="region=$REGION" \
  -backend-config="dynamodb_table=$LOCK_TABLE"

terraform plan -var-file="environments/${ENV}.tfvars" -out=tfplan
echo ""
read -p "Apply Terraform plan? (yes/no): " TF_CONFIRM
if [[ "$TF_CONFIRM" != "yes" ]]; then
  echo "Terraform apply cancelled."
  exit 0
fi
terraform apply tfplan
rm -f tfplan

# Terraform outputs
ALB_DNS=$(terraform output -raw alb_dns_name)
ECR_API_URL=$(terraform output -raw ecr_api_url)
ECR_FE_URL=$(terraform output -raw ecr_frontend_url)
CF_DOMAIN=$(terraform output -raw cloudfront_domain)
echo ""

# ── Step 3: Docker Build & ECR Push ──
echo "── Step 3: Docker Build & ECR Push ──"
cd "$SCRIPT_DIR"

aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

echo "Building API image..."
pnpm --filter api run build
docker build -t "$ECR_API_URL:$IMAGE_TAG" -f packages/api/Dockerfile .
docker push "$ECR_API_URL:$IMAGE_TAG"
echo "API image pushed: $IMAGE_TAG ✓"

echo "Building Frontend image..."
docker build -t "$ECR_FE_URL:$IMAGE_TAG" -f packages/frontend/Dockerfile .
docker push "$ECR_FE_URL:$IMAGE_TAG"
echo "Frontend image pushed: $IMAGE_TAG ✓"
echo ""

# ── Step 4: DB Migration (ECS run-task) ──
echo "── Step 4: DB Migration ──"
cd "$SCRIPT_DIR/infra"
CLUSTER="${PROJECT}-${ENV}"
TASK_DEF="${PROJECT}-${ENV}-api"
SUBNETS=$(terraform output -json | python3 -c "import sys,json; print(','.join(json.load(sys.stdin).get('private_subnet_ids',{}).get('value',[])))" 2>/dev/null || echo "")

if [[ -n "$SUBNETS" ]]; then
  ECS_SG=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=*${PROJECT}-${ENV}-ecs*" --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || echo "")
  if [[ -n "$ECS_SG" && "$ECS_SG" != "None" ]]; then
    echo "Running migration task..."
    aws ecs run-task \
      --cluster "$CLUSTER" \
      --task-definition "$TASK_DEF" \
      --launch-type FARGATE \
      --network-configuration "awsvpcConfiguration={subnets=[${SUBNETS}],securityGroups=[$ECS_SG]}" \
      --overrides '{"containerOverrides":[{"name":"api","command":["node","dist/config/migrate.js"]}]}' \
      --query 'tasks[0].taskArn' --output text
    echo "Migration task started ✓"
  else
    echo "⚠️  ECS SG not found — skip migration (run manually)"
  fi
else
  echo "⚠️  Subnet info not available — skip migration (run manually)"
fi
echo ""

# ── Step 5: ECS 서비스 업데이트 ──
echo "── Step 5: ECS Service Update ──"
echo "Updating API service..."
aws ecs update-service --cluster "$CLUSTER" --service "${PROJECT}-${ENV}-api" --force-new-deployment --query 'service.serviceName' --output text
echo "Updating Frontend service..."
aws ecs update-service --cluster "$CLUSTER" --service "${PROJECT}-${ENV}-frontend" --force-new-deployment --query 'service.serviceName' --output text

echo "Waiting for services to stabilize..."
aws ecs wait services-stable --cluster "$CLUSTER" --services "${PROJECT}-${ENV}-api" "${PROJECT}-${ENV}-frontend"
echo "ECS services stable ✓"
echo ""

# ── Step 6: Health Check ──
echo "── Step 6: Health Check ──"
for i in {1..5}; do
  STATUS=$(curl -sf "http://${ALB_DNS}/health" 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('status',''))" 2>/dev/null || echo "unreachable")
  if [[ "$STATUS" == "healthy" ]]; then
    echo "Health check passed ✓"
    break
  fi
  echo "Attempt $i/5: $STATUS — retrying in 15s..."
  sleep 15
done
echo ""

# ── 완료 ──
echo "============================================"
echo "  Deployment Complete!"
echo "============================================"
echo "  ALB:        http://$ALB_DNS"
echo "  CloudFront: https://$CF_DOMAIN"
echo "  Image Tag:  $IMAGE_TAG"
echo "  Env:        $ENV"
echo "============================================"
