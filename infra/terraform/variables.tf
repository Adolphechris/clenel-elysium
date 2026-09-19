variable "project_id" {
  description = "ID du projet Google Cloud Platform ELLYSIUM"
  type        = string
  default     = "elysium-rdc-prod"
}

variable "region" {
  description = "Région GCP primaire (Souveraineté continentale - Doctrine Art. 4)"
  type        = string
  default     = "africa-south1" # Johannesburg
}

variable "secondary_region" {
  description = "Région GCP secondaire de réplication / Edge (Doctrine Art. 4)"
  type        = string
  default     = "europe-west1" # Belgique
}

variable "environment" {
  description = "Environnement de déploiement (dev, staging, prod)"
  type        = string
  default     = "prod"
}
