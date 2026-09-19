# ELLYSIUM — Centre National d’Étude en Ligne (CNEL)
## Plateforme Éducative Nationale et Progiciel de Gestion Scolaire (PGI / SGS) de la République Démocratique du Congo

> **Mise à jour :** 17 Septembre 2026  
> **Dépôt officiel :** `https://github.com/Adolphechris/clenel-elysium.git`  
> **Infrastructure Cible :** 100% Google Cloud Platform (GCP) & Firebase Hosting exclusif — **Google et Google uniquement** (Constitution, Article 1 bis)  
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
| **[Tome 01](./tome-1/README.md)** | Vision, Philosophie et Mission (document fondateur continu) | M001–M018 (unités conceptuelles) | Rédigé ✅ |
| **[Tome 02](./tome-2/README.md)** | Constitution de l'Institution (22 articles, dont l'Article 1 bis) | M019–M036 (unités conceptuelles) | Rédigé ✅ |
| **[Tome 03](./tome-3/README.md)** | Architecture Pédagogique et Ingénierie de l'Enseignement (10 chapitres + annexes) | M037–M046 (unités conceptuelles) | Rédigé ✅ |
| **[Tome 04](./tome-4/README.md)** | Programmes d'Études — Secondaire & Supérieur (5 dossiers, dont archives) | M047–M054 (unités conceptuelles) | Rédigé ✅ |
| **[Tome 05](./tome-5/README.md)** | Architecture Fonctionnelle | 55–83 (29 modules) | Rédigé ✅ |
| **[Tome 06](./tome-6/README.md)** | Expérience Utilisateur et Design System | 84–106 (23 modules) | Rédigé ✅ |
| **[Tome 07](./tome-7/README.md)** | Architecture Technique et Interopérabilité | 107–129 (23 modules) | Rédigé ✅ (écosystème transposé Google) |
| **[Tome 08](./tome-8/README.md)** | Cadre Souverain, Éthique et Ingénierie de l'Intelligence Artificielle | 130–149 (20 modules) | Rédigé ✅ |
| **[Tome 09](./tome-9/README.md)** | Gouvernance des Données, Cybersécurité et Souveraineté Numérique | 150–170 (21 modules) | Rédigé ✅ |
| **[Tome 10](./tome-10/README.md)** | Examens, Certifications, Bulletins et Diplômes | 171–191 (21 modules) | COMPLET ✅ |
| **[Tome 11](./tome-11/README.md)** | Administration et Communication Interne | 192–210 (19 modules) | Rédaction à consolider 🚀 |
| **[Tome 12](./tome-12/README.md)** | Applications Numériques | 211–227 (17 modules) | Rédaction à consolider 🚀 |
| **[Tome 13](./tome-13/README.md)** | Infrastructure, Exploitation et Assurance Qualité Technique | 228–246 (19 modules) | Rédaction à consolider 🚀 (module 228 en cours) |
| **[Tome 14](./tome-14/README.md)** | Organisation, Gouvernance Opérationnelle, RH et Production des Contenus | 247–262 (16 modules) | Rédaction à consolider 🚀 |
| **[Tome 15](./tome-15/README.md)** | Partenariats, Accréditation et Reconnaissance Institutionnelle | 263–277 (15 modules) | COMPLET ✅ |
| **[Tome 16](./tome-16/README.md)** | Feuille de Route de Lancement et Conduite du Changement | 278–293 (16 modules) | COMPLET ✅ |
| **[Tome 17](./tome-17/README.md)** | Modèle Économique et Pérennité Financière | 294–308 (15 modules) | COMPLET ✅ |
| **[Tome 18](./tome-18/README.md)** | Communication et Marketing | 309–319 (11 modules) | COMPLET ✅ |
| **[Tome 19](./tome-19/README.md)** | Juridique, Conformité et ASBL | 320–336 (17 modules) | COMPLET ✅ |

> **Convention de numérotation :** les modules M001–M054 (tomes 1 à 4) sont matérialisés par des documents continus et non par des dossiers unitaires ; la numérotation physique des modules débute au **module 55 (Tome 5)** et s'achève au **module 336 (Tome 19)** — soit **282 modules unitaires**, tous balisés `VF-`.

> **Exécution :** le plan opérationnel de mise en production (pistes IA / humaine), le backlog MVP du PGI (≈ 520 SP) et le catalogue des leçons L1 Informatique (≈ 196 leçons) sont dans [`docs/`](./docs/PLAN-EXECUTION.md).

---

## 3. État d'Avancement Réel du Projet (Audit Vérifié)

Conformément à la feuille de route du **Tome 16 (Module 281 & 290)** :
- **Phase 0 — Volet Spécifications & Conception (BLOC A)** : rédaction réalisée sur l'ensemble des 19 tomes. **1 422 verrous fonctionnels `VF-`** formellement balisés sur les 282 modules numérotés (55–336) — 271 modules à 5 verrous, 11 modules critiques (cybersécurité) à 6–7 verrous ; les modules M001–M054 (tomes 1–4) sont rédigés en documents continus. Consolidation de statut en cours sur les tomes 11 à 14.
- **Phase 0 — Volet Implémentation Logicielle & Banc d'Essai Labo (BLOC B)** : **À Démarrer**. Développement des services Cloud Run, des bases Firestore et de la PWA hors-ligne, suivi du test sur la cohorte de 50 testeurs internes à Kinshasa.
- **Phase 1 — Pilote en Production Réelle (J0 à J+180)** : Déploiement fermé sur 10 écoles partenaires de Kinshasa (2 600 élèves, 100 enseignants).

---

## 4. Règles et Principes Inviolables

1. **Écosystème EXCLUSIVEMENT GOOGLE — « Google et Google uniquement »** (Constitution, Article 1 bis ; [Doctrine d'Infrastructure](./DOCTRINE_INFRASTRUCTURE_GOOGLE.md)) : GKE Autopilot, Cloud Run, Cloud SQL, Firestore, Cloud Storage, Memorystore, BigQuery, Vertex AI, Gemini, Firebase, Cloud KMS/EKM, Cloud Armor, Cloud Build, Cloud Deploy, Workspace, Maps. Toute infrastructure tierce est nulle et transposée selon la Table de Transposition Normative.
2. **Article 5 (Constitution)** : Séparation étanche entre la caisse financière et la scolarité. Aucun élève ne peut être bloqué académiquement pour des raisons pécuniaires.
3. **Article 6 (Constitution)** : L'IA est un outil auxiliaire d'assistance. Aucune décision académique ou disciplinaire définitive n'est déléguée à un algorithme sans arbitrage humain.
4. **Calcul Officiel des Notes RDC** : $\text{Taux} = \left(\frac{\sum \text{PointsObtenus}}{\sum \text{Maxima}}\right) \times 100$.
