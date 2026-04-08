terraform {
  required_version = ">= 1.5"

  backend "s3" {
    bucket         = "inventrix-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "inventrix-terraform-lock"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
