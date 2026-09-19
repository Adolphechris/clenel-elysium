# PLAN DE RÉDACTION DES MATIÈRES À ENSEIGNER — Cycle d'orientation et Humanités
> Version 1.0 — 19/09/2026 · Conforme : `contenus/00-CADRE-LEGAL-ET-SOURCES.md`, Constitution Art. 1 bis, Tome 3 (philosophie pédagogique), Tome 4 (programmes), Tome 14 (chaîne éditoriale), Fondations 04
> **Fondement factuel :** 117 documents officiels du MINEDU-NC recensés ; 6 programmes vérifiés et extraits (cycle terminal de l'Éducation de Base) ; **163 savoirs essentiels officiels** identifiés pour la Vague 1
> **Statut :** plan directeur de production — la piste IA produit, la piste humaine valide

---

## 1. Objet

Ce plan organise la **production des matières enseignées** sur ELLYSIUM, du cycle d'orientation jusqu'aux humanités, **exclusivement à partir des référentiels officiels** du Ministère de l'Éducation Nationale et Nouvelle Citoyenneté de la RDC.

Il ne répond pas à la question « quoi enseigner ? » (c'est l'État qui y répond), mais à celle-ci : **comment rendre enseignable, en ligne et hors-ligne, ce que l'État prescrit ?**

---

## 2. Les deux vérités fondatrices (vérifiées sur documents officiels)

### 2.1 Il n'existe pas de syllabus au niveau scolaire en RDC

**Vérification mesurée :** le mot « syllabus » apparaît **0 fois** dans les programmes officiels du primaire et du secondaire. Les termes officiels sont `Programme éducatif` · `Curriculum` · `Matrices du programme éducatif` · `Guide de l'enseignant` · `Manuel de l'élève` · `Cahier de l'élève` · `Grille horaire`.

**Conséquence :** le syllabus et la leçon sont des **productions ELLYSIUM**, contraintes par le référentiel officiel. Ce n'est ni une copie (rien à copier), ni une invention (tout est adossé).

### 2.2 Les travaux pratiques existent officiellement

**Vérifications textuelles :** « 50 minutes de cours théoriques et 50 minutes de cours pratique » (Informatique secondaire) ; « trois (3) travaux pratiques sur le clavier et la souris » ; « nécessitent des travaux pratiques dans des centres informatiques » ; section *D. Activités* de la matrice SVT 7 incluant *Découverte du microscope*, *Préparation microscopique*, *Observation microscopique* ; « cours techniques » et « un mois de stage » (Secrétariat-Administration).

**Conséquence :** trois régimes de TP sont formalisés (R1 laboratoire · R2 atelier · R3 stage/habilitation) et **déclarés obligatoirement** sur chaque fiche technique ou professionnelle.

---

## 3. Architecture de production à 5 niveaux

| Niveau | Livrable | Nature juridique | Producteur | Contrôle |
|---|---|---|---|---|
| **N0** | Référentiel national | Document officiel de l'État | État (MEN/DIPROMAD) | Collecte humaine |
| **N1** | Fiche-matière | Production ELLYSIUM (identité de la matière) | IA | `verify-contenus.sh` |
| **N2** | Syllabus | **Production ELLYSIUM** (n'existe pas dans le système) | IA → validation humaine | `verify-contenus.sh` |
| **N3** | Leçon | **Production ELLYSIUM** | IA → validation enseignant | `verify-contenus.sh` |
| **N4** | Évaluations | Production ELLYSIUM (alignée sur la cotation officielle) | IA → validation | `verify-contenus.sh` |

---

## 4. Arborescence du dépôt

```
contenus/
├── 00-CADRE-LEGAL-ET-SOURCES.md      → textes, doctrine, régime TP, terminologie
├── 01-REFERENTIELS/
│   └── _registre-sources.md          → N0 : 117 documents officiels + état ✅/⚠️
├── 02-FICHES-MATIERES/               → N1 : une fiche par matière × année
├── 03-SYLLABUS/                      → N2 : un syllabus par fiche
├── 04-LECONS/                        → N3 : à produire après validation
├── 05-EVALUATIONS/                   → N4
├── _templates/                       → 4 modèles (N1, N2, N3, N4)
└── _tableaux-de-bord/                → avancement et alertes
```

---

## 5. Les 7 vagues de production

| Vague | Périmètre | État de la source | État de production |
|---|---|---|---|
| **V1** | Cycle terminal ÉB — Math, SVT, SPTTIC (7 et 8) | ✅ disponible | ✅ **6 fiches + 6 syllabus produits** |
| **V2** | Cycle terminal ÉB — Français, Anglais, Histoire, Géographie, ECM, Arts, EPS | ⚠️ à obtenir | ⏸️ en attente des sources |
| **V3** | Humanités Scientifiques — Math, SPTTIC, SVT (1 → 4) | ✅ disponible | ⏸️ prêt à démarrer (12 fiches) |
| **V4** | Humanités techniques — Électricité, Électronique, Informatique, Pétrochimie, Commerciale et Gestion, Secrétariat-Administration | ✅ disponible | ⏸️ prêt à démarrer |
| **V5** | Humanités pédagogiques — HPR, IFME, Psychopédagogie | ✅ disponible | ⏸️ prêt à démarrer |
| **V6** | Humanités professionnelles — Coupe et couture, Arts et métiers, Aide-soignante | ⚠️ à obtenir + habilitation légale | ⛔ bloqué par les sources et l'habilitation |
| **V7** | Humanités générales — Biochimie, Latin-Philosophie, Grec-Philosophie | ⚠️ à obtenir | ⛔ bloqué par les sources |

---

## 6. Garde-fous (règles non négociables)

1. **Aucune N1/N2/N3 sans N0.** Un contenu non adossé à un document officiel est interdit.
2. **Aucune donnée officielle inventée.** Intitulés, volumes horaires, maxima : jamais estimés. Champ `⚠️ À CERTIFIER` sinon.
3. **Traçabilité systématique.** Chaque document porte sa source, son émetteur, son édition, son copyright.
4. **Marquage IA / validation humaine.** Aucun contenu ne passe à `[VALIDÉ]` sans validation par 2 enseignants habilités.
5. **Contrôle automatique.** `tools/verify-contenus.sh` doit être au vert avant toute publication.
6. **Conformité doctrinale.** Écosystème **Google uniquement** (Constitution Art. 1 bis).
---

## 7. Division du travail

| Piste IA (dépôt) | Piste HUMAINE (hors dépôt) |
|---|---|
| Ingestion des PDF officiels, extraction des savoirs essentiels | Obtention des programmes manquants (DIPROMAD, Inspection, écoles) |
| Production des fiches N1 et des syllabus N2 | **Validation didactique par 2 enseignants habilités par matière** |
| Production des leçons N3 (après validation N2) | Conventions de TP (laboratoires, ateliers, structures habilitées) |
| Production des évaluations N4 | Habilitations légales (Aide-soignante et Accoucheuse) |
| Outillage de contrôle | Accréditations (Tome 15) |

**Règle :** l'IA ne déclare jamais accompli un travail humain, et réciproquement.

---

## 8. Feuille de route opérationnelle

| Étape | Contenu | Piste | État |
|---|---|---|---|
| **E1** | Cadre légal + registre des sources + 4 modèles | IA | ✅ fait |
| **E2** | Vague 1 : 6 fiches N1 | IA | ✅ fait |
| **E3** | Vague 1 : 6 syllabus N2 | IA | ✅ fait |
| **E4** | Contrôleur `verify-contenus.sh` | IA | ✅ fait (0 erreur) |
| **E5** | Collecte des programmes manquants (Vague 2 + V6/V7) | **HUMAIN** | ⏳ à lancer |
| **E6** | Validation didactique de la V1 (2 enseignants par matière) | **HUMAIN** | ⏳ en attente |
| **E7** | Vague 3 : 12 fiches + 12 syllabus (Humanités Scientifiques) | IA | prêt à démarrer |
| **E8** | Vagues 4 et 5 (techniques, pédagogiques) | IA | prêt à démarrer |
| **E9** | Production des leçons N3 (après validation N2) | IA + humain | bloqué par E6 |
| **E10** | Production des évaluations N4 | IA + humain | bloqué par E9 |

---

## 9. Jalon de contrôle

| Jalon | Critère de sortie | Vérification |
|---|---|---|
| **V1 produite** | 6 fiches + 6 syllabus, 163/163 codes officiels couverts | `tools/verify-contenus.sh` |
| **V1 validée** | 12 signatures d'enseignants habilités | PV de validation |
| **V2 débloquée** | Programmes officiels 7/8 (Français, Anglais, etc.) obtenus | Registre des sources à ✅ |
| **Vagues 3-5 produites** | 40+ fiches supplémentaires | `verify-contenus.sh` |
| **Prêt pour le pilote** | V1→V5 validées + leçons N3 produites | Revue COPIL |

---

## 10. Note de portée

Ce plan est **exécutable et vérifiable**. Il ne promet rien qu'il ne puisse prouver : chaque affirmation est mesurable par `tools/verify-contenus.sh`, chaque source est traçable au registre, et chaque contenu non encore sourcé est **explicitement signalé** plutôt que masqué.

**État honnête au 19/09/2026 :** le **socle de production est opérationnel** et la **Vague 1 est produite au niveau N1-N2**. La production des leçons dépend désormais d'une **validation humaine** — c'est la prochaine étape réelle.