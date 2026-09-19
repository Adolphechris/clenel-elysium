# Cloud SQL PostgreSQL 16 Haute Disponibilité (Doctrine & Tome 8/13)
resource "google_sql_database_instance" "elysium_postgres" {
  name             = "elysium-postgres-${var.environment}"
  database_version = "POSTGRES_16"
  region           = var.region

  encryption_key_name = google_kms_crypto_key.database_key.id

  settings {
    tier              = "db-custom-4-16384" # 4 vCPU, 16 Go RAM
    availability_type = "REGIONAL"          # Haute Disponibilité multi-zones

    disk_size       = 100
    disk_type       = "PD_SSD"
    disk_autoresize = true

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
      start_time                     = "01:00"
      transaction_log_retention_days = 7
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.elysium_vpc.id
      require_ssl     = true
    }

    insights_config {
      query_insights_enabled  = true
      query_string_length     = 1024
      record_application_tags = true
    }
  }

  deletion_protection = var.environment == "prod" ? true : false
}

resource "google_sql_database" "pgi_database" {
  name     = "elysium_pgi"
  instance = google_sql_database_instance.elysium_postgres.name
}
