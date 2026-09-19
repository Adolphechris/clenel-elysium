# Conventions de dépôt et d’écriture pour ELLYSIUM

## 1. Objet du document

Ce document fixe les règles de travail et d’organisation internes du dépôt GitHub. Son objectif est d’éviter une dispersion des contenus, de préserver la cohérence entre les tomes et de faciliter la transition vers l’implémentation technique.

## 2. Principes de base

1. La cohérence prime sur la vitesse.
2. Les tomes doivent être rédigés dans une logique progressive et cohérente avec les tomes 1 à 3.
3. Aucun nouveau document ne doit contredire la Constitution ni la philosophie pédagogique d’ELLYSIUM.
4. Aucun document ne peut prescrire une infrastructure autre que Google : la Constitution (Article 1 bis) et la Doctrine d’Infrastructure imposent l’écosystème « Google et Google uniquement » ; toute mention d’un service tiers non autorisé est nulle et doit être transposée selon la Table de Transposition Normative de la Doctrine.
5. Chaque document doit être traçable, compréhensible et réutilisable par les personnes qui viendront après.

## 3. Structure recommandée du dépôt

Le dépôt doit rester clair et simple. Une structure de référence est la suivante :

- `README.md` : présentation générale du projet.
- `feuille-de-route.md` : vue d’ensemble du plan de développement.
- `sommaire.md` : table des matières de référence.
- `tome-1/`, `tome-2/`, `tome-3/` : tomes déjà rédigés.
- `foundations/` : socle de référence et documents de cadrage.
- `tome-4/`, `tome-5/`, etc. : tomes à venir, rédigés selon les mêmes conventions.

## 4. Conventions d’écriture

### 4.1 Langue et style
- Le français est la langue de travail principale.
- Les textes doivent être simples, clairs et précis.
- Les formulations doivent être robustes, sans ambiguïté inutile.

### 4.2 Structure des documents
Chaque document doit comporter :
- un titre clair ;
- un objet du document ;
- une introduction précise ;
- des sections numérotées ;
- un rappel des références applicables ;
- une conclusion ou une note de portée.

### 4.3 Références internes
Chaque document doit indiquer, s’il y a lieu :
- les tomes qui le précèdent ;
- les tomes qui en dépendent ;
- les modules ou sujets connexes ;
- les points à valider ensuite.

## 5. Conventions de versionnement

Les documents doivent évoluer de manière contrôlée :
- une modification mineure peut être faite sans changer la version majeure ;
- une modification substantielle doit être signalée ;
- une nouvelle version d’un document doit rester cohérente avec les références précédentes.

Un bon niveau de pratique consiste à indiquer :
- `Version 0.1` pour un brouillon de fondation ;
- `Version 0.2` après correction et enrichissement ;
- `Version 1.0` lorsqu’un document est validé comme référence stable.

## 6. Règles pour les tomes à venir

Les tomes futurs doivent :
- rester alignés sur le socle de référence ;
- éviter les doublons avec les documents déjà rédigés ;
- citer explicitement leurs dépendances ;
- expliciter les cas d’usage, les rôles et les règles métier ;
- distinguer clairement ce qui relève de la gouvernance, de la pédagogie, de la technique ou de l’organisation.
- inclure une section de liaison vers les tomes précédents et vers les tomes ultérieurs identifiés dans la feuille de route.
- documenter les points de connexion avec le socle de référence et les impacts attendus sur l’institution.

## 7. Checklist de qualité avant validation

Avant de considérer un document comme prêt pour la suite, vérifier :
- qu’il est cohérent avec les tomes 1 à 3 ;
- qu’il ne contredit pas la Constitution ;
- qu’il respecte l’écosystème Google exclusif et la Table de Transposition Normative de la Doctrine d’Infrastructure ;
- qu’il est compréhensible sans contexte externe ;
- qu’il définit clairement les acteurs, les règles et les livrables ;
- qu’il peut servir directement de base à la suite du travail.

## 8. Utilisation pratique

Ce document n’est pas un document de production technique. Il est un document de discipline de travail. Il sert à éviter que le projet s’éparpille et que les tomes se contredisent.

## 9. Canon des verrous fonctionnels et contrôle automatique

- Chaque module numéroté (plage 55–336) porte au minimum cinq verrous fonctionnels `VF-XXX-01` à `VF-XXX-05`. Les modules critiques (notamment en cybersécurité, Tomes 9 et 10) peuvent en porter six ou sept : cette exception est documentée et acceptée.
- Les modules M001–M054 (tomes 1 à 4) sont rédigés en documents continus ; leur balisage `VF-` est requis dès leur découpage en modules unitaires.
- Le contrôle automatique est assuré par le script `tools/verify-corpus.sh` : complétude des modules, balisage `VF-`, absence de liens internes cassés et conformité de l’écosystème (aucune infrastructure non-Google, selon la Table de Transposition Normative de la Doctrine).
- Tout contributeur exécute ce script avant toute publication.
