# LEÇON N3 — M1.3 — Diviseurs et multiples d'un nombre
> **Matière :** `ELL-CEB-7-MATH` · **Le cours :** `contenus/03-COURS/ELL-CEB-7-MATH.md`
> **Savoirs essentiels :** MM1.8 · **Séquence :** S1.3 · **Durée :** 40 minutes
> **Statut :** `[BROUILLON IA — à valider par enseignant habilité]`

---

## 1. Objectifs d'apprentissage

À la fin de cette leçon, l'élève sera capable de :

1. Trouver les diviseurs d'un nombre naturel ;
2. Trouver les multiples d'un nombre naturel ;
3. Identifier les nombres premiers et composés.

**Rattachement officiel :** savoir essentiel MM1.8.

---

## 2. Situation de départ

Un élève veut partager 24 bonbons équitablement entre ses amis. Combien d'amis peut-il inviter ?

**Question motrice :** *Quels nombres divisent 24 sans reste ? Comment trouve-t-on tous les diviseurs ?*

---

## 3. Déroulé pédagogique

| Étape | Durée | Activité de l'élève | Rôle de l'enseignant | Support |
|---|---|---|---|---|
| Découverte | 10 min | Distribuer 24 objets entre différents nombres de personnes | Questionnement | Objets concrets (bonbons, billes) |
| Construction | 15 min | Trouver les diviseurs par division systématique | Explication | Tableau des diviseurs interactif |
| Institutionnalisation | 10 min | Définir diviseur, multiple, nombre premier | Synthèse | Fiche de vocabulaire |
| Réinvestissement | 5 min | Identifier les diviseurs et multiples | Vérification | Tableau interactif |

---

## 4. Contenu de la leçon

### 4.1 Diviseurs d'un nombre

Un **diviseur** de N est un nombre qui divise N sans reste.

**Exemple :** Trouver les diviseurs de 12 :
- 12 ÷ 1 = 12 → 1 et 12 sont diviseurs
- 12 ÷ 2 = 6 → 2 et 6 sont diviseurs
- 12 ÷ 3 = 4 → 3 et 4 sont diviseurs
- 12 ÷ 4 = 3 → déjà trouvé
- 12 ÷ 5 = 2,4 → 5 n'est PAS diviseur

→ **Diviseurs de 12 : {1, 2, 3, 4, 6, 12}** — 6 diviseurs au total.

**Méthode :** tester tous les nombres de 1 à √N (ici √12 ≈ 3,5, tester 1,2,3).

### 4.2 Multiples d'un nombre

Un **multiple** de N est le résultat de N multiplié par un entier quelconque.

**Exemple :** Multiples de 3 :
- 3 × 1 = **3**
- 3 × 2 = **6**
- 3 × 3 = **9**
- 3 × 4 = **12**
- 3 × 5 = **15**…

→ Les multiples de 3 sont **infinis** : {3, 6, 9, 12, 15, 18, 21…}

### 4.3 Nombres premiers et composés

| Type | Définition | Exemples |
|---|---|---|
| **Nombre premier** | Exactement 2 diviseurs : 1 et lui-même | 2, 3, 5, 7, 11, 13, 17, 19, 23… |
| **Nombre composé** | Plus de 2 diviseurs | 4, 6, 8, 9, 10, 12… |
| **Ni premier ni composé** | Le nombre 1 | 1 (1 seul diviseur) |

**Remarque :** 2 est le seul nombre premier pair.

**Exemple en RDC :** Les anniversaires (365 jours) : 365 = 5 × 73, donc composé. On peut le diviser par 5 (73 groupes de 5 jours).

---

## 5. Activités et exercices

| N° | Type | Énoncé | Aide / indice | Corrigé |
|---|---|---|---|---|
| 1 | Application directe | Trouve les diviseurs de 18 | §4.1 | {1, 2, 3, 6, 9, 18} |
| 2 | Application directe | Quels sont les 4 premiers multiples de 5 ? | §4.2 | 5, 10, 15, 20 |
| 3 | Réinvestissement | 7 est-il premier ou composé ? Justifie. | §4.3 | Premier (diviseurs : 1 et 7 uniquement) |
| 4 | Situation-problème | 24 élèves doivent être répartis en groupes égaux. Combien de façons ? | §4.1 | Diviseurs de 24 : 1,2,3,4,6,8,12,24 → 8 façons |

---

## 6. Composante pratique

| Composante | Faisable en ligne | Dispositif |
|---|---|---|
| Distribution d'objets (R1) | Partiellement | **Terrain** : objets concrets (billes, bonbons) |

---

## 7. Évaluation de la leçon

**Quiz d'auto-évaluation** — 3 items :

1. Le nombre 1 est… □ premier □ composé □ ni l'un ni l'autre → **Code : MM1.8**
2. Les multiples de 4 sont… □ 4,8,12,16… □ 1,2,4 □ infinis → **Code : MM1.8** (première réponse)
3. Les diviseurs de 15 sont… □ {1,3,5,15} □ {1,15} □ {3,5} → **Code : MM1.8**

---

## 8. Ressources

| Ressource | Type | Hébergement | Accessibilité |
|---|---|---|---|
| Tableau des diviseurs interactif | Simulation | Cloud Run | Hors-ligne (PWA) |
| Crible d'Ératosthène (nombres premiers) | Interactive | Cloud Run | Hors-ligne (PWA) |
| Crible de nombres premiers jusqu'à 100 | Simulation | Cloud Storage | Contraste élevé |

---

## 9. Traçabilité

| Champ | Valeur |
|---|---|
| Rédigé par | piste IA |
| Validation humaine | `<enseignant habilité + date>` |
| Version | `v0.1` |
| Contrôle qualité | alignement aux savoirs essentiels vérifié le 20/09/2026 |
