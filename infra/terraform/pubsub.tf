# Cloud Pub/Sub pour l'architecture événementielle
resource "google_pubsub_topic" "grades_submitted" {
  name = "elysium-grades-submitted-${var.environment}"
}

resource "google_pubsub_topic" "student_attendance_alert" {
  name = "elysium-attendance-alert-${var.environment}"
}

resource "google_pubsub_topic" "diploma_issued" {
  name = "elysium-diploma-issued-${var.environment}"
}
