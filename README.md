# ELLYSIUM — Centre National d’Étude en Ligne (CNEL)
## Plateforme Éducative Nationale et Progiciel de Gestion Scolaire (PGI / SGS) de la République Démocratique du Congo

> **Mise à jour :** 17 Septembre 2026  
> **Dépôt officiel :** `https://github.com/Adolphechris/clenel-elysium.git`  
> **Infrastructure Cible :** 100% Google Cloud Platform (GCP) & Firebase Hosting exclusif  
> **Devise Fondatrice :** *"Rigueur, sérieux et honnêteté sont nos devises"*

---

## 1. Vue d'Ensemble du Projet

ELLYSIUM est la plateforme nationale souveraine de l'éducation en République Démocratique du Congo, alliant :
1. **Un Système d'Enseignement à Distance (EAD)** gratuit pour tout apprenant indépendant (AIS/AIU) du secondaire et de l'enseignement supérieur (Articles 3 et 4 de la Constitution ELLYSIUM).
2. **Un Progiciel de Gestion Intégré (PGI / SGS)** destiné aux établissements scolaires et universités partenaires pour moderniser la scolarité, les présences, les délibérations et la délivrance de diplômes infalsifiables.
3. **Une Architecture Souveraine 100% Google Cloud** : Hébergement applicatif sur Cloud Run / Firebase avec souveraineté cryptographique certifiée par Cloud EKM / CMEK (clés sous contrôle exclusif de la RDC, immunisant les données contre le Cloud Act).

---

## 2. Structure et État des 19 Tomes du Master Corpus

| Tome | Intitulé Fondateur | Modules Inclus | Statut Documentaire |
| :---: | :--- | :---: | :---: |
| **[Tome 01](./tome-1/README.md)** | Architecture Générale et Vision Stratégique | M001–M018 | **100% Rédigé** ✅ |
| **[Tome 02](./tome-2/README.md)** | Constitution de l'Institution ELLYSIUM (Articles 1 à 8) | M019–M036 | **100% Rédigé** ✅ |
| **[Tome 03](./tome-3/README.md)** | Parcours Apprenant et Socle Pédagogique (10 chapitres + annexes) | M037–M054 | **100% Rédigé** ✅ |
| **[Tome 04](./tome-4/README.md)** | Programmes d'Études et Filières (Secondaire & Supérieur) | M055–M073 | **100% Rédigé** ✅ |
| **[Tome 05](./tome-5/README.md)** | Architecture Fonctionnelle du PGI / SGS (29 sous-tomes) | M074–M091 (55–83) | **100% Rédigé** ✅ |
| **[Tome 06](./tome-6/README.md)** | Rôles, Gouvernance Interne et Espaces Dédiés | M092–M106 | **100% Rédigé** ✅ |
| **[Tome 07](./tome-7/README.md)** | Espace Parents, Tuteurs et Communautés | M107–M120 | **100% Rédigé** ✅ |
| **[Tome 08](./tome-8/README.md)** | Infrastructure Système, Sécurité et Résilience GCP | M121–M137 | **100% Rédigé** ✅ |
| **[Tome 09](./tome-9/README.md)** | Évaluations, Examens, Jurys et Diplômes | M138–M153 | **100% Rédigé** ✅ |
| **[Tome 10](./tome-10/README.md)** | Intelligence Artificielle Éducative et Moteurs Tuteurs (Vertex AI) | M154–M172 | **100% Rédigé** ✅ |
| **[Tome 11](./tome-11/README.md)** | Données, Analytique et Aide à la Décision (BigQuery) | M173–M192 | **100% Rédigé** ✅ |
| **[Tome 12](./tome-12/README.md)** | Accessibilité Universelle, Inclusion et Mode Bas Débit (Offline First) | M193–M210 | **100% Rédigé** ✅ |
| **[Tome 13](./tome-13/README.md)** | Exploitation, SRE, DevOps et Assurance Qualité GCP | M211–M227 | **100% Rédigé** ✅ |
| **[Tome 14](./tome-14/README.md)** | Écosystème Développeurs, API et Extensibilité | M228–M262 | **100% Rédigé** ✅ |
| **[Tome 15](./tome-15/README.md)** | Partenariats, Accréditation et Reconnaissance Institutionnelle | M263–M277 | **100% Rédigé** ✅ |
| **[Tome 16](./tome-16/README.md)** | Feuille de Route de Lancement et Conduite du Changement | M278–M293 | **100% Rédigé** ✅ |
| **[Tome 17](./tome-17/README.md)** | Modèle Économique et Pérennité Financière (ASBL d'Utilité Publique) | M294–M308 | **100% Rédigé** ✅ |
| **[Tome 18](./tome-18/README.md)** | Communication, Image de Marque et Multi-Landing Pages | M309–M319 | **100% Rédigé** ✅ |
| **[Tome 19](./tome-19/README.md)** | Cadre Juridique, Statuts ASBL, CGU/CGS et Droit Congolais | M320–M336 | **100% Rédigé** ✅ |

---

## 3. État d'Avancement Réel du Projet (Audit Vérifié)

Conformément à la feuille de route du **Tome 16 (Module 281 & 290)** :
- **Phase 0 — Volet Spécifications & Conception (BLOC A)** : **100% Achevé**. L'ensemble des 19 tomes et des 336 modules conceptuels est rédigé. 990 verrous fonctionnels `VF-` sont formellement balisés.
- **Phase 0 — Volet Implémentation Logicielle & Banc d'Essai Labo (BLOC B)** : **À Démarrer**. Développement des services Cloud Run, des bases Firestore et de la PWA hors-ligne, suivi du test sur la cohorte de 50 testeurs internes à Kinshasa.
- **Phase 1 — Pilote en Production Réelle (J0 à J+180)** : Déploiement fermé sur 10 écoles partenaires de Kinshasa (2 600 élèves, 100 enseignants).

---

## 4. Règles et Principes Inviolables

1. **Infrastructure Exclusif Google** : Firebase Hosting, Cloud Run, Cloud SQL / Firestore, Vertex AI, Cloud KMS, BigQuery ([Doctrine d'Infrastructure](./DOCTRINE_INFRASTRUCTURE_GOOGLE.md)).
2. **Article 5 (Constitution)** : Séparation étanche entre la caisse financière et la scolarité. Aucun élève ne peut être bloqué académiquement pour des raisons pécuniaires.
3. **Article 6 (Constitution)** : L'IA est un outil auxiliaire d'assistance. Aucune décision académique ou disciplinaire définitive n'est déléguée à un algorithme sans arbitrage humain.
4. **Calcul Officiel des Notes RDC** : $\text{Taux} = \left(\frac{\sum \text{PointsObtenus}}{\sum \text{Maxima}}\right) \times 100$.
