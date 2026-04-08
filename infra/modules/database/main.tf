resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-db-subnet"
  subnet_ids = var.subnet_ids

  tags = { Name = "${var.project_name}-${var.environment}-db-subnet" }
}

resource "aws_db_parameter_group" "main" {
  name_prefix = "${var.project_name}-${var.environment}-pg15-"
  family      = "postgres15"

  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }

  lifecycle { create_before_destroy = true }
}

resource "random_password" "db" {
  length  = 32
  special = false
}

resource "aws_secretsmanager_secret" "db" {
  name = "${var.project_name}-${var.environment}-db-credentials"
}

resource "aws_secretsmanager_secret_version" "db" {
  secret_id = aws_secretsmanager_secret.db.id
  secret_string = jsonencode({
    username = "inventrix"
    password = random_password.db.result
    host     = aws_db_instance.main.address
    port     = 5432
    dbname   = "inventrix"
  })
}

resource "aws_db_instance" "main" {
  identifier     = "${var.project_name}-${var.environment}"
  engine         = "postgres"
  engine_version = "15"
  instance_class = var.instance_class
  allocated_storage     = 20
  max_allocated_storage = 100

  db_name  = "inventrix"
  username = "inventrix"
  password = random_password.db.result

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.security_group_id]
  parameter_group_name   = aws_db_parameter_group.main.name

  multi_az            = var.multi_az
  storage_encrypted   = true
  skip_final_snapshot = var.environment != "prod"
  final_snapshot_identifier = var.environment == "prod" ? "${var.project_name}-${var.environment}-final" : null

  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"

  tags = { Name = "${var.project_name}-${var.environment}-rds" }
}
