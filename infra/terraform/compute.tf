# Cloud Run v2 - API Backend du PGI (Go / Node.js)
resource "google_cloud_run_v2_service" "pgi_api" {
  name     = "elysium-pgi-api-${var.environment}"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"

  template {
    scaling {
      min_instance_count = var.environment == "prod" ? 2 : 0
      max_instance_count = 50
    }

    vpc_access {
      connector = google_vpc_access_connector.serverless_connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }

    containers {
      image = "gcr.io/${var.project_id}/pgi-api:latest"

      resources {
        limits = {
          cpu    = "2"
          memory = "2Gi"
        }
      }

      env {
        name  = "NODE_ENV"
        value = var.environment
      }
      env {
        name  = "DB_NAME"
        value = google_sql_database.pgi_database.name
      }
    }
  }
}
