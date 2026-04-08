output "vpc_id" {
  value = module.networking.vpc_id
}

output "alb_dns_name" {
  value = module.compute.alb_dns_name
}

output "rds_endpoint" {
  value = module.database.rds_endpoint
}

output "redis_endpoint" {
  value = module.cache.redis_endpoint
}

output "ecr_api_url" {
  value = module.storage.ecr_api_url
}

output "ecr_frontend_url" {
  value = module.storage.ecr_frontend_url
}

output "cloudfront_domain" {
  value = module.cdn.cloudfront_domain
}
