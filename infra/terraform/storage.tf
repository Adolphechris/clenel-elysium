# Buckets Cloud Storage avec Chiffrement CMEK et Verrouillage WORM (Tome 9 & Module 333)
resource "google_storage_bucket" "diplomas_worm_bucket" {
  name                        = "${var.project_id}-diplomes-archives-${var.environment}"
  location                    = var.region
  storage_class               = "ARCHIVE"
  uniform_bucket_level_access = true

  encryption {
    default_kms_key_name = google_kms_crypto_key.storage_key.id
  }

  # Rétention légale 100 ans pour les diplômes et relevés de notes (Module 333)
  retention_policy {
    is_locked        = false # Passer à true après audit de mise en production définitive
    retention_period = 3153600000 # 100 ans en secondes
  }

  versioning {
    enabled = true
  }
}

resource "google_storage_bucket" "course_assets_bucket" {
  name                        = "${var.project_id}-pedagogie-assets-${var.environment}"
  location                    = var.region
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true

  encryption {
    default_kms_key_name = google_kms_crypto_key.storage_key.id
  }

  cors {
    origin          = ["https://elysium.cd", "https://*.web.app"]
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}
