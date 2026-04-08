output "ecr_api_url" { value = aws_ecr_repository.api.repository_url }
output "ecr_frontend_url" { value = aws_ecr_repository.frontend.repository_url }
output "assets_bucket_domain" { value = aws_s3_bucket.assets.bucket_regional_domain_name }
output "assets_bucket_id" { value = aws_s3_bucket.assets.id }
output "alb_logs_bucket_id" { value = aws_s3_bucket.alb_logs.id }
