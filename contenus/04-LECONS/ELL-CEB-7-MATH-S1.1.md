# LEÇON N3 — M1.1 — Notion de numération, écriture d'un naturel dans une base, passage d'une base à l'autre
> **Matière :** `ELL-CEB-7-MATH` · **Le cours :** `contenus/03-COURS/ELL-CEB-7-MATH.md`
> **Savoirs essentiels :** MM1.1, MM1.2, MM1.3, MM1.4, MM1.5 · **Séquence :** S1.1 · **Durée :** 40 minutes
> **Statut :** `[BROUILLON IA — à valider par enseignant habilité]`

---

## 1. Objectifs d'apprentissage

À la fin de cette leçon, l'élève sera capable de :

1. Écrire un nombre naturel dans une base quelconque (2, 5, 10) ;
2. Convertir un nombre d'une base à une autre ;
3. Expliquer le principe de la numération positionnelle.

**Rattachement officiel :** savoirs essentiels MM1.1 → MM1.5.

---

## 2. Situation de départ

Un élève voit l'écriture binaire d'un numéro de téléphone et se demande comment on peut écrire des nombres autrement qu'en base 10.

**Question motrice :** *Pourquoi utilise-t-on la base 10 ? Peut-on écrire des nombres dans d'autres bases ?*

---

## 3. Déroulé pédagogique

| Étape | Durée | Activité de l'élève | Rôle de l'enseignant | Support |
|---|---|---|---|---|
| Découverte | 10 min | Écrire des nombres en base 2 avec des bûchettes | Questionnement | Bûchettes/papier |
| Construction | 15 min | Comprendre la numération positionnelle, convertir base 10 ↔ base 2 | Explication | Convertisseur interactif |
| Institutionnalisation | 10 min | Définir base, chiffre, position, valeur de position | Synthèse | Tableau récapitulatif |
| Réinvestissement | 5 min | Exercices de conversion | Vérification | Exercices auto-corrigés |

---

## 4. Contenu de la leçon

### 4.1 La numération décimale (base 10)

En base 10, on utilise 10 chiffres : **0, 1, 2, 3, 4, 5, 6, 7, 8, 9**.

Chaque position a un poids :
- Unités (10⁰ = 1)
- Dizaines (10¹ = 10)
- Centaines (10² = 100)
- Milliers (10³ = 1000)

Exemple : **375** = 3 × 100 + 7 × 10 + 5 × 1 = 375

### 4.2 La numération binaire (base 2)

En base 2, on utilise 2 chiffres : **0 et 1**.
Chaque position a un poids : 1, 2, 4, 8, 16, 32…

| Position | poids | Chiffre |
|---|---|---|
| 2⁴ | 16 | 1 |
| 2³ | 8 | 0 |
| 2² | 4 | 1 |
| 2¹ | 2 | 1 |
| 2⁰ | 1 | 0 |

→ **10110 en base 2** = 1×16 + 0×8 + 1×4 + 1×2 + 0×1 = **22 en base 10**

### 4.3 Comment convertir ?

**Base 10 → Base 2 :** diviser successivement par 2 et noter les restes.

Exemple : 13 en base 10 → base 2 :
- 13 ÷ 2 = 6 reste **1**
- 6 ÷ 2 = 3 reste **0**
- 3 ÷ 2 = 1 reste **1**
- 1 ÷ 2 = 0 reste **1**
→ **1101 en base 2** (lire les restes de bas en haut)

**Base 2 → Base 10 :** multiplier chaque chiffre par son poids et additionner (§4.2).

**Exemple en RDC :** L'informatique utilise la base 2. Comprendre les bases est essentiel pour le module SPTTIC.

---

## 5. Activités et exercices

| N° | Type | Énoncé | Aide / indice | Corrigé |
|---|---|---|---|---|
| 1 | Application directe | Écris 25 en base 2. | Diviser par 2 | 11001 |
| 2 | Application directe | Quel est le poids de la position 2³ en base 2 ? | §4.2 | 8 |
| 3 | Réinvestissement | Convertis 1011 en base 10. | §4.2 | 1×8+0×4+1×2+1×1 = 11 |
| 4 | Situation-problème | Un ordinateur utilise 0 et 1. Pourquoi ? | §4.2 | Base 2 (deux états : électriques ON/OFF) |

---

## 6. Composante pratique

| Composante | Faisable en ligne | Dispositif |
|---|---|---|
| Conversion de bases (R1) | Oui — simulation | **Aucun matériel physique** — activité théorique |

---

## 7. Évaluation de la leçon

**Quiz d'auto-évaluation** — 3 items :

1. En base 2, les chiffres possibles sont… □ 0-9 □ 0 et 1 □ 1-9 → **Code : MM1.1**
2. 10 en base 2 vaut… □ 2 □ 10 □ 1010 → **Code : MM1.1**
3. Le poids de la position 2² est… □ 2 □ 4 □ 8 → **Code : MM1.1**

---

## 8. Ressources

| Ressource | Type | Hébergement | Accessibilité |
|---|---|---|---|
| Convertisseur de bases interactif | Simulation | Cloud Run | Hors-ligne (PWA) |
| Exercices auto-corrigés | Quiz | Cloud Run | Hors-ligne (PWA) |
| Tableau des poids de position | Infographie | Cloud Storage | Contraste élevé |

---

## 9. Traçabilité

| Champ | Valeur |
|---|---|
| Rédigé par | piste IA |
| Validation humaine | `<enseignant habilité + date>` |
| Version | `v0.1` |
| Contrôle qualité | alignement aux savoirs essentiels vérifié le 20/09/2026 |
