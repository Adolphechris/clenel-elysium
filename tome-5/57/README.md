# 57. Cartographie des acteurs et de leurs rôles

## Objet
Décrire les personas, responsabilités et limites d'accès.

## Acteurs à couvrir
- apprenant indépendant ;
- élève affilié ;
- étudiant ;
- enseignant ;
- direction ;
- préfet des études ;
- secrétariat ;
- caisse ;
- RH ;
- parent ;
- support ;
- IA d'assistance.

## Lecture métier des rôles
- **Apprenant** : consomme l'enseignement, suit sa progression, dépose ses travaux, consulte ses résultats.
- **Enseignant** : prépare, dispense, évalue et commente les apprentissages.
- **Direction** : arbitre, valide et supervise les processus.
- **Administration** : enregistre, vérifie, classe et produit les documents.
- **Parent ou responsable légal** : surveille ce qui lui est autorisé, sans empiéter sur le secret scolaire.
- **IA d'assistance** : suggère, résume, alerte, mais n'impose pas.

## Exigences
- principe du moindre privilège ;
- séparation des rôles ;
- interfaces adaptées à chaque profil ;
- traçabilité des actions de chaque acteur.

## Cas d'usage par acteur
- l'apprenant consulte son tableau de bord et ses devoirs ;
- l'enseignant saisit des notes et des observations ;
- la direction valide les résultats ou les décisions de passage ;
- le secrétariat enregistre un dossier d'inscription ;
- la caisse suit un échéancier de paiement ;
- le parent reçoit une notification de progression.

## Règles de séparation
- un acteur ne doit pas pouvoir valider seul ce qu'il a créé si la procédure exige un second regard ;
- les données sensibles doivent être segmentées par droit d'accès ;
- les opérations d'administration doivent être distinctes des opérations pédagogiques ;
- les données familiales, académiques et financières doivent être consultables séparément.

## Résultat attendu
Une matrice claire des rôles et de leurs cas d'usage principaux.

## Critère d'acceptation
La matrice est validée si chaque acteur dispose d'au moins un rôle principal, d'une limite d'action claire et d'un niveau d'accès cohérent avec la Constitution.
