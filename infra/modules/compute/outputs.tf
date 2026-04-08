output "alb_dns_name" { value = aws_lb.main.dns_name }
output "alb_arn_suffix" { value = aws_lb.main.arn_suffix }
output "ecs_cluster_name" { value = aws_ecs_cluster.main.name }
output "ecs_api_service_name" { value = aws_ecs_service.api.name }
output "ecs_fe_service_name" { value = aws_ecs_service.frontend.name }
