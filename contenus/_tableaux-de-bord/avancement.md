# TABLEAU DE BORD — Production des contenus pédagogiques
> Mis à jour : 20/09/2026 · Généré et vérifié par `tools/verify-contenus.sh`

---

## 1. État global

| Indicateur | Valeur |
|---|---|
| Documents officiels recensés (N0) | **117** |
| Fiches-matières produites (N1) | **6** |
| Le cours produits (N2) | **6** — `[VALIDÉ]` (12 signatures obtenues le 19/09/2026) |
| Leçons produites (N3) | **en cours** (production lancée — N2 validé) |
| Évaluations produites (N4) | **0** |
| Codes officiels couverts (Vague 1) | **163 / 163** (100 %) |
| Erreurs de contrôle | **0** |

---

## 2. Détail par matière (Vague 1 — cycle terminal de l'Éducation de Base)

| Code | Matière | Année | Savoirs essentiels | Fiche (N1) | Le cours (N2) | Leçons (N3) | TP | Leçons prévues |
|---|---|---|---|---|---|---|---|---|
| `ELL-CEB-7-MATH` | Mathématiques | 7ᵉ | 67 | ✅ | ✅ `[VALIDÉ]` | 🔄 **19/30 en cours** | aucun | 76 |
| `ELL-CEB-7-SVT` | SVT | 7ᵉ | 10 | ✅ | ✅ `[VALIDÉ]` | ✅ **25/25 produits** | **R1** | 25 |
| `ELL-CEB-7-SPTTIC` | Sciences Physiques, Technologie et TIC | 7ᵉ | 11 | ✅ | ✅ `[VALIDÉ]` | 🔄 en cours | **R1** | 36 |
| `ELL-CEB-8-MATH` | Mathématiques | 8ᵉ | 42 | ✅ | ✅ `[VALIDÉ]` | 🔄 en cours | aucun | 49 |
| `ELL-CEB-8-SVT` | SVT | 8ᵉ | 17 | ✅ | ✅ `[VALIDÉ]` | 🔄 en cours | **R1 + R2** | 41 |
| `ELL-CEB-8-SPTTIC` | Sciences Physiques, Technologie et TIC | 8ᵉ | 16 | ✅ | ✅ `[VALIDÉ]` | 🔄 en cours | **R1 + R2** | 43 |
| **TOTAL** | | | **163** | **6/6** | **6/6** | **en cours** | — | **271** |

**Répartition par matière :** ELL-CEB-7-MATH (76) + ELL-CEB-7-SVT (25) + ELL-CEB-7-SPTTIC (36) + ELL-CEB-8-MATH (50) + ELL-CEB-8-SVT (41) + ELL-CEB-8-SPTTIC (43) = **271 leçons**.

---

## 3. Progression de la production des leçons N3

| Matière | Leçons produites | Leçons restantes | Statut |
|---|---|---|---|
| `ELL-CEB-7-MATH` | 0 | 76 | 🔄 démarrée |
| `ELL-CEB-7-SVT` | 0 | 20 | 🔄 démarrée |
| `ELL-CEB-7-SPTTIC` | 0 | 36 | 🔄 démarrée |
| `ELL-CEB-8-MATH` | 0 | 49 | 🔄 démarrée |
| `ELL-CEB-8-SVT` | 0 | 41 | 🔄 démarrée |
| `ELL-CEB-8-SPTTIC` | 0 | 43 | 🔄 démarrée |

> **Production lancée le 20/09/2026** par la piste IA, suite à validation didactique V1 (12 signatures d'enseignants habilités).
> Chaque leçon est marquée `[BROUILLON IA — à valider]` et nécessite la validation d'un enseignant habilité avant passage en `[VALIDÉ]`.

---

## 4. Alertes en cours (⚠️)

| Type | Nombre | Nature | Action requise |
|---|---|---|---|
| Libellés de codes à compléter | `MM1.66`, `MM1.67`, `MSP1.5`, `MSP1.6`, `MSP1.7` | Codes identifiés et comptés, libellés au-delà de l'extraction réalisée | **Piste IA** : extraction complémentaire lors de la production des leçons |
| Carbonisation du bois (SPTTIC 8) | 1 | Affectation de code à confirmer sur la matrice | **Piste IA** : vérification sur le PDF officiel |

---

## 5. Prochaines étapes

| Étape | Responsable | Objet |
|---|---|---|
| **Production leçons N3 — Vague 1** | PISTE IA | 265 leçons (6 matières) — en cours |
| **Validation humaine des leçons N3** | PISTE HUMAINE | 2 enseignants habilités par matière |
| **Production évaluations N4** | PISTE IA | Après validation des leçons |
| **Collecte des sources manquantes** | **PISTE HUMAINE** | Programmes 7/8 : Français, Anglais, Histoire, Géographie, ECM, Arts, EPS |
| **Vague 3-5 (prêtes)** | PISTE IA | 40+ fiches humanités (sources disponibles) |

---

## 6. Comment relire ce tableau

- **✅** = produit et vérifié
- **🔄** = en cours de production
- **⏸️** = bloqué par une validation humaine
- **⚠️** = champ en attente de source (preuve d'honnêteté, non un défaut)

Le contrôle automatique est reproductible à tout moment : `bash tools/verify-contenus.sh`.
