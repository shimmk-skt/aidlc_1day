output "rds_endpoint" { value = aws_db_instance.main.endpoint }
output "rds_instance_id" { value = aws_db_instance.main.id }
output "db_secret_arn" { value = aws_secretsmanager_secret.db.arn }
output "rds_username" { value = "inventrix" }
output "rds_password" {
  value     = random_password.db.result
  sensitive = true
}
