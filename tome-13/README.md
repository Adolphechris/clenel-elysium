# TOME 13 — INFRASTRUCTURE, EXPLOITATION ET ASSURANCE QUALITÉ TECHNIQUE

> **Domaine :** Haute Disponibilité, Exploitation Industrielle et Fiabilité des Systèmes
> **Périmètre :** Écosystème Exclusif Google Cloud Platform (GCP), GKE Autopilot, Cloud Run, Cloud SQL HA, CI/CD Cloud Build, PCA/PRA
> **Modules :** 228 à 246 (19 sous-tomes)
> **Statut :** EN COURS D'EXÉCUTION 🚀

---

## Objectif du Tome 13

Garantir la **continuité absolue de service (SLA $\ge 99,5\%$ garanti)**, la résilience face aux tempêtes de charge académique (65 000 requêtes/seconde lors des proclamations nationales) et la haute qualité logicielle de la plateforme souveraine ELLYSIUM.

Conformément à la **DOCTRINE INFRASTRUCTURE IMMUABLE DU 17 SEPTEMBRE 2026**, l'ensemble de l'infrastructure est opéré **EXCLUSIVEMENT sur Google Cloud Platform (GCP)**.

---

## Principes Constitutionnels Fondateurs

| Article | Disposition Constitutionnelle | Traduction Technique dans l'Infrastructure GCP |
|---|---|---|
| **Art. 1** | Souveraineté des Données | Hébergement primaire en région `africa-south1` (Johannesburg), clés HSM Cloud KMS régionales |
| **Art. 2** | Local-First & Continuité | Fonctionnement des microservices garanti avec tolérance aux partitions réseau |
| **Art. 7** | Frugalité & Optimisation | FinOps GCP strict, autoscaling dynamique à zéro (Scale-to-Zero) sur Cloud Run hors heures ouvrables |
| **Art. 8** | Traçabilité Totale | Journalisation immuable WORM sur Google Cloud Logging avec rétention verrouillée 7 ans |
| **Art. 14** | Continuité du Service Public | Haute Disponibilité multi-zones Cloud SQL HA, GKE Autopilot, bascule automatique < 60s |

---

## Index des Modules du Tome 13

| Module | Titre Officiel | Statut |
|---|---|---|
| [228](./228/README.md) | Périmètre du Tome 13 – politique d'exploitation et SLAs (99,5 %) | ⏳ En cours |
| [229](./229/README.md) | Conformité avec la Constitution (continuité de service, protection) | ✅ COMPLET |
| [230](./230/README.md) | Stratégie d'hébergement – 100% Google Cloud (GKE, Cloud Run, dimensionnement) | ✅ COMPLET |
| [231](./231/README.md) | Conteneurisation et orchestration – GKE Autopilot & Cloud Run | ✅ COMPLET |
| [232](./232/README.md) | Gestion des environnements (Dev, Test, Staging, Production GCP isolés) | ✅ COMPLET |
| [233](./233/README.md) | Stratégie de déploiement – CI/CD Google Cloud Build & Cloud Deploy (Canary) | ✅ COMPLET |
| [234](./234/README.md) | Surveillance (monitoring) – Cloud Monitoring, Cloud Trace, SecOps, alertes | ✅ COMPLET |
| [235](./235/README.md) | Gestion des incidents techniques – détection MTTD, escalade, astreinte | ✅ COMPLET |
| [236](./236/README.md) | Plan de continuité de service (PCA) et reprise après sinistre (PRA / DRP) | ✅ COMPLET |
| [237](./237/README.md) | Sauvegardes techniques – Cloud SQL Automated, Cloud Storage WORM 3-2-1 | ✅ COMPLET |
| [238](./238/README.md) | Haute disponibilité des bases de données – Cloud SQL PostgreSQL HA & Read Replicas | ✅ COMPLET |
| [239](./239/README.md) | Tests unitaires, d'intégration et de non-régression | ✅ COMPLET |
| [240](./240/README.md) | Tests de charge, de performance et de stress (Mode Haute Tempête 65k req/s) | ✅ COMPLET |
| [241](./241/README.md) | Assurance qualité du code (Gemini Code Assist, static analysis, dette technique) | ✅ COMPLET |
| [242](./242/README.md) | Procédure d'audit de panne et revue post-incident (Post-Mortem sans blâme) | ✅ COMPLET |
| [243](./243/README.md) | Gestion des coûts d'infrastructure et optimisation (FinOps Google Cloud) | ✅ COMPLET |
| [244](./244/README.md) | Maintenance préventive et corrective (Zéro interruption de service) | ✅ COMPLET |
| [245](./245/README.md) | Gouvernance DevOps & SRE – métriques DORA (SLA, SLO, SLI, MTTR) | ✅ COMPLET |
| [246](./246/README.md) | Matrice des dépendances – avec les Tomes 7, 9, 17 | ✅ COMPLET |

---

*README Tome 13 — rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*
