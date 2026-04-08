terraform {
  required_providers {
    aws = { source = "hashicorp/aws", configuration_aliases = [aws.us_east_1] }
  }
}

variable "environment" { type = string }
variable "project_name" { type = string }
variable "alb_dns_name" { type = string }
variable "assets_bucket" { type = string }
variable "assets_bucket_id" { type = string }

resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "${var.project_name}-${var.environment}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name              = var.assets_bucket
    origin_id                = "s3-assets"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
  }

  origin {
    domain_name = var.alb_dns_name
    origin_id   = "alb"
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/assets/*"
    target_origin_id = "s3-assets"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 86400
    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
  }

  default_cache_behavior {
    target_origin_id       = "alb"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
    forwarded_values {
      query_string = true
      headers      = ["*"]
      cookies { forward = "all" }
    }
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  tags = { Name = "${var.project_name}-${var.environment}-cdn" }
}

output "cloudfront_domain" { value = aws_cloudfront_distribution.main.domain_name }
