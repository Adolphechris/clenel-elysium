# Module 238 — Haute Disponibilité des Bases de Données (Cloud SQL HA & Clustering)

> **Positionnement :** Tome 13 — Infrastructure, Exploitation & Qualité · Module 238 sur 246
> **Autorité :** Principal Database Architect / Lead Infrastructure SRE
> **Liaison amont/aval :** ← Module 237 (Sauvegardes 3-2-1) → Module 239 (Tests unitaires et régression) →

---

## 1. Objet

Ce module régit la configuration de haute disponibilité (HA), le partitionnement horizontal, la réplication multi-zones et le délestage de lecture des bases de données relationnelles souveraines d'ELLYSIUM. Fondé exclusivement sur **Google Cloud SQL pour PostgreSQL 16**, ce dispositif assure une tolérance totale aux pannes matérielles avec un temps de basculement inférieur à **60 secondes**.

---

## 2. Architecture Haute Disponibilité Régionale (Multi-Zones)

L'instance principale de production fonctionne en configuration **High Availability (HA)** répartie sur deux zones physiques distinctes de la région `africa-south1` :

```mermaid
graph TD
    APP["⚡ Microservices Cloud Run / GKE Autopilot"]

    subgraph "Google Cloud SQL Haute Disponibilité (africa-south1)"
        subgraph "Zone af-south1-a"
            PRIMARY["🗄️ Instance Primaire (Master Écriture)<br/>PostgreSQL 16 Enterprise<br/>16 vCPU / 64 Go RAM / SSD Régional"]
        end

        subgraph "Zone af-south1-b"
            STANDBY["🗄️ Instance Standby Synchrone (Chaud)<br/>Miroir exact prêt pour Failover instantané"]
        end

        subgraph "Zone af-south1-c"
            REPLICA_1["🗄️ Read Replica 1 (Lectures Pédagogiques)"]
            REPLICA_2["🗄️ Read Replica 2 (Vérification Publique Diplômes)"]
        end
    end

    APP -->|Écritures & Transactions Caisse| PRIMARY
    PRIMARY -->|Réplication bloc synchrone au niveau stockage| STANDBY
    PRIMARY -->|Réplication logique asynchrone| REPLICA_1 & REPLICA_2
    APP -->|Lectures massives (Bulletins / Cours)| REPLICA_1 & REPLICA_2
```

---

## 3. Mécanisme de Bascule Automatique (*Automated Failover*)

Si l'instance primaire subit un incident physique (panne de carte mère, crash du processus PostgreSQL, perte du réseau zonal) :
1. **Détection Heartbeat** : Le plan de contrôle Google Cloud SQL détecte la perte de signal en moins de **15 secondes**.
2. **Promotion Transparente du Standby** : L'instance en zone B devient instantanément la nouvelle primaire d'écriture.
3. **Mise à Jour DNS Privé Interne** : L'adresse IP privée virtuelle du cluster est réassignée automatiquement. Les microservices Cloud Run se reconnectent sans modification de configuration.
4. **Temps Total d'Interruption** : Mesuré entre **35 et 55 secondes**, sans perte d'une seule transaction validée (RPO = 0).

---

## 4. Stratégie de Partitionnement et Découpage des Tables Volumineuses

Pour maintenir des temps de réponse inférieurs à **50 millisecondes** sur une base contenant plus de **150 millions de cotes scolaires** :
- **Partitionnement par Intervalle Temporel (Range Partitioning)** sur la table `cotes` :
  ```sql
  -- Partitionnement natif PostgreSQL 16 par année académique
  CREATE TABLE cotes (
      id UUID NOT NULL,
      eleve_id UUID NOT NULL,
      matiere_id UUID NOT NULL,
      annee_academique TEXT NOT NULL,
      points NUMERIC(5,2) NOT NULL,
      statut TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (id, annee_academique)
  ) PARTITION BY LIST (annee_academique);

  -- Création des partitions dédiées
  CREATE TABLE cotes_2025_2026 PARTITION OF cotes FOR VALUES IN ('2025-2026');
  CREATE TABLE cotes_2026_2027 PARTITION OF cotes FOR VALUES IN ('2026-2027');
  ```
- **Indexation B-Tree & BRIN Frugale** : Les partitions archivées utilisent des index BRIN (*Block Range Index*) divisant par 10 la mémoire RAM nécessaire à l'indexation.

---

## 5. Pool de Connexions et Délestage (PgBouncer)

Pour absorber les pics de charge sans épuiser les processus PostgreSQL :
- Intégration d'un pooler de connexions **PgBouncer** gérant jusqu'à **10 000 connexions clientes simultanées**.
- Mode de transaction (*Transaction Pooling*) réutilisant immédiatement les connexions dès la fin de chaque requête SQL.

---

## 6. Verrous Fonctionnels

| ID | Règle | Niveau |
|---|---|---|
| VF-238-01 | Déploiement Haute Disponibilité (HA) multi-zones obligatoire en production | CONSTITUTIONNEL |
| VF-238-02 | Basculement automatique en cas de panne garanti en moins de 60 secondes | RÉSILIENCE |
| VF-238-03 | Séparation stricte du trafic : 100% des lectures publiques orientées sur les Read Replicas | ARCHITECTURE |
| VF-238-04 | Partitionnement obligatoire de toute table excédant 10 millions d'enregistrements | PERFORMANCE |
| VF-238-05 | Pooler de connexions PgBouncer configuré pour interdire la saturation mémoire | SÉCURITÉ |
| VF-238-06 | Tout déploiement nécessite un plan de secours documenté testé au moins une fois par mois | FIABILITÉ |

---

*Sous-tome rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*
