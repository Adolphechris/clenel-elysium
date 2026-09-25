# LEÇON N3 — M1.4 — Notion de nombre premier
> **Matière :** `ELL-CEB-7-MATH` · **Le cours :** `contenus/03-COURS/ELL-CEB-7-MATH.md`
> **Savoirs essentiels :** MM1.9 · **Séquence :** S1.4 · **Durée :** 40 minutes
> **Statut :** `[BROUILLON IA — à valider par enseignant habilité]`

---

## 1. Objectifs d'apprentissage

À la fin de cette leçon, l'élève sera capable de :

1. Utiliser le crible d'Ératosthène pour trouver les nombres premiers ;
2. Décomposer un nombre en produit de facteurs premiers ;
3. Appliquer les nombres premiers à des problèmes concrets.

**Rattachement officiel :** savoir essentiel MM1.9.

---

## 2. Situation de départ

Un élève veut savoir si 29 est un nombre premier. Il ne veut pas tester tous les diviseurs un par un.

**Question motrice :** *Existe-t-il une méthode rapide pour trouver tous les nombres premiers jusqu'à un certain nombre ?*

---

## 3. Déroulé pédagogique

| Étape | Durée | Activité de l'élève | Rôle de l'enseignant | Support |
|---|---|---|---|---|
| Découverte | 10 min | Tester si quelques nombres sont premiers | Questionnement | Liste de nombres |
| Construction | 15 min | Construire le crible d'Ératosthène (1 à 100) | Démonstration | Crible interactif |
| Institutionnalisation | 10 min | Apprendre la décomposition en facteurs premiers | Synthèse | Fiche méthodologique |
| Réinvestissement | 5 min | Décomposer des nombres | Vérification | Exercices |

---

## 4. Contenu de la leçon

### 4.1 Le crible d'Ératosthène

Méthode pour trouver tous les nombres premiers jusqu'à N :
1. Écrire les nombres de 2 à N.
2. Commencer par 2 (premier nombre premier).
3. **Barrer** tous les multiples de 2 (4, 6, 8, 10…).
4. Passer au nombre suivant non barré (3).
5. **Barrer** tous les multiples de 3 (6, 9, 12…).
6. Répéter avec 5, 7, 11… jusqu'à √N.
7. Les nombres **non barrés** sont les nombres premiers.

**Nombres premiers de 1 à 50 :**
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47 — **15 nombres premiers**.

### 4.2 Décomposition en facteurs premiers

Tout nombre composé peut s'écrire comme un **produit de nombres premiers** (unique!).

**Exemple : 60**
- 60 ÷ 2 = 30
- 30 ÷ 2 = 15
- 15 ÷ 3 = 5
- 5 ÷ 5 = 1
→ **60 = 2² × 3 × 5**

### 4.3 Applications

1. **PGCD** (Plus Grand Commun Diviseur) : facteurs premiers communs.
2. **PPCM** (Plus Petit Commun Multiple) : tous les facteurs avec leur plus grande puissance.
3. **Simplification de fractions** : diviser numérateur et dénominateur par le PGCD.

**Exemple en RDC :** Simplifier la fraction 60/84 :
- 60 = 2² × 3 × 5
- 84 = 2² × 3 × 7
- PGCD = 2² × 3 = 12
- 60/84 = 5/7

---

## 5. Activités et exercices

| N° | Type | Énoncé | Aide / indice | Corrigé |
|---|---|---|---|---|
| 1 | Application directe | Le crible d'Ératosthène trouve… □ les diviseurs □ les nombres premiers □ les multiples □ les fractions → **Code : MM1.9** | §4.1 | Les nombres premiers |
| 2 | Application directe | Décompose 48 en facteurs premiers. | §4.2 | 48 = 2⁴ × 3 |
| 3 | Réinvestissement | Décompose 72 en facteurs premiers et simplifie 72/96. | §4.2 | 72=2³×3², PGCD=24, 72/96=3/4 |
| 4 | Situation-problème | 24 élèves et 36 bancs. On veut des rangées identiques. Combien de rangées maximum ? | §4.2 | PGCD(24,36) = 12 rangées |

---

## 6. Composante pratique

| Composante | Faisable en ligne | Dispositif |
|---|---|---|
| Crible d'Ératosthène (R1) | Simulation oui | **Aucun matériel physique** |

---

## 7. Évaluation de la leçon

**Quiz d'auto-évaluation** — 3 items :

1. Le crible d'Ératosthène sert à… □ trouver les nombres premiers □ calculer des fractions □ mesurer des angles → **Code : MM1.9**
2. 21 = 3 × 7. Donc 21 est… □ premier □ composé □ pair → **Code : MM1.9**
3. La décomposition en facteurs premiers de 36 est… □ 2² × 3² □ 2 × 3³ □ 4 × 9 → **Code : MM1.9**

---

## 8. Ressources

| Ressource | Type | Hébergement | Accessibilité |
|---|---|---|---|
| Crible d'Ératosthène interactif | Simulation | Cloud Run | Hors-ligne (PWA) |
| Calculateur de décomposition | Simulation | Cloud Run | Hors-ligne (PWA) |
| Vidéo : nombres premiers | Vidéo 2 min | Cloud Storage | Sous-titres |

---

## 9. Traçabilité

| Champ | Valeur |
|---|---|
| Rédigé par | piste IA |
| Validation humaine | `<enseignant habilité + date>` |
| Version | `v0.1` |
| Contrôle qualité | alignement aux savoirs essentiels vérifié le 20/09/2026 |
