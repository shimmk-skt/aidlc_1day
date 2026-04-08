variable "environment" { type = string }
variable "project_name" { type = string }
variable "instance_class" { type = string }
variable "multi_az" { type = bool }
variable "subnet_ids" { type = list(string) }
variable "security_group_id" { type = string }
