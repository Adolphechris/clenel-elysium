# Cloud KMS pour le Chiffrement Souverain CMEK (Doctrine Art. 4 bis & Tome 9)
resource "google_kms_key_ring" "elysium_keyring" {
  name     = "elysium-keyring-${var.environment}"
  location = var.region
}

resource "google_kms_crypto_key" "storage_key" {
  name            = "elysium-storage-key"
  key_ring        = google_kms_key_ring.elysium_keyring.id
  rotation_period = "7776000s" # 90 jours

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_kms_crypto_key" "database_key" {
  name            = "elysium-database-key"
  key_ring        = google_kms_key_ring.elysium_keyring.id
  rotation_period = "7776000s"

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_kms_crypto_key" "diploma_seal_key" {
  name            = "elysium-diploma-seal-key"
  key_ring        = google_kms_key_ring.elysium_keyring.id
  purpose         = "ASYMMETRIC_SIGN"

  version_template {
    algorithm        = "EC_SIGN_P256_SHA256"
    protection_level = "HSM"
  }

  lifecycle {
    prevent_destroy = true
  }
}

# Secret Manager pour les identifiants et passerelles tierces (Mobile Money)
resource "google_secret_manager_secret" "database_password" {
  secret_id = "elysium-db-password-${var.environment}"
  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}

resource "google_secret_manager_secret" "mobile_money_api_keys" {
  secret_id = "elysium-mobile-money-keys-${var.environment}"
  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
