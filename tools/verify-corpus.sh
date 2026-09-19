#!/usr/bin/env bash
# =============================================================================
# verify-corpus.sh — Contrôle automatique du Master Corpus ELLYSIUM
# Conformité Fondations 04 (Canon des verrous) et Doctrine d'Infrastructure
# (Article 1 bis : Google et Google uniquement).
# Usage : ./tools/verify-corpus.sh   (exécuter avant toute publication)
# =============================================================================
set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

ERR=0

echo "════════════════════════════════════════════════════"
echo " VÉRIFICATION DU MASTER CORPUS ELLYSIUM"
echo "════════════════════════════════════════════════════"

# --- 1. Complétude des modules 55..336 (un dossier, un README) -------------
MISSING=0
for i in $(seq 55 336); do
  if [ ! -f "$(find tome-* -maxdepth 2 -type d -name "$i" 2>/dev/null | head -1)/README.md" ]; then
    echo "  ✗ Module $i manquant ou sans README"; MISSING=$((MISSING+1))
  fi
done
if [ "$MISSING" -eq 0 ]; then
  echo "  ✓ 282/282 modules (55–336) présents avec README"
else
  echo "  ✗ $MISSING module(s) manquant(s)"; ERR=1
fi

# --- 2. Canon des verrous VF (min 5 par module) ------------------------------
UNDER=0
for d in tome-*/[0-9]*/; do
  case "$(basename "$d")" in ''|*[!0-9]*) continue;; esac
  n=$(grep -ohE 'VF-[0-9]{3}-[0-9]{2}' "$d/README.md" 2>/dev/null | sort -u | wc -l)
  if [ "$n" -lt 5 ]; then echo "  ✗ $d : seulement $n verrou(s) VF"; UNDER=$((UNDER+1)); fi
done
if [ "$UNDER" -eq 0 ]; then
  echo "  ✓ Canon des verrous respecté (min 5 par module)"
else
  echo "  ✗ $UNDER module(s) sous le canon de 5 verrous"; ERR=1
fi

# --- 3. Liens internes ./N/README.md -----------------------------------------
BROKEN=$(python3 - <<'PY'
import re, pathlib, glob, os
root = os.getcwd(); broken = 0
for f in glob.glob('tome-*/README.md') + glob.glob('tome-*/[0-9]*/README.md'):
    p = pathlib.Path(f); text = p.read_text(encoding='utf-8')
    for m in re.findall(r'\]\((?:\./)?([0-9]+/README\.md)\)', text):
        if not (p.parent / m).exists(): broken += 1; print(f"  ✗ {f} -> {m}", file=os.sys.stderr)
print(broken)
PY
)
if [ "$BROKEN" -eq 0 ]; then
  echo "  ✓ Liens internes de modules tous valides"
else
  echo "  ✗ $BROKEN lien(s) cassé(s)"; ERR=1
fi

# --- 4. Écosystème Google exclusif (Doctrine Art. 1 bis) ----------------------
# Mentions d'infrastructure tierce interdites HORS contextes légitimes
# (listes d'interdiction de la Doctrine, négations explicites).
VIOL=$(grep -rniE '\bredis\b|\bminio\b|\bnats\b|\bk3s\b|\bprometheus\b|\bgrafana\b|\bloki\b|\bargocd\b|\bsonarqube\b|\bopentofu\b|\bansible\b|\bkeycloak\b|\bjitsi\b|\bhashicorp\b' \
      tome-[5-9] tome-1[0-9] README.md foundations \
      --include='*.md' 2>/dev/null \
   | grep -viE 'n.?utilise aucun|réputée nulle|self-hosted \(remplacé|MicroK8s|remplacé par|est nulle|formellement bannie|est formellement bannie' \
   | wc -l)
if [ "$VIOL" -eq 0 ]; then
  echo "  ✓ Écosystème : aucune infrastructure non-Google référencée"
else
  echo "  ✗ $VIOL mention(s) d'infrastructure non-Google à transposer :"
  grep -rniE '\bredis\b|\bminio\b|\bnats\b|\bk3s\b|\bprometheus\b|\bgrafana\b|\bloki\b|\bargocd\b|\bsonarqube\b|\bopentofu\b|\bansible\b|\bkeycloak\b|\bjitsi\b|\bhashicorp\b' \
      tome-[5-9] tome-1[0-9] README.md foundations --include='*.md' 2>/dev/null \
   | grep -viE 'n.?utilise aucun|réputée nulle|self-hosted \(remplacé|MicroK8s|remplacé par|est nulle|formellement bannie' \
   | head -10
  ERR=1
fi

# --- 4 bis. Liens internes des landing pages (Firebase Hosting) ---------------
HTML_BROKEN=$(python3 - <<'PY'
import re, pathlib, glob, os
broken = 0
for f in glob.glob('apps/web-portal/dist/*.html'):
    p = pathlib.Path(f)
    for m in re.findall(r'href="([^"#?]+)"', p.read_text(encoding='utf-8')):
        if m.startswith(('http', 'mailto', 'data:')) or m.endswith('.css'):
            continue
        if not (p.parent / m).exists():
            broken += 1; print(f"  ✗ {f} -> {m}", file=os.sys.stderr)
print(broken)
PY
)
if [ "$HTML_BROKEN" -eq 0 ]; then
  echo "  ✓ Liens internes des landing pages tous valides"
else
  echo "  ✗ $HTML_BROKEN lien(s) HTML cassé(s)"; ERR=1
fi

# --- 4 ter. Promesses publiques sourcées (pas de chiffres marketing non certifiés)
OVERPROMISE=$(grep -rl '240k\|ops/s' apps/web-portal/dist/*.html 2>/dev/null | wc -l)
if [ "$OVERPROMISE" -eq 0 ]; then
  echo "  ✓ Landing pages : aucune promesse de performance non sourcée"
else
  echo "  ✗ $OVERPROMISE page(s) avec chiffre marketing non certifié"; ERR=1
fi

# --- 5. Statistiques ----------------------------------------------------------
MODS=$(ls -d tome-*/[0-9]* 2>/dev/null | awk -F/ '$NF ~ /^[0-9]+$/' | wc -l)
VF=$(grep -rhoE 'VF-[0-9]{3}-[0-9]{2}' tome-*/[0-9]*/README.md 2>/dev/null | sort -u | wc -l)
echo "────────────────────────────────────────────────────"
echo " Modules numérotés : $MODS | Verrous VF uniques : $VF"
if [ "$ERR" -eq 0 ]; then
  echo " ✅ CONFORME — Publication autorisée"
else
  echo " ❌ NON CONFORME — Corriger avant publication"
fi
echo "════════════════════════════════════════════════════"
exit $ERR
