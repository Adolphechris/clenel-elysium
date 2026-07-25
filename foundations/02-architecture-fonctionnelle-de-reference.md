# Architecture fonctionnelle de référence d'ELLYSIUM

## 1. Objet du document

Ce document complète les fondements institutionnels et pédagogiques déjà posés dans les tomes 1 à 3. Il sert de cadre de référence pour la construction des futurs modules fonctionnels, notamment ceux qui seront détaillés dans les tomes 4, 5, 10 et 11.

## 2. Principes d’architecture fonctionnelle

L’architecture fonctionnelle d’ELLYSIUM doit respecter les principes suivants :

1. Cohérence institutionnelle
   - chaque module doit être conforme à la Constitution (Tome 2) et à la philosophie pédagogique (Tome 3).

2. Séparation des responsabilités
   - l’administration, la pédagogie, la communication et la sécurité ne doivent pas être mêlées dans une même logique métier sans garde-fous.

3. Traçabilité
   - toute action importante doit pouvoir être retrouvée, expliquée et auditée.

4. Modularité
   - les modules doivent pouvoir évoluer indépendamment sans casser l’ensemble du système.

5. Accessibilité
   - les workflows doivent pouvoir fonctionner sur des environnements à faible débit et sur les appareils courants utilisés par les apprenants.

6. Responsabilité humaine
   - aucune décision académique ou disciplinaire définitive ne peut être prise sans contrôle humain.

## 3. Acteurs fonctionnels de référence

### 3.1 Apprenant
L’apprenant doit pouvoir :
- créer et gérer son compte ;
- accéder à ses parcours ;
- consulter ses cours et ressources ;
- suivre ses évaluations ;
- consulter ses résultats et ses bulletins ;
- contacter ses enseignants ou tuteurs.

### 3.2 Établissement
L’établissement doit pouvoir :
- créer et gérer son profil institutionnel ;
- inscrire des enseignants et des apprenants ;
- organiser les classes, filières et niveaux ;
- piloter l’académique et l’administration ;
- produire des rapports de suivi.

### 3.3 Enseignant
L’enseignant doit pouvoir :
- préparer et publier des contenus ;
- organiser les activités pédagogiques ;
- saisir et valider les évaluations ;
- suivre la progression de ses apprenants ;
- communiquer avec les apprenants et l’administration.

### 3.4 Administration centrale
L’administration doit pouvoir :
- gérer les droits et accès ;
- superviser les établissements et les profils ;
- suivre l’état général du dispositif ;
- gérer les communications institutionnelles ;
- piloter la qualité et l’évolution du système.

## 4. Modules fonctionnels de référence

### 4.1 Gestion des identités et des accès
Ce module couvre :
- création de compte ;
- authentification ;
- gestion des rôles ;
- réinitialisation d’accès ;
- journalisation des connexions et des actions sensibles.

### 4.2 Gestion des établissements
Ce module couvre :
- création de profil d’établissement ;
- affiliation de membres ;
- gestion des structures académiques internes ;
- administration des établissements pilotes ;
- suivi des statuts et des relations institutionnelles.

### 4.3 Gestion des apprenants
Ce module couvre :
- inscriptions ;
- affectation à un établissement, une classe ou un parcours ;
- suivi des données académiques et administratives ;
- suivi de progression ;
- gestion des absences et des alertes pédagogiques.

### 4.4 Catalogue de programmes et de contenus
Ce module couvre :
- programmes d’études ;
- filières et niveaux ;
- unités d’enseignement ;
- modules et cours ;
- ressources pédagogiques ;
- guides d’étude et supports de formation.

### 4.5 Parcours d’apprentissage
Ce module couvre :
- organisation des séquences d’apprentissage ;
- planification des activités ;
- progression et jalons ;
- remédiation et accompagnement ;
- suivi de l’atteinte des objectifs pédagogiques.

### 4.6 Évaluations et notes
Ce module couvre :
- conception des évaluations ;
- administration des devoirs et examens ;
- saisie des notes ;
- règles de pondération ;
- validation des résultats ;
- historique des décisions académiques.

### 4.7 Bulletins, certifications et diplômes
Ce module couvre :
- génération de bulletins ;
- calculs de résultats ;
- archivage des certifications ;
- génération de documents vérifiables ;
- traçabilité des documents délivrés.

### 4.8 Communication institutionnelle
Ce module couvre :
- messages internes ;
- notifications ;
- communications apprenant/enseignant/administration ;
- archives des échanges ;
- gestion des alertes importantes.

### 4.9 Tableaux de bord et reporting
Ce module couvre :
- tableaux de bord pédagogiques ;
- tableaux de bord institutionnels ;
- agrégats de performance ;
- statistiques de progression ;
- rapports de suivi et de conformité.

## 5. Workflows de référence

### 5.1 Workflow d’inscription d’un apprenant
1. L’apprenant crée un compte.
2. Il choisit son type de parcours : affilié à une école ou indépendant.
3. Les données de base sont collectées.
4. Le profil est créé puis validé selon les règles définies par l’institution.
5. L’apprenant est affecté à un parcours, une filière et un niveau.

### 5.2 Workflow d’inscription d’un établissement
1. L’établissement crée son profil institutionnel.
2. L’administration vérifie son identité et ses informations de base.
3. Les membres de l’établissement sont ajoutés avec des rôles distincts.
4. Les structures académiques internes sont définies.
5. Les premiers apprenants et enseignants sont affectés.

### 5.3 Workflow de publication pédagogique
1. Un enseignant prépare un contenu ou une séquence.
2. Il associe la ressource à un programme, un niveau et une unité d’enseignement.
3. La ressource est validée selon les règles pédagogiques fixées.
4. Elle est publiée pour les apprenants concernés.
5. La progression des apprenants est suivie et enregistrée.

### 5.4 Workflow d’évaluation et de bulletin
1. Une évaluation est planifiée.
2. Les apprenants y participent.
3. Les résultats sont saisis et validés.
4. Les notes sont pondérées et calculées.
5. Le bulletin est généré avec une traçabilité complète.

## 6. Règles de cohérence fonctionnelle

Toute fonctionnalité future doit respecter les règles suivantes :
- un apprenant doit toujours être associé à un parcours défini ;
- un contenu doit toujours appartenir à une structure pédagogique claire ;
- une évaluation doit être liée à un objectif pédagogique et à un niveau de formation ;
- une décision importante doit être historisée ;
- un utilisateur ne peut agir au-delà des droits qui lui ont été attribués ;
- toute création ou modification majeure doit être visible dans le journal d’audit.

## 7. Utilisation pour les tomes suivants

Ce document servira de base de travail pour :
- le Tome 4 : programmes d’études ;
- le Tome 5 : architecture fonctionnelle détaillée ;
- le Tome 10 : examens, certifications, bulletins et diplômes ;
- le Tome 11 : administration et communication interne.
