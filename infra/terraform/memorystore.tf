# Google Cloud Memorystore pour Redis (Cache de session & rate-limiting)
resource "google_redis_instance" "session_cache" {
  name               = "elysium-redis-${var.environment}"
  tier               = var.environment == "prod" ? "STANDARD_HA" : "BASIC"
  memory_size_gb     = 2
  region             = var.region
  authorized_network = google_compute_network.elysium_vpc.id

  redis_version     = "REDIS_7_0"
  display_name      = "ELLYSIUM Redis Cache"
  transit_encryption_mode = "SERVER_AUTHENTICATION"
}
