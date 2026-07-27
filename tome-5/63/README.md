# 63. Module Paramétrage pédagogique

## Objet
Définir les référentiels pédagogiques paramétrables par le système.

## Paramètres à couvrir
- matières ;
- UE ;
- coefficients ;
- volumes horaires ;
- programmes ;
- prérequis ;
- règles de validation.

## Structures paramétrables
Le système doit pouvoir configurer :
- les matières du secondaire ;
- les UE universitaires ;
- les coefficients ;
- les volumes horaires ;
- les séquences pédagogiques ;
- les règles de passage ;
- les grilles d'évaluation ;
- les contenus de base.

## Exigences
- variation par cycle, niveau, filière et option ;
- versionnage complet ;
- traçabilité des modifications ;
- compatibilité avec le Tome 4.

## Règles métier
- les paramètres ne doivent jamais être codés en dur lorsqu'ils dépendent d'un niveau ou d'une filière ;
- une modification de paramètre doit produire un historique ;
- les valeurs par défaut doivent rester compatibles avec la Constitution et le Tome 3 ;
- chaque configuration doit être réversible ou au moins reconstituable.

## Cas d'usage
- paramétrage d'une filière nouvelle ;
- changement d'une grille de coefficients ;
- adaptation d'un programme à une option ;
- mise à jour des prérequis ;
- duplication d'une structure existante pour une nouvelle promotion.

## Résultat attendu
Un paramétrage pédagogique fiable et réutilisable.

## Critère d'acceptation
Le module est conforme si les équipes pédagogiques peuvent adapter les paramètres sans altérer les règles fondamentales du système.
