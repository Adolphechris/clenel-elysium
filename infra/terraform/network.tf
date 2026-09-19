# VPC Network et Connecteur Serverless
resource "google_compute_network" "elysium_vpc" {
  name                    = "elysium-vpc-${var.environment}"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "elysium_subnet" {
  name          = "elysium-subnet-${var.region}"
  ip_cidr_range = "10.0.0.0/20"
  region        = var.region
  network       = google_compute_network.elysium_vpc.id
}

resource "google_vpc_access_connector" "serverless_connector" {
  name          = "elysium-vpc-cx-${var.environment}"
  region        = var.region
  ip_cidr_range = "10.8.0.0/28"
  network       = google_compute_network.elysium_vpc.name
}

# Cloud Armor - Règle de protection WAF / Anti-DDoS
resource "google_compute_security_policy" "cloud_armor_waf" {
  name        = "elysium-cloud-armor-${var.environment}"
  description = "Politique Cloud Armor WAF pour ELLYSIUM (Protection OWASP Top 10)"

  rule {
    action   = "allow"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Default allow"
  }

  rule {
    action   = "deny(403)"
    priority = "1000"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('sqli-v33-stable')"
      }
    }
    description = "Bloquer les injections SQL"
  }

  rule {
    action   = "deny(403)"
    priority = "1001"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('xss-v33-stable')"
      }
    }
    description = "Bloquer les attaques XSS"
  }
}
