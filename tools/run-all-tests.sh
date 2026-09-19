#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "========================================================"
echo "🧪 ELLYSIUM PGI — SUITE DE TESTS COMPLÈTE (TOUS MODULES)"
echo "========================================================"

TOTAL_TESTS=0
PACKAGES_COUNT=0

TEST_TARGETS=(
  "packages/academic-engine"
  "packages/report-card-generator"
  "packages/attendance-service"
  "packages/finance-service"
  "packages/student-service"
  "packages/audit-trail"
  "packages/notification-service"
  "packages/scheduling-service"
  "packages/homework-service"
  "packages/ai-tutor"
  "packages/rbac-engine"
  "packages/exam-service"
  "packages/diploma-registry"
  "packages/oer-library"
  "packages/sre-monitoring"
  "apps/pwa-offline"
  "apps/api-gateway"
)

for target in "${TEST_TARGETS[@]}"; do
  echo "▶️  Testing $target..."
  cd "$DIR/$target"
  OUTPUT=$(npm test 2>&1)
  echo "$OUTPUT" | grep -E "(# (tests|pass|fail)|✔|ℹ pass)" || true
  PACKAGES_COUNT=$((PACKAGES_COUNT + 1))
done

cd "$DIR"
echo ""
echo "========================================================"
echo "⚡ EXÉCUTION DU BANC D ESSAI DE CHARGE (Module 281)"
echo "========================================================"
node tools/benchmark-10k.js

echo ""
echo "========================================================"
echo "📜 VÉRIFICATION DU CORPUS CONSTITUTIONNEL (Modules 1-336)"
echo "========================================================"
./tools/verify-corpus.sh

echo ""
echo "========================================================"
echo "🏆 TOUTES LES VALIDATIONS LOGICIELLES SONT PASSÉES AVEC SUCCÈS !"
echo "========================================================"
