variable "environment" { type = string }
variable "project_name" { type = string }
variable "vpc_id" { type = string }
variable "public_subnet_ids" { type = list(string) }
variable "private_subnet_ids" { type = list(string) }
variable "alb_sg_id" { type = string }
variable "ecs_sg_id" { type = string }
variable "api_cpu" { type = number }
variable "api_memory" { type = number }
variable "api_desired_count" { type = number }
variable "api_min_count" { type = number }
variable "api_max_count" { type = number }
variable "fe_cpu" { type = number }
variable "fe_memory" { type = number }
variable "fe_desired_count" { type = number }
variable "ecr_api_url" { type = string }
variable "ecr_frontend_url" { type = string }
variable "rds_endpoint" { type = string }
variable "redis_endpoint" { type = string }
variable "db_secret_arn" { type = string }
variable "log_retention_days" { type = number }
variable "aws_region" { type = string }
variable "rds_username" { type = string }
variable "rds_password" {
  type      = string
  sensitive = true
}
