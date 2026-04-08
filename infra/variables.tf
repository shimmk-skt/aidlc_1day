variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type = string
}

variable "project_name" {
  type    = string
  default = "inventrix"
}

variable "vpc_cidr" {
  type = string
}

variable "ecs_api_cpu" {
  type = number
}

variable "ecs_api_memory" {
  type = number
}

variable "ecs_api_desired_count" {
  type = number
}

variable "ecs_api_min_count" {
  type = number
}

variable "ecs_api_max_count" {
  type = number
}

variable "ecs_fe_cpu" {
  type    = number
  default = 256
}

variable "ecs_fe_memory" {
  type    = number
  default = 512
}

variable "ecs_fe_desired_count" {
  type    = number
  default = 1
}

variable "rds_instance_class" {
  type = string
}

variable "rds_multi_az" {
  type = bool
}

variable "redis_node_type" {
  type = string
}

variable "log_retention_days" {
  type = number
}

variable "owner_tag" {
  type    = string
  default = "team"
}
