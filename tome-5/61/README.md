# 61. Module Gestion des établissements scolaires

## Objet
Définir le cycle de vie d'un établissement au sein d'ELLYSIUM.

## États à couvrir
- brouillon ;
- en vérification ;
- actif ;
- suspendu ;
- archivé.

## Données institutionnelles
Chaque établissement doit pouvoir enregistrer :
- sa dénomination ;
- son type ;
- sa localisation ;
- ses responsables ;
- ses contacts ;
- ses niveaux ou filières ;
- ses paramètres opérationnels ;
- ses pièces de validation.

## Exigences
- identité de l'établissement ;
- contacts et responsables ;
- niveaux ouverts ;
- règles internes ;
- validation humaine documentée.

## Règles de cycle de vie
- la création initiale commence au statut brouillon ;
- la validation transforme le brouillon en structure exploitable ;
- la suspension doit interrompre les flux sans effacer l'historique ;
- l'archivage conserve les traces administratives et académiques.

## Cas d'usage
- création d'un nouvel établissement ;
- correction d'une fiche institutionnelle ;
- activation d'un espace école ;
- fermeture temporaire ;
- reprise d'activité.

## Résultat attendu
Un espace institutionnel maîtrisé et contrôlable.

## Critère d'acceptation
Le module est conforme s'il peut gérer l'entrée, l'évolution et la clôture d'un établissement sans perdre d'informations structurantes.
