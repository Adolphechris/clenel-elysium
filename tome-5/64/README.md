# 64. Module Emploi du temps

## Objet
Définir la gestion des horaires, salles et affectations.

## Ce que ce sous-tome doit couvrir
- plages horaires ;
- classes ;
- enseignants ;
- salles ;
- substitutions ;
- indisponibilités ;
- conflits de planification.

## Logique de planification
L'emploi du temps doit permettre :
- la construction initiale ;
- la publication ;
- la modification ;
- la substitution ;
- la consultation ;
- l'historisation.

## Exigences
- détection des chevauchements ;
- notification des changements ;
- validation avant publication ;
- journalisation des ajustements.

## Règles de gestion
- un enseignant ne peut pas être affecté à deux séances incompatibles ;
- une salle ne peut pas être réservée simultanément deux fois ;
- une modification après publication doit être visible ;
- les substitutions doivent être tracées ;
- les conflits doivent empêcher la publication tant qu'ils ne sont pas résolus.

## Cas d'usage
- création de l'emploi du temps d'une classe ;
- remplacement temporaire d'un enseignant ;
- changement de salle ;
- réajustement après absence ;
- publication d'une version corrigée.

## Résultat attendu
Un emploi du temps cohérent, publiable et maintenable.

## Critère d'acceptation
Le module est conforme si la planification évite les conflits, conserve les versions et supporte les ajustements sans perte de visibilité.
