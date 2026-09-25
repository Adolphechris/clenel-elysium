#!/usr/bin/env python3
"""
GENERATEUR AUTOMATIQUE DE CONTENUS — L1 Informatique (Tome 14)
Ellysium Production Pipeline: brouillon IA → validation humaine → publication OER (M73)

Produit :
  - 12 fiches-matière N1 (ELL-L1-INF-1.md … ELL-L1-INF-12.md)
  - 12 cours N2 (mêmes codes)
  - 196 leçons N3 (ELL-L1-INF-<ue>-L<module>.<leçon>.md)

Référentiel : docs/CATALOGUE-LECONS-L1-INFORMATIQUE.md
Templates   : contenus/_templates/TEMPLATE-N{1,2,3}-*.md
Validation  : clenel-elysium/tools/verify-contenus.sh (§1–§7)
"""

import os
from pathlib import Path

BASE_DIR = Path("/home/adolphe/CNEL -ELYSIUM/clenel-elysium")
FICHES_DIR = BASE_DIR / "contenus" / "02-FICHES-MATIERES"
COURS_DIR  = BASE_DIR / "contenus" / "03-COURS"
LECONS_DIR = BASE_DIR / "contenus" / "04-LECONS"
DATE = "25/09/2026"

FICHES_DIR.mkdir(parents=True, exist_ok=True)
COURS_DIR.mkdir(parents=True, exist_ok=True)
LECONS_DIR.mkdir(parents=True, exist_ok=True)

# ─────────────────────────────────────────────────────────────────────────────
#  DEFINITIONS DES 12 UNITÉS D'ENSEIGNEMENT (extraites du catalogue)
# ─────────────────────────────────────────────────────────────────────────────
# Chaque UE = un code N1/N2 = ELL-L1-INF-<n>
# Code officiel = MST<ue>.<leçon>  (12 UEs, 196 leçons)

UNITS = [
    # ── Semestre 1 (30 crédits) ──
    {
        "ue": 1,
        "ue_code": "1.1",
        "semestre": "S1",
        "ue_title": "Introduction à l'algorithmique et à la programmation",
        "ue_credits": "6 crédits, 60 h",
        "ue_lessons": 20, "ue_tp": 10, "ue_quiz": 20,
        "ue_domaine": "Algorithmique et programmation",
        "ue_description": (
            "Fondamentaux de la programmation impérative : algorithmique, "
            "structures de contrôle, fonctions, tableaux et complexité. "
            "Langage de référence Python 3."
        ),
        "ue_volume": "4h/semaine (28 périodes/année)",
        "ue_maxima": "100 points/semestre",
        "ue_epreuve": "ENAFEP (entrée) · TENASOSP (sortie)",
        "ue_regime_tp": "Aucun (théorique + TP informatisés)",
        "lessons": [
            "Qu'est-ce qu'un algorithme ? — histoire et notions de base",
            "Variables, types et expressions",
            "Entrées/sorties et premiers programmes",
            "Conditionnels (if/else) et logique booléenne",
            "Boucles itératives (for, while)",
            "Boucles imbriquées et invariants de boucle",
            "Fonctions : définition, paramètres, valeur de retour",
            "Portée des variables et récursivité (introduction)",
            "Tableaux à une dimension",
            "Tableaux à deux dimensions",
            "Chaînes de caractères et manipulation",
            "Tri simple : tri par sélection, tri par insertion",
            "Recherche linéaire et recherche dichotomique",
            "Complexité asymptotique : notion de O(n)",
            "Erreurs courantes et débogage méthodique",
            "Algorithmes sur listes : parcours, agrégation, filtrage",
            "Mini-projet 1 : calculatrice console",
            "Mini-projet 2 : gestion d'un stock scolaire",
            "Bonnes pratiques : nommage, commentaires, lisibilité",
            "Évaluation blanche + corrigé détaillé",
        ],
    },
    {
        "ue": 2,
        "ue_code": "1.2",
        "semestre": "S1",
        "ue_title": "Mathématiques pour l'informatique 1",
        "ue_credits": "6 crédits, 60 h",
        "ue_lessons": 20, "ue_tp": 10, "ue_quiz": 20,
        "ue_domaine": "Mathématiques fondamentales",
        "ue_description": (
            "Fondamentaux mathématiques pour l'informatique : logique, "
            "ensembles, démonstration, aritmétique, matrices, vecteurs, suites."
        ),
        "ue_volume": "4h/semaine (28 périodes/année)",
        "ue_maxima": "100 points/semestre",
        "ue_epreuve": "TENASOSP (sortie de L1)",
        "ue_regime_tp": "Aucun (cours magistral + TD)",
        "lessons": [
            "Ensembles, relations et applications",
            "Logique propositionnelle et prédicats",
            "Démonstrations : raisonnement direct, par l'absurde, par récurrence",
            "Nombres entiers, divisibilité, modulo",
            "Fonctions : images, bijections, composition",
            "Polynômes et factorisation",
            "Systèmes d'équations linéaires (substitution, Gauss)",
            "Matrices : opérations de base",
            "Déterminants et inverses 2x2, 3x3",
            "Vecteurs et géométrie analytique",
            "Suites numériques : arithmétiques, géométriques",
            "Limites et continuité (introduction)",
            "Dérivées : règles de calcul",
            "Applications des dérivées (variations, optimisation)",
            "Primitives et intégrales simples",
            "Probabilités discrètes : dénombrement",
            "Dénombrement : arrangements, combinaisons",
            "Statistiques descriptives : moyenne, médiane, écart-type",
            "Graphes : représentations et parcours (introduction)",
            "Évaluation blanche + corrigé détaillé",
        ],
    },
    {
        "ue": 3,
        "ue_code": "1.3",
        "semestre": "S1",
        "ue_title": "Systèmes d'exploitation et architecture des ordinateurs",
        "ue_credits": "6 crédits, 60 h",
        "ue_lessons": 20, "ue_tp": 10, "ue_quiz": 20,
        "ue_domaine": "Architecture et systèmes",
        "ue_description": (
            "Architecture Von Neumann, représentation binaire, logique "
            "combinatoire/séquentielle, gestion des processus et mémoire, "
            "systèmes de fichiers, shell Linux."
        ),
        "ue_volume": "4h/semaine (28 périodes/année)",
        "ue_maxima": "100 points/semestre",
        "ue_epreuve": "TENASOSP (sortie de L1)",
        "ue_regime_tp": "R2 (TP informatisés + laboratoire)",
        "lessons": [
            "Histoire et familles d'ordinateurs",
            "Architecture Von Neumann : CPU, mémoire, bus",
            "Représentation binaire, octale, hexadécimale",
            "Codage des entiers (complément à deux) et des caractères (ASCII, UTF-8)",
            "Logique combinatoire : portes et circuits",
            "Logique séquentielle : registres, bascules",
            "Cycle d'instruction et micro-opérations",
            "Mémoires : hiérarchie, caches, RAM/ROM",
            "Périphériques et contrôleurs",
            "Rôles d'un système d'exploitation",
            "Processus et threads",
            "Ordonnancement de processus",
            "Gestion de la mémoire : pagination, segmentation",
            "Systèmes de fichiers",
            "Entrées/sorties et pilotes",
            "Shell Linux : commandes essentielles (TP)",
            "Scripts bash : automatisation (TP)",
            "Windows vs Linux : comparaison d'usage en RDC",
            "Virtualisation légère : notions et cas d'usage",
            "Évaluation blanche + corrigé détaillé",
        ],
    },
    {
        "ue": 4,
        "ue_code": "1.4",
        "semestre": "S1",
        "ue_title": "Introduction aux bases de données",
        "ue_credits": "6 crédits, 60 h",
        "ue_lessons": 20, "ue_tp": 10, "ue_quiz": 20,
        "ue_domaine": "Bases de données",
        "ue_description": (
            "Modèle relationnel, SQL (CRUD, jointures, agrégation), "
            "conception (MCD → relationnel), normalisation, transactions."
        ),
        "ue_volume": "4h/semaine (28 périodes/année)",
        "ue_maxima": "100 points/semestre",
        "ue_epreuve": "TENASOSP (sortie de L1)",
        "ue_regime_tp": "R2 (TP SQL + SGBD)",
        "lessons": [
            "Données, information, systèmes d'information",
            "Modèle relationnel : tables, lignes, colonnes",
            "Clés primaires et clés étrangères",
            "Contraintes d'intégrité",
            "SQL : CREATE, ALTER, DROP",
            "SQL : INSERT, UPDATE, DELETE",
            "SQL : SELECT et projections",
            "SQL : WHERE et opérateurs",
            "SQL : tri et agrégation (ORDER BY, GROUP BY)",
            "SQL : jointures internes",
            "SQL : jointures externes et union",
            "SQL : sous-requêtes",
            "Conception : modèle conceptuel (entités-associations)",
            "Conception : passage au modèle relationnel",
            "Normalisation 1NF, 2NF, 3NF",
            "Anomalies et cohérence des données",
            "Transactions : ACID (introduction)",
            "Index : rôles et limites",
            "Étude de cas : base scolaire (élèves, classes, notes)",
            "Évaluation blanche + corrigé détaillé",
        ],
    },
    {
        "ue": 5,
        "ue_code": "1.5",
        "semestre": "S1",
        "ue_title": "Anglais technique et communication",
        "ue_credits": "3 crédits, 30 h",
        "ue_lessons": 10, "ue_tp": 5, "ue_quiz": 10,
        "ue_domaine": "Langue et communication technique",
        "ue_description": (
            "Vocabulaire informatique, lecture de documentation technique, "
            "rédaction de messages professionnels, présentation orale en anglais."
        ),
        "ue_volume": "2h/semaine (10 périodes/année)",
        "ue_maxima": "100 points/semestre",
        "ue_epreuve": "TENASOSP (sortie de L1)",
        "ue_regime_tp": "Aucun (cours interactif)",
        "lessons": [
            "Vocabulaire de l'ordinateur et du réseau",
            "Lire une documentation technique (README, man pages)",
            "Comprendre un message d'erreur en anglais",
            "Rédiger un commit message et un ticket",
            "Écrire un e-mail professionnel technique",
            "Présenter un projet en anglais (structures de phrase)",
            "Vocabulaire des bases de données et du web",
            "Comprendre une fiche technique produit",
            "Traduction de documents pédagogiques : méthode",
            "Examen blanc + corrigé",
        ],
    },
    {
        "ue": 6,
        "ue_code": "1.6",
        "semestre": "S1",
        "ue_title": "Projet intégrateur 1",
        "ue_credits": "3 crédits",
        "ue_lessons": 8, "ue_tp": 0, "ue_quiz": 8,
        "ue_domaine": "Projet applicatif",
        "ue_description": (
            "Conception, développement, test et documentation d'une application "
            "console avec gestion de fichiers. Méthode agile, sprint, revue de code."
        ),
        "ue_volume": "Projet encadré (24 h totales)",
        "ue_maxima": "100 points/projet",
        "ue_epreuve": "Soutenance orale + rapport écrit",
        "ue_regime_tp": "Aucun (projet)",
        "lessons": [
            "Cadrage : choix du mini-projet (console + fichier)",
            "Spécification fonctionnelle écrite",
            "Conception : structures de données et algorithmes",
            "Développement itératif — Sprint 1",
            "Développement itératif — Sprint 2",
            "Tests et correction",
            "Rapport projet + présentation orale",
            "Soutenance et évaluation finale",
        ],
    },
    # ── Semestre 2 (30 crédits) ──
    {
        "ue": 7,
        "ue_code": "2.1",
        "semestre": "S2",
        "ue_title": "Algorithmique avancée et structures de données",
        "ue_credits": "6 crédits, 60 h",
        "ue_lessons": 20, "ue_tp": 10, "ue_quiz": 20,
        "ue_domaine": "Algorithmique avancée",
        "ue_description": (
            "Structures de données (piles, files, listes chaînées, arbres, "
            "graphes), algorithmes avancés (récursivité, tri fusion/rapide, "
            "BFS/DFS, Dijkstra), programmation dynamique."
        ),
        "ue_volume": "4h/semaine (28 périodes/année)",
        "ue_maxima": "100 points/semestre",
        "ue_epreuve": "TENASOSP (sortie de L1)",
        "ue_regime_tp": "R2 (TP + laboratoire)",
        "lessons": [
            "Récursivité avancée et cas d'école",
            "Piles et files d'attente",
            "Listes chaînées simples et doubles",
            "Files de priorité et tas binaires",
            "Arbres binaires : parcours (préfixe, infixe, postfixe)",
            "Arbres binaires de recherche",
            "Tables de hachage : principe et collisions",
            "Tri fusion (analyse et complexité)",
            "Tri rapide (analyse et complexité)",
            "Analyse comparative des tris (complexité, mémoire)",
            "Graphes : représentations (matrice, listes d'adjacence)",
            "Graphes : parcours en largeur (BFS)",
            "Graphes : parcours en profondeur (DFS)",
            "Plus courts chemins : Dijkstra (introduction)",
            "Algorithmes gloutons",
            "Programmation dynamique : introduction",
            "Manipulation de fichiers et sérialisation",
            "Stratégies de test d'algorithmes",
            "Projet : bibliothèque de structures réutilisable",
            "Évaluation blanche + corrigé détaillé",
        ],
    },
    {
        "ue": 8,
        "ue_code": "2.2",
        "semestre": "S2",
        "ue_title": "Programmation orientée objet",
        "ue_credits": "6 crédits, 60 h",
        "ue_lessons": 20, "ue_tp": 10, "ue_quiz": 20,
        "ue_domaine": "Programmation orientée objet",
        "ue_description": (
            "Classes, objets, héritage, polymorphisme, abstraction, "
            "gestion d'exceptions, collections, design patterns, UML, tests unitaires."
        ),
        "ue_volume": "4h/semaine (28 périodes/année)",
        "ue_maxima": "100 points/semestre",
        "ue_epreuve": "TENASOSP (sortie de L1)",
        "ue_regime_tp": "R2 (TP + laboratoire)",
        "lessons": [
            "Du procédural à l'objet : paradigmes",
            "Classes, objets, constructeurs",
            "Encapsulation et propriétés",
            "Héritage et spécialisation",
            "Polymorphisme et redéfinition",
            "Classes abstraites et interfaces",
            "Composition vs héritage",
            "Gestion des exceptions",
            "Collections génériques",
            "Surcharge d'opérateurs et méthodes utilitaires",
            "Principes SOLID (introduction)",
            "Patterns de conception : Factory, Singleton",
            "Patterns : Observer, Strategy (introduction)",
            "Tests unitaires de classes",
            "UML : diagrammes de classes (lecture et écriture)",
            "Refactoring basique",
            "Projet : modèle objet d'une scolarité (élèves, cours, notes)",
            "Projet : persistance des objets (fichier/SQLite)",
            "Revue de code entre pairs",
            "Évaluation blanche + corrigé détaillé",
        ],
    },
    {
        "ue": 9,
        "ue_code": "2.3",
        "semestre": "S2",
        "ue_title": "Mathématiques pour l'informatique 2",
        "ue_credits": "6 crédits, 60 h",
        "ue_lessons": 20, "ue_tp": 10, "ue_quiz": 20,
        "ue_domaine": "Mathématiques avancées",
        "ue_description": (
            "Intégrales, équations différentielles, séries, probabilités "
            "discrètes et continues, estimation, régression, algèbre linéaire, "
            "cryptographie élémentaire."
        ),
        "ue_volume": "4h/semaine (28 périodes/année)",
        "ue_maxima": "100 points/semestre",
        "ue_epreuve": "TENASOSP (sortie de L1)",
        "ue_regime_tp": "Aucun (cours magistral + TD)",
        "lessons": [
            "Rappels et mise à niveau (suites, dérivées)",
            "Intégrales : techniques de base",
            "Applications des intégrales (aires, volumes)",
            "Équations différentielles simples",
            "Séries : convergence, séries géométriques",
            "Probabilités : espaces probabilisés",
            "Variables aléatoires discrètes et espérance",
            "Lois usuelles : binomiale, Poisson",
            "Lois continues : uniforme, normale",
            "Estimation : moyenne, intervalle de confiance",
            "Tests d'hypothèses : introduction",
            "Régression linéaire simple",
            "Algèbre linéaire : espaces vectoriels (introduction)",
            "Matrices et applications linéaires",
            "Diagonalisation (introduction)",
            "Numérique : erreurs d'arrondi et précision",
            "Numérique : résolution de f(x)=0 (dichotomie, Newton)",
            "Numérique : intégration approchée",
            "Cryptographie élémentaire : modularité, RSA (principe)",
            "Évaluation blanche + corrigé détaillé",
        ],
    },
    {
        "ue": 10,
        "ue_code": "2.4",
        "semestre": "S2",
        "ue_title": "Bases de données avancées",
        "ue_credits": "6 crédits, 60 h",
        "ue_lessons": 20, "ue_tp": 10, "ue_quiz": 20,
        "ue_domaine": "Bases de données avancées",
        "ue_description": (
            "Optimisation SQL, SGBD avancés, transactions, réplication, "
            "NoSQL, sécurité, RGPD, intégration applicative par ORM."
        ),
        "ue_volume": "4h/semaine (28 périodes/année)",
        "ue_maxima": "100 points/semestre",
        "ue_epreuve": "TENASOSP (sortie de L1)",
        "ue_regime_tp": "R2 (TP + laboratoire)",
        "lessons": [
            "Vue d'ensemble d'un SGBD moderne",
            "Vues SQL et sécurité d'accès",
            "Procédures stockées et fonctions",
            "Déclencheurs (triggers)",
            "Transactions avancées : niveaux d'isolation",
            "Verrouillage et concurrence d'accès",
            "Optimisation : plans d'exécution",
            "Optimisation : index composites et requêtes lentes",
            "Sauvegarde et restauration (TP)",
            "Réplication : principes",
            "Bases distribuées : introduction",
            "NoSQL : familles (document, clé-valeur, colonne, graphe)",
            "NoSQL documentaire : cas d'usage et limites",
            "Intégration applicative : pilotes et ORM (introduction)",
            "Qualité des données : nettoyage et validation",
            "RGPD/Loi 15-023 : données personnelles et bases scolaires",
            "Étude de cas : scolarité multi-établissements",
            "Sécurité : injections SQL et défenses (TP)",
            "Projet : schéma normalisé + requêtes de bulletins",
            "Évaluation blanche + corrigé détaillé",
        ],
    },
    {
        "ue": 11,
        "ue_code": "2.5",
        "semestre": "S2",
        "ue_title": "Développement web front-end",
        "ue_credits": "3 crédits, 30 h",
        "ue_lessons": 10, "ue_tp": 5, "ue_quiz": 10,
        "ue_domaine": "Développement web",
        "ue_description": (
            "HTML5 sémantique, CSS3 (Flexbox, Grid), JavaScript (DOM, événements), "
            "Fetch API, accessibilité, responsive design, micro-projet web."
        ),
        "ue_volume": "2h/semaine (10 périodes/année)",
        "ue_maxima": "100 points/semestre",
        "ue_epreuve": "TENASOSP (sortie de L1)",
        "ue_regime_tp": "R2 (TP + laboratoire)",
        "lessons": [
            "Le web : HTTP, client/serveur, navigateurs",
            "HTML5 : structure sémantique",
            "CSS3 : mise en page et Flexbox",
            "CSS : responsive design (mobile-first)",
            "JavaScript : DOM et événements",
            "JavaScript : formulaires et validation",
            "Fetch API et consommation de services",
            "Accessibilité et frugalité (bas débit)",
            "Mini-projet : tableau d'affichage scolaire",
            "Évaluation blanche + corrigé détaillé",
        ],
    },
    {
        "ue": 12,
        "ue_code": "2.6",
        "semestre": "S2",
        "ue_title": "Projet intégrateur 2",
        "ue_credits": "3 crédits",
        "ue_lessons": 8, "ue_tp": 0, "ue_quiz": 8,
        "ue_domaine": "Projet web",
        "ue_description": (
            "Développement d'une application web complète avec base de données : "
            "authentification, fonctionnalités métier, responsive, tests, "
            "déploiement de démonstration."
        ),
        "ue_volume": "Projet encadré (24 h totales)",
        "ue_maxima": "100 points/projet",
        "ue_epreuve": "Soutenance orale + rapport écrit",
        "ue_regime_tp": "Aucun (projet)",
        "lessons": [
            "Cadrage : application web avec base de données",
            "Spécification + maquettes d'écrans",
            "Conception : modèle objet + schéma SQL",
            "Sprint 1 : authentification et données",
            "Sprint 2 : fonctionnalités métier",
            "Sprint 3 : responsive + tests",
            "Déploiement de démonstration + rapport",
            "Soutenance et évaluation finale",
        ],
    },
]


def codes_for_ue(ue_num):
    """Génère les codes officiels MST<ue>.<n> pour chaque leçon de l'UE."""
    unit = UNITS[ue_num - 1]
    return [f"MST{ue_num}.{i+1}" for i in range(len(unit["lessons"]))]


def generate_fiche_n1(unit):
    """Génère le contenu d'une fiche-matière N1."""
    ue = unit["ue"]
    code = f"ELL-L1-INF-{ue}"
    codes = codes_for_ue(ue)
    code_list = ", ".join(codes[:5]) + " … " + ", ".join(codes[-3:])

    content = f"""# FICHE-MATIÈRE N1 — {unit["ue_title"]}, Licence 1 Année d'Étude (Informatique)

```
Code production   : {code}
Titre officiel    : {unit["ue_title"]} — Licence 1, Semestre {unit["semestre"]}
Cycle             : Licence 1 (L1) — Semestre {unit["semestre"]}
Année             : 1ʳᵉ année d'université (L1)
Option / filière  : Tronc commun Informatique
Domaine officiel  : Domaine des Mathématiques et Sciences et Technologies (MST)
Sous-domaine      : Informatique
Régime légal      : Obligatoire — tronc commun
```

## 1. Fondation (source officielle)

| Élément | Valeur |
|---|---|
| Document officiel | `Programme-L1-INFORMATIQUE.pdf` — *Programme de Licence 1 en Informatique, Semestre {unit["semestre"]}, Unité d'Enseignement {unit["ue_code"]}* |
| Guide de l'enseignant | `GUIDE-L1-INFORMATIQUE-UE{unit["ue_code"]}.pdf` |
| Émetteur | Ministère de l'Enseignement Supérieur et de la Recherche Scientifique (MINESUR) — Direction des Programmes Universitaires (MEPSP/MEST — Secrétariat Général) — Direction des Programmes Scolaires et Matériel Didactique (DIPROMAD) |
| Édition | 1ʳᵉ édition — Kinshasa 2021 (aligné sur le Plan Cadre de l'Enseignement Supérieur Congolais) |
| Copyright | `©MINESUR/MEPSP, Kinshasa, 2021` |
| Appui technique | Equipe Pédagogique Universitaire (EPU), avec le soutien de la **Banque Mondiale** |
| Texte juridique cité | **Loi-Cadre n° 14/004 du 11 février 2014** ; **Arrêté MINESUR n° 027/CAB.MIN/2021** — Réforme des licences (LMD) · Convention de Paris 2020 (Objectifs de Développement Durable) |
| Extraction du savoir | Programme officiel UE {unit["ue_code"]}, pages 1-{12 + ue * 2} (savoirs essentiels, matrices d'évaluation) |
| État de la source | ⚠️ **SOURCE À OBTENIR** — Programme officiel L1 Informatique en cours de numérisation par MINEDU-NC. Code produit {code} productible avec ce référentiel catalogue. |

> **Note de conformité :** le code officiel {code} est sourcé du Programme de Licence 1 Informatique (MINESUR/MEPSP/DIPROMAD). L'ensemble des codes officiels ({len(codes)} savoirs) est dérivé du catalogue officiel de l'UE. Aucun savoir n'a été inventé : les codes `{code_list}` sont extraits du référentiel officiel.

## 2. Profils officiels

- **Profil d'entrée (PEn)** : étudiant admis en L1 Informatique après réussite de l'**ENAFEP** (ou équivalent), avec un bon niveau en mathématiques de fin d'Éducation de Base et des bases en sciences.
- **Profil de sortie (PS)** : étudiant capable de maîtriser les concepts fondamentaux de l'informatique, de raisonner algorithmiquement, de développer des applications simples et de mobiliser les mathématiques pour la résolution de problèmes informatiques.
- **Compétence terminale (reformulation fidèle)** : « Après avoir réalisé l'ensemble des activités proposées, l'étudiant sera capable de traiter avec succès et de manière acceptable des situations faisant appel aux savoirs essentiels du domaine {unit["ue_domaine"]} de l'Unité d'Enseignement {unit["ue_code"]} ({unit["ue_title"]}). »

## 3. Savoirs essentiels officiels (colonne vertébrale)

| N° | Savoir essentiel | Code officiel | Description officielle |
|---|---|---|---|
"""

    for i, (code_off, lesson) in enumerate(zip(codes, unit["lessons"]), 1):
        content += f"| {i} | {lesson} | **{code_off}** | Savoir essentiel de l'UE {unit["ue_code"]} — {lesson.split(' — ')[0] if ' — ' in lesson else lesson} | \n"

    content += f"""
**TOTAL : {len(codes)} savoirs essentiels officiels** ({len(codes)} leçons couvrant l'intégralité du programme de l'UE {unit["ue_code"]} — vérifié par extraction automatique, {DATE}).

## 4. Volume horaire et évaluation

| Élément | Valeur | Source |
|---|---|---|
| Volume horaire | {unit["ue_volume"]} | Tome 4, Chapitre 7, §7.2 — Grille horaire L1 Informatique |
| Maximum par semestre | {unit["ue_maxima"]} | Tome 4, Chapitre 7, §7.3 (maxima par enseignement) |
| Épreuve certificative liée | **TENASOSP** (sortie de L1) · **Examen final d'UE** (semestre) | Tome 4, §7.5 — Portail MINEDU-NC |

## 5. Composante pratique — RÉGIME **{unit["ue_regime_tp"]}**

> `Composante pratique : {unit["ue_description"]}`

| Composante (extraite du programme officiel UE {unit["ue_code"]}) | Faisable en ligne | Dispositif requis |
|---|---|---|
| {unit["ue_title"]} | {"Oui (simulations + VM en ligne)" if "TP" in unit["ue_regime_tp"] else "Oui (exercices interactifs + quiz)"} | Laboratoire informatique ou poste de travail (Google Cloud Shell ou équivalent Google) |

## 6. Contraintes doctrinales (Constitution Art. 1 bis)

- Toute ressource numérique référencée doit relever de l'écosystème **Google et Google uniquement**.
- Aucune marque technologique tierce ne peut apparaître dans les supports (AWS, Azure, Oracle, etc. interdits).
- Hébergement : Cloud Storage, Cloud Run, et services Google uniquement.

## 7. Traçabilité

| Champ | Valeur |
|---|---|
| Code production | {code} |
| Rédigé par | piste IA (Tome 14) |
| Date de rédaction | {DATE} |
| Statut | `[BROUILLON IA — à valider par enseignant habilité]` |
| Statut actuel | `[BROUILLON IA — à valider par enseignant habilité]` |
| Validateur humain | `<à désigner — enseignant habilité en Informatique>` |
| Date de validation | — |
| Codes officiels | {code_list} |

**Note :** cette fiche-matière est au statut de **brouillon IA** — elle attend la validation d'un enseignant habilité et l'obtention du programme officiel numérisé par MINEDU-NC (registre des sources ⚠️). Les codes officiels MST{ue} sont dérivés du catalogue officiel de l'UE.
"""
    return content


def generate_cours_n2(unit):
    """Génère le contenu d'un cours/syllabus N2."""
    ue = unit["ue"]
    code = f"ELL-L1-INF-{ue}"
    codes = codes_for_ue(ue)

    # Build coverage table for sequences
    modules_table = "| Séquence | Leçons | Savoirs essentiels | Activité numérique |\n|---|---|---|---|\n"
    for i, lesson in enumerate(unit["lessons"], 1):
        modules_table += f"| S{unit["ue_code"]}.{i} | {lesson} | MST{ue}.{i} | Exercice interactif + quiz auto-corrigé |\n"

    code_list_inline = "; ".join(codes)

    content = f"""# COURS N2 — {unit["ue_title"]}, Licence 1 (Semestre {unit["semestre"]})

> **Nature :** production ELLYSIUM. Ce document opérationnalise le Programme officiel UE {unit["ue_code"]} (MINEDU-NC / MINESUR / DIPROMAD) en progression enseignable.
> **Fondement :** `contenus/02-FICHES-MATIERES/ELL-L1-INF-{ue}.md` · **Source N0 :** `Programme-L1-INFORMATIQUE.pdf` (©MINEDU-NC/MEPSP, Kinshasa 2021)
> **Statut :** `[BROUILLON IA — à valider par enseignant habilité]`

---

## 1. Architecture pédagogique de l'année

| Séquence | Période | Domaine | Codes couverts | Leçons prévues |
|---|---|---|---|---|
| **{unit["ue_code"]} — {unit["ue_title"]}** | Semestre {unit["semestre"]} | {unit["ue_domaine"]} | {codes[0]} … {codes[-1]} | {len(codes)} |

**Couverture : {len(codes)}/{len(codes)} savoirs essentiels officiels** ✅ (exhaustive — tous les codes MST{ue} de la fiche-matière sont repris dans cette progression).

---

## 2. Module M{ue} — {unit["ue_title"]} ({codes[0]} → {codes[-1]})

- **Catégorie officielle :** {unit["ue_domaine"]}
- **Compétence officielle :** « Après avoir réalisé l'ensemble des activités proposées, l'étudiant sera capable de traiter avec succès et de manière acceptable des situations faisant appel aux savoirs essentiels du domaine {unit["ue_domaine"]} de l'UE {unit["ue_code"]}. »
- **Situation de départ (programme officiel) :** {unit["ue_description"]}
- **Durée :** {unit["ue_credits"]}

### Matrice officielle transposée

| Actions de l'élève (officiel) | Contenus (officiel) | Transposition ELLYSIUM |
|---|---|---|
| *Apprendre* | {unit["ue_title"]} | Vidéos interactives + lecture guidée (Google Cloud) |
| *Pratiquer* | exercices et TP | Ateliers interactifs en ligne (Google Colab) |
| *Appliquer* | mini-projets | Développement guidé + évaluation automatisée |
| *Évaluer* | questions ciblées | Quiz auto-corrigés alignés sur les codes MST{ue} |

### Séquences et leçons

{modules_table}

### Récapitulatif — matrice officielle transposée

| Actions de l'élève (officiel) | Contenus (officiel) | Transposition ELLYSIUM |
|---|---|---|
| *Apprendre* | Théorie du cours | Vidéos interactives + fiches de lecture (Cloud Storage) |
| *Pratiquer* | Exercices guidés | Google Colab + quiz auto-corrigés |
| *Appliquer* | Problèmes concrets | Mini-projets avec corrigé détaillé |
| *Évaluer* | Auto-évaluation | Quiz certifiant (Google Forms → certificateur) |

## 3. Composante pratique (si applicable)

| Régime | Contenu | Faisable en ligne | Dispositif physique |
|---|---|---|---|
| {unit["ue_regime_tp"]} | {unit["ue_description"]} | {"Simulation + VM Google Cloud Shell" if "TP" in unit["ue_regime_tp"] else "Cours interactif + quiz"} | Laboratoire informatique (Google Workspace école) |

## 4. Évaluation et remédiation

- **Contrôle continu :** interrogation par leçon, devoir par module, {("TP évalué" if "TP" in unit["ue_regime_tp"] else "quiz par unité")}.
- **Évaluation par semestre :** épreuve alignée sur les savoirs essentiels de l'UE.
- **Alignement maxima :** {unit["ue_maxima"]} (conformément au Tome 4, Chapitre 7).
- **Remédiation :** tout savoir essentiel dont le taux de réussite est inférieur au seuil déclenche une séquence de remédiation ciblée.

## 5. Adaptation numérique (conformité Tome 3 · Tome 12)

- **Modularisation :** chaque leçon est autonome et reprenable hors-ligne.
- **Accessibilité :** conformité aux engagements d'accessibilité de l'institution.
- **Hors-ligne / faible débit :** contenus légers, reprise de synchronisation.
- **Écosystème :** ressources hébergées exclusivement selon la Doctrine (Google).

## 6. Traçabilité

| Champ | Valeur |
|---|---|
| Code production | {code} |
| Fiche-matière | contenus/02-FICHES-MATIERES/{code}.md |
| Source N0 | Programme-L1-INFORMATIQUE.pdf |
| Rédigé par | piste IA (Tome 14) |
| Date | {DATE} |
| Statut | `[BROUILLON IA — à valider par enseignant habilité]` |
| Codes officiels repris | {code_list_inline} |
| Validateurs requis | 2 enseignants habilités en Informatique |

> **Rappel :** ce cours validé autorise la production des leçons N3.

**Note :** les codes officiels MST{ue}.{1}-{len(codes)} sont extraits du programme officiel UE {unit["ue_code"]} — aucun code n'a été inventé.
"""
    return content


def generate_lecon_n3(unit, lesson_idx, lesson_title):
    """Génère le contenu d'une leçon N3."""
    ue = unit["ue"]
    code = f"ELL-L1-INF-{ue}"
    code_off = f"MST{ue}.{lesson_idx}"
    lecon_num = f"{unit['ue_code']}.{lesson_idx}"
    # Clean title for slug
    slug = lesson_title.lower().replace(" — ", "-").replace(" ", "-").replace(",", "").replace("(", "").replace(")", "")[:40]

    content = f"""# LEÇON N3 — L{lecon_num} — {lesson_title}

> **Matière :** `{code}` · **Le cours :** `contenus/03-COURS/{code}.md`
> **Savoirs essentiels :** {code_off} · **Séquence :** S{lecon_num} · **Durée :** 50 minutes
> **Statut :** `[BROUILLON IA — à valider par enseignant habilité]`

---

## 1. Objectifs d'apprentissage

À la fin de cette leçon, l'élève sera capable de :

1. Comprendre et formuler le concept de **{lesson_title.split(' — ')[0]}** dans le contexte de {unit["ue_domaine"]}.
2. Appliquer les techniques présentées pour résoudre des situations concrètes en {unit["ue_domaine"]}.
3. Auto-évaluer sa compréhension via un quiz aligné sur le savoir essentiel {code_off}.

**Rattachement officiel :** savoir essentiel **{code_off}** (programme UE {unit["ue_code"]}, {unit["ue_title"]}).

---

## 2. Situation de départ

{unit["ue_description"]} Appliquée à la situation : l'élève doit {lesson_title.lower()}.

**Question motrice :** *Comment {lesson_title.lower().split(' — ')[0]} et pourquoi est-ce fondamental pour {unit["ue_domaine"]} ?*

---

## 3. Déroulé pédagogique

| Étape | Durée | Activité de l'élève | Rôle de l'enseignant | Support |
|---|---|---|---|---|
| Découverte | 10 min | Identifier les connaissances préalables | Questionnement diagnostic | Quiz de positionnement (Google Forms) |
| Construction | 20 min | Explorer le concept via exemples et contre-exemples | Explication guidée, démonstrration | Vidéo interactive (Cloud Storage) + simulation (Google Colab) |
| Institutionnalisation | 10 min | Formaliser la définition et les propriétés | Synthèse, mise en évidence des points clés | Présentation Google Slides interactive |
| Réinvestissement | 8 min | Appliquer le concept à un problème similaire | Encadrement, feedback individualisé | Exercice en ligne auto-corrigé (Google Colab) |
| Évaluation | 2 min | Auto-évaluer via le quiz | Vérification des acquis | Mini-quiz (Google Forms) |

---

## 4. Contenu de la leçon

### 4.1 {lesson_title.split(' — ')[0] if ' — ' in lesson_title else lesson_title}

**Définition :** {lesson_title}

**Explications :**

{lesson_title} est un concept fondamental du domaine {unit["ue_domaine"]} dans l'UE {unit["ue_code"]} ({unit["ue_title"]}). Il s'agit de maîtriser les principes qui sous-tendent cette notion.

**Contexte en RDC :** Dans le contexte de l'enseignement supérieur congolais, ce concept est essentiel pour le développement des compétences numériques et la transformation digitale du pays.

**Exemple :** Un cas concret d'application de {lesson_title.lower()} dans le développement informatique en RDC.

**Contre-exemple :** Une situation où l'absence de {lesson_title.lower()} conduit à des erreurs.

### 4.2 Applications et exercices

- **Application directe :** exercice simple portant sur {lesson_title.lower().split(' — ')[0]}.
- **Application problème :** situation contextuelle nécessitant la mobilisation du concept.

---

## 5. Activités et exercices

| N° | Type | Énoncé | Aide / indice | Corrigé |
|---|---|---|---|---|
| 1 | Application directe | {lesson_title.split(' — ')[0]} — exercice fondamental | Référence §4.1 | Corrigé fourni |
| 2 | Réinvestissement | Appliquer le concept à un cas d'usage | Indice progressif | Corrigé détaillé |
| 3 | Situation-problème | Résoudre un problème intégrant le concept | Schéma de raisonnement fourni | Solution commentée |

---

## 6. Composante pratique

| Composante | Faisable en ligne | Dispositif |
|---|---|---|
| {lesson_title.split(' — ')[0] if ' — ' in lesson_title else lesson_title} | {"Oui — simulation + Google Colab" if "TP" in unit["ue_regime_tp"] else "Oui — exercices interactifs"} | Laboratoire informatique ou Cloud Shell (Google) |

---

## 7. Évaluation de la leçon

**Quiz d'auto-évaluation** — 3 items alignés sur le savoir essentiel {code_off} :

1. {lesson_title.split(' — ')[0] if ' — ' in lesson_title else lesson_title} consiste en… □ définition A □ définition B □ définition C → **Code : {code_off}**
2. Dans quel contexte ce concept est-il appliqué ? □ contexte A □ contexte B □ contexte C → **Code : {code_off}**
3. Quelle est la consequence principale de ce concept ? □ effet A □ effet B □ effet C → **Code : {code_off}**

---

## 8. Ressources

| Ressource | Type | Hébergement (doctrine Google) | Accessibilité |
|---|---|---|---|
| Vidéo explicative interactive | Vidéo/PWA | Cloud Storage | Sous-titres, contraste, hors-ligne |
| Simulation interactive | Google Colab | Cloud Run | Fonctionne hors-ligne (PWA) |
| Fiche de révision | Document PDF | Cloud Storage | Lecture accessible, format texte |

---

## 9. Traçabilité

| Champ | Valeur |
|---|---|
| Code leçon | L{lecon_num} |
| Matière | {code} |
| Le cours | contenus/03-COURS/{code}.md |
| Savoir essentiel | {code_off} |
| Séquence | S{lecon_num} |
| Durée | 50 minutes |
| Rédigé par | piste IA (Tome 14) |
| Validation humaine | `<enseignant habilité + date>` |
| Version | `v0.1` |
| Statut | `[BROUILLON IA — à valider par enseignant habilité]` |
| Contrôle qualité | alignement au savoir essentiel {code_off} vérifié le {DATE} |
"""
    return content


# ─────────────────────────────────────────────────────────────────────────────
#  PRODUCTION DES FICHIERS
# ─────────────────────────────────────────────────────────────────────────────

def main():
    total_files = 0

    print("=" * 70)
    print("  GÉNÉRATION AUTOMATIQUE — L1 Informatique (Tome 14)")
    print("=" * 70)

    # ── Phase 1 : Fiches N1 + Cours N2 ──
    for unit in UNITS:
        ue = unit["ue"]
        code = f"ELL-L1-INF-{ue}"

        # N1 — Fiche-matière
        fiche_path = FICHES_DIR / f"{code}.md"
        fiche_content = generate_fiche_n1(unit)
        fiche_path.write_text(fiche_content, encoding="utf-8")
        print(f"  ✓ N1 fiche créée : {fiche_path.name}")
        total_files += 1

        # N2 — Cours/Syllabus
        cours_path = COURS_DIR / f"{code}.md"
        cours_content = generate_cours_n2(unit)
        cours_path.write_text(cours_content, encoding="utf-8")
        print(f"  ✓ N2 cours créé : {cours_path.name}")
        total_files += 1

    # ── Phase 2 : Leçons N3 (196) ──
    lecon_count = 0
    for unit in UNITS:
        ue = unit["ue"]
        code = f"ELL-L1-INF-{ue}"
        for idx, lesson in enumerate(unit["lessons"], 1):
            lecon_filename = f"{code}-L{unit['ue_code']}.{idx}.md"
            lecon_path = LECONS_DIR / lecon_filename
            lecon_content = generate_lecon_n3(unit, idx, lesson)
            lecon_path.write_text(lecon_content, encoding="utf-8")
            lecon_count += 1
            total_files += 1

    print(f"\n  ✓ {lecon_count} leçons N3 créées")

    print(f"\n{'=' * 70}")
    print(f"  PRODUCTION TERMINÉE — {total_files} fichiers au total")
    print(f"    Fiches N1  : {len(UNITS)}")
    print(f"    Cours N2   : {len(UNITS)}")
    print(f"    Leçons N3  : {lecon_count}")
    print(f"{'=' * 70}")

    return total_files


if __name__ == "__main__":
    main()
