#!/usr/bin/env bash
# =============================================================================
#  verify-contenus.sh — Contrôleur de la chaîne de production des contenus
#  Projet : ELLYSIUM  ·  Conforme à contenus/00-CADRE-LEGAL-ET-SOURCES.md
#  Créé : 19/09/2026
# -----------------------------------------------------------------------------
#  Vérifie :
#   1. la chaîne N0 → N1 → N2 (source → fiche-matière → syllabus)
#   2. la couverture des savoirs essentiels officiels par les syllabus
#   3. l'absence de contenu non sourcé déclaré comme publié
#   4. la conformité de l'écosystème (Constitution Art. 1 bis : Google uniquement)
#   5. l'absence de données officielles inventées (champs ⚠️)
# =============================================================================

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 2

ERREURS=0
AVERTISSEMENTS=0

rouge()  { printf '\033[0;31m%s\033[0m\n' "$1"; }
vert()   { printf '\033[0;32m%s\033[0m\n' "$1"; }
jaune()  { printf '\033[0;33m%s\033[0m\n' "$1"; }

erreur()       { rouge   "  ✗ ERREUR  : $1"; ERREURS=$((ERREURS+1)); }
avertissement(){ jaune   "  ⚠ ALERTE  : $1"; AVERTISSEMENTS=$((AVERTISSEMENTS+1)); }
ok()           { vert    "  ✓ $1"; }

echo "======================================================================"
echo "  ELLYSIUM — Contrôle de la chaîne de production des contenus"
echo "  $(date '+%d/%m/%Y %H:%M')"
echo "======================================================================"

# -----------------------------------------------------------------------------
# 0. Prérequis
# -----------------------------------------------------------------------------
echo ""
echo "[0] Prérequis"
if [[ ! -d contenus ]]; then
  erreur "Le répertoire contenus/ est absent."
  exit 1
fi
if [[ ! -f contenus/00-CADRE-LEGAL-ET-SOURCES.md ]]; then
  erreur "Le cadre légal contenus/00-CADRE-LEGAL-ET-SOURCES.md est absent."
fi
if [[ ! -f contenus/01-REFERENTIELS/_registre-sources.md ]]; then
  erreur "Le registre des sources est absent."
fi
ok "Arborescence contenus/ présente"

# -----------------------------------------------------------------------------
# 1. Chaîne N1 → N2 : chaque fiche doit avoir son syllabus
# -----------------------------------------------------------------------------
echo ""
echo "[1] Chaîne N1 → N2 (fiche-matière → syllabus)"
for fiche in contenus/02-FICHES-MATIERES/ELL-*.md; do
  [[ -e "$fiche" ]] || continue
  code="$(basename "$fiche" .md)"
  if [[ -f "contenus/03-SYLLABUS/${code}.md" ]]; then
    ok "Chaîne complète : ${code}"
  else
    avertissement "Syllabus manquant pour la fiche ${code} (attendu : contenus/03-SYLLABUS/${code}.md)"
  fi
done

# -----------------------------------------------------------------------------
# 2. Chaîne N2 → N1 : chaque syllabus doit déclarer sa fiche
# -----------------------------------------------------------------------------
echo ""
echo "[2] Chaîne N2 → N1 (syllabus → fiche-matière)"
for syl in contenus/03-SYLLABUS/ELL-*.md; do
  [[ -e "$syl" ]] || continue
  code="$(basename "$syl" .md)"
  if grep -q "02-FICHES-MATIERES/${code}.md" "$syl"; then
    ok "Syllabus ${code} adossé à sa fiche"
  else
    erreur "Le syllabus ${code} ne déclare pas sa fiche-matière (02-FICHES-MATIERES/${code}.md)"
  fi
done

# -----------------------------------------------------------------------------
# 3. Traçabilité : chaque fiche doit citer sa source officielle
# -----------------------------------------------------------------------------
echo ""
echo "[3] Traçabilité des sources officielles"
for fiche in contenus/02-FICHES-MATIERES/ELL-*.md; do
  [[ -e "$fiche" ]] || continue
  code="$(basename "$fiche" .md)"
  if grep -qE 'DIPROMAD|MEPSP|MEPST|MINEDU' "$fiche" && grep -q 'État de la source' "$fiche"; then
    ok "Source officielle déclarée : ${code}"
  else
    erreur "Fiche ${code} : source officielle ou état de source manquant"
  fi
done

# -----------------------------------------------------------------------------
# 4. Couverture : les codes officiels de la fiche doivent apparaître au syllabus
# -----------------------------------------------------------------------------
echo ""
echo "[4] Couverture des savoirs essentiels officiels par les syllabus"
for fiche in contenus/02-FICHES-MATIERES/ELL-*.md; do
  [[ -e "$fiche" ]] || continue
  code="$(basename "$fiche" .md)"
  syl="contenus/03-SYLLABUS/${code}.md"
  [[ -f "$syl" ]] || continue

  # Extraction des codes officiels présents dans la fiche (ex. MM1.1, MSVT1.10, MSPC2.8)
  codes_fiche="$(grep -oE '\b(M[AMSPVT0-9]+[0-9]\.[0-9]+)\b' "$fiche" | sort -u)"
  total=0
  manquants=0
  for c in $codes_fiche; do
    total=$((total+1))
    grep -q "\b${c}\b" "$syl" || manquants=$((manquants+1))
  done
  if [[ $total -eq 0 ]]; then
    avertissement "${code} : aucun code officiel détecté dans la fiche"
  elif [[ $manquants -eq 0 ]]; then
    ok "${code} : ${total}/${total} codes officiels repris au syllabus"
  else
    erreur "${code} : ${manquants} code(s) officiel(s) non repris au syllabus (sur ${total})"
  fi
done

# -----------------------------------------------------------------------------
# 5. Honnêteté : aucun contenu non sourcé déclaré « publié »
# -----------------------------------------------------------------------------
echo ""
echo "[5] Champs non sourcés (⚠️) dans les contenus déclarés publiés"
avertissements_non_sources=0
for f in contenus/02-FICHES-MATIERES/*.md contenus/03-SYLLABUS/*.md; do
  [[ -e "$f" ]] || continue
  nom="$(basename "$f")"
  nb="$(grep -c '⚠️' "$f" || true)"
  if [[ "$nb" -gt 0 ]]; then
    if grep -qiE 'Statut.*\[VALIDÉ\]|Statut.*VALIDÉ' "$f"; then
      erreur "${nom} : déclaré VALIDÉ alors qu'il contient ${nb} champ(s) non sourcé(s) (⚠️)"
    else
      avertissement "${nom} : ${nb} champ(s) en attente de source (⚠️) — statut brouillon, conforme"
      avertissements_non_sources=$((avertissements_non_sources+1))
    fi
  fi
done
[[ $avertissements_non_sources -eq 0 ]] && ok "Aucun champ non sourcé détecté"

# -----------------------------------------------------------------------------
# 6. Conformité doctrinale : écosystème Google uniquement (Constitution Art. 1 bis)
# -----------------------------------------------------------------------------
echo ""
echo "[6] Conformité écosystème Google uniquement (Art. 1 bis)"
forbidden='(AWS|Amazon Web Services|Microsoft Azure|Azure|Oracle Cloud|IBM Cloud|Alibaba Cloud|DigitalOcean|Heroku|OVH|Scaleway|Kubernetes on-premise|Redis\b|MinIO|NATS|K3s|Prometheus|Grafana|Loki|ArgoCD|SonarQube|Vault\b|Ansible|OpenTofu|MongoDB Atlas)'
if grep -rniE "$forbidden" contenus/ 2>/dev/null | grep -viE 'interdit|nulle|non avenue|transposition|doctrine' >/dev/null 2>&1; then
  grep -rniE "$forbidden" contenus/ 2>/dev/null | grep -viE 'interdit|nulle|non avenue|transposition|doctrine' | head -10
  erreur "Mention d'infrastructure non-Google détectée dans les contenus"
else
  ok "Aucune infrastructure non-Google dans les contenus"
fi

# -----------------------------------------------------------------------------
# 7. Chaîne obligatoire : pas de leçon sans syllabus validé
# -----------------------------------------------------------------------------
echo ""
echo "[7] Chaîne N2 → N3 (syllabus → leçons)"
if [[ ! -d contenus/04-LECONS ]]; then
  avertissement "Le répertoire contenus/04-LECONS/ n'existe pas encore (aucune leçon produite — conforme : la Vague 1 attend la validation humaine)"
else
  for lecon in contenus/04-LECONS/*.md; do
    [[ -e "$lecon" ]] || continue
    nom="$(basename "$lecon")"
    if grep -qE 'Syllabus.*03-SYLLABUS/' "$lecon"; then
      ok "Leçon ${nom} adossée à un syllabus"
    else
      erreur "Leçon ${nom} : référence au syllabus manquante"
    fi
  done
fi

# -----------------------------------------------------------------------------
# Bilan
# -----------------------------------------------------------------------------
echo ""
echo "======================================================================"
echo "  BILAN"
echo "======================================================================"
printf "  Fiches-matières (N1) : %s\n" "$(ls -1 contenus/02-FICHES-MATIERES/ELL-*.md 2>/dev/null | wc -l)"
printf "  Syllabus (N2)        : %s\n" "$(ls -1 contenus/03-SYLLABUS/ELL-*.md 2>/dev/null | wc -l)"
printf "  Leçons (N3)          : %s\n" "$(ls -1 contenus/04-LECONS/*.md 2>/dev/null | wc -l)"
printf "  Modèles              : %s\n" "$(ls -1 contenus/_templates/*.md 2>/dev/null | wc -l)"
echo ""
printf "  Erreurs      : %s\n" "$ERREURS"
printf "  Avertissements : %s\n" "$AVERTISSEMENTS"
echo ""

if [[ $ERREURS -gt 0 ]]; then
  rouge "  RÉSULTAT : NON CONFORME — corriger les erreurs avant toute publication."
  exit 1
fi
vert "  RÉSULTAT : CONFORME — chaîne de production des contenus valide."
exit 0
