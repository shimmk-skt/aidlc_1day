module "networking" {
  source       = "./modules/networking"
  environment  = var.environment
  project_name = var.project_name
  vpc_cidr     = var.vpc_cidr
  aws_region   = var.aws_region
}

module "database" {
  source           = "./modules/database"
  environment      = var.environment
  project_name     = var.project_name
  instance_class   = var.rds_instance_class
  multi_az         = var.rds_multi_az
  subnet_ids       = module.networking.private_subnet_ids
  security_group_id = module.networking.rds_sg_id
}

module "cache" {
  source            = "./modules/cache"
  environment       = var.environment
  project_name      = var.project_name
  node_type         = var.redis_node_type
  subnet_ids        = module.networking.private_subnet_ids
  security_group_id = module.networking.redis_sg_id
}

module "storage" {
  source       = "./modules/storage"
  environment  = var.environment
  project_name = var.project_name
  aws_region   = var.aws_region
}

module "compute" {
  source              = "./modules/compute"
  environment         = var.environment
  project_name        = var.project_name
  vpc_id              = module.networking.vpc_id
  public_subnet_ids   = module.networking.public_subnet_ids
  private_subnet_ids  = module.networking.private_subnet_ids
  alb_sg_id           = module.networking.alb_sg_id
  ecs_sg_id           = module.networking.ecs_sg_id
  api_cpu             = var.ecs_api_cpu
  api_memory          = var.ecs_api_memory
  api_desired_count   = var.ecs_api_desired_count
  api_min_count       = var.ecs_api_min_count
  api_max_count       = var.ecs_api_max_count
  fe_cpu              = var.ecs_fe_cpu
  fe_memory           = var.ecs_fe_memory
  fe_desired_count    = var.ecs_fe_desired_count
  ecr_api_url         = module.storage.ecr_api_url
  ecr_frontend_url    = module.storage.ecr_frontend_url
  rds_endpoint        = module.database.rds_endpoint
  redis_endpoint      = module.cache.redis_endpoint
  db_secret_arn       = module.database.db_secret_arn
  log_retention_days  = var.log_retention_days
  aws_region          = var.aws_region
}

module "cdn" {
  source            = "./modules/cdn"
  environment       = var.environment
  project_name      = var.project_name
  alb_dns_name      = module.compute.alb_dns_name
  assets_bucket     = module.storage.assets_bucket_domain
  assets_bucket_id  = module.storage.assets_bucket_id

  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }
}

module "monitoring" {
  source             = "./modules/monitoring"
  environment        = var.environment
  project_name       = var.project_name
  ecs_cluster_name   = module.compute.ecs_cluster_name
  ecs_api_service    = module.compute.ecs_api_service_name
  ecs_fe_service     = module.compute.ecs_fe_service_name
  alb_arn_suffix     = module.compute.alb_arn_suffix
  rds_instance_id    = module.database.rds_instance_id
  redis_cluster_id   = module.cache.redis_cluster_id
  log_retention_days = var.log_retention_days
}
