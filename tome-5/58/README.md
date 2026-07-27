# 58. Module Identification et parcours d'accès

## Objet
Définir l'entrée dans le système pour une personne ou un établissement.

## Ce que ce sous-tome doit couvrir
- création de compte ;
- connexion ;
- récupération d'accès ;
- rattachement à un parcours ;
- création d'établissement ;
- vérification initiale.

## Parcours d'entrée
Le parcours doit commencer par un choix simple :
1. personne ;
2. établissement.

Ensuite, le système doit orienter automatiquement l'utilisateur vers le sous-parcours approprié selon son statut réel.

## Exigences fonctionnelles
- distinguer personne et établissement dès l'entrée ;
- supporter plusieurs statuts d'accès ;
- relier l'identité aux justificatifs ;
- garder une trace de chaque changement d'état.

## États possibles
- non enregistré ;
- en cours de saisie ;
- en attente de vérification ;
- vérifié ;
- actif ;
- suspendu ;
- archivé ;
- rejeté.

## Données d'identification
- nom ;
- prénom(s) ;
- date de naissance ou identifiant légal ;
- contacts ;
- rôle déclaré ;
- pièces justificatives ;
- historique de validation.

## Règles métier
- un même compte ne doit pas brouiller les statuts personne/établissement ;
- toute mise en accès doit être motivée par un statut vérifié ;
- les accès temporaires doivent expirer automatiquement ;
- les changements de rôle doivent être tracés.

## Résultat attendu
Un parcours d'accès unique, lisible et sécurisé.

## Critère d'acceptation
Le module est conforme si un utilisateur peut comprendre comment entrer, quoi fournir, quoi attendre et sous quel état final il se trouve.
