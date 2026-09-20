# TABLEAU DE BORD — Production des contenus pédagogiques
> Mis à jour : 19/09/2026 · Généré et vérifié par `tools/verify-contenus.sh`

---

## 1. État global

| Indicateur | Valeur |
|---|---|
| Documents officiels recensés (N0) | **117** |
| Fiches-matières produites (N1) | **6** |
| Le cours produits (N2) | **6** |
| Leçons produites (N3) | **0** (en attente de validation humaine) |
| Évaluations produites (N4) | **0** |
| Codes officiels couverts (Vague 1) | **163 / 163** (100 %) |
| Erreurs de contrôle | **0** |
| Avertissements | **13** (champs en attente de source — statut brouillon, conforme) |

---

## 2. Détail par matière (Vague 1 — cycle terminal de l'Éducation de Base)

| Code | Matière | Année | Savoirs essentiels | Fiche (N1) | Le cours (N2) | Leçons (N3) | TP |
|---|---|---|---|---|---|---|---|
| `ELL-CEB-7-MATH` | Mathématiques | 7ᵉ | 67 | ✅ | ✅ | ⏸️ | aucun |
| `ELL-CEB-7-SVT` | SVT | 7ᵉ | 10 | ✅ | ✅ | ⏸️ | **R1** |
| `ELL-CEB-7-SPTTIC` | Sciences Physiques, Technologie et TIC | 7ᵉ | 11 | ✅ | ✅ | ⏸️ | **R1** |
| `ELL-CEB-8-MATH` | Mathématiques | 8ᵉ | 42 | ✅ | ✅ | ⏸️ | aucun |
| `ELL-CEB-8-SVT` | SVT | 8ᵉ | 17 | ✅ | ✅ | ⏸️ | **R1 + R2** |
| `ELL-CEB-8-SPTTIC` | Sciences Physiques, Technologie et TIC | 8ᵉ | 16 | ✅ | ✅ | ⏸️ | **R1 + R2** |
| **TOTAL** | | | **163** | **6/6** | **6/6** | 0 | — |

**Leçons prévues (N3) une fois les le cours validés : 25 + 76 + 36 + 50 + 41 + 43 = 271 leçons.**

---

## 3. Alertes en cours (⚠️)

| Type | Nombre | Nature | Action requise |
|---|---|---|---|
| Volumes horaires / maxima à certifier | 12 fiches + le cours | La grille horaire officielle n'est pas encore rattachée | **Piste humaine** : obtenir la grille horaire annexée aux programmes |
| Libellés de codes à compléter | `MM1.66`, `MM1.67`, `MSP1.5`, `MSP1.6`, `MSP1.7` | Codes identifiés et comptés, libellés au-delà de l'extraction réalisée | **Piste IA** : extraction complémentaire avant production des leçons |
| Carbonisation du bois (SPTTIC 8) | 1 | Affectation de code à confirmer sur la matrice | **Piste IA** : vérification sur le PDF officiel |

---

## 4. Prochaine étape (bloquante)

| Étape | Responsable | Objet |
|---|---|---|
| **Validation didactique V1** | **PISTE HUMAINE** | 2 enseignants habilités par matière (6 matières → 12 signatures) |
| **Collecte des sources manquantes** | **PISTE HUMAINE** | Programmes 7/8 : Français, Anglais, Histoire, Géographie, ECM, Arts, EPS |
| **Vague 3-5 (prêtes)** | PISTE IA | 40+ fiches humanités (sources disponibles) |

**Règle :** aucune leçon (N3) ne peut être produite avant la validation du le cours (N2) correspondant.

---

## 5. Comment relire ce tableau

- **✅** = produit et vérifié
- **⏸️** = bloqué par une validation humaine (normal — l'IA ne s'auto-valide pas)
- **⚠️** = champ en attente de source (preuve d'honnêteté, non un défaut)

Le contrôle automatique est reproductible à tout moment : `bash tools/verify-contenus.sh`.
