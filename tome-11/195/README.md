# Module 195 — Gestion des Rôles et Responsabilités (Affectation des Personnels)

> **Positionnement :** Tome 11 — Administration et Communication Interne · Module 195 sur 210
> **Autorité :** Direction des Ressources Humaines / Secrétariat Général ELLYSIUM
> **Liaison amont/aval :** ← Module 194 (Comptes utilisateurs) → Module 196 (Établissements partenaires) →

---

## 1. Objet

Ce module formalise l'attribution, l'affectation territoriale et institutionnelle, le contrôle d'activité et la révocation des rôles administratifs et pédagogiques des personnels au sein d'ELLYSIUM. Il traduit la hiérarchie officielle du système éducatif congolais en matrices de droits d'accès contextualisées (ABAC) par école, faculté, classe et discipline.

---

## 2. Typologie des Rôles des Personnels

```mermaid
graph TD
    PERSONNEL["👨‍💼 Personnels d'Établissement & Institution"]

    subgraph "Direction & Gouvernance"
        PROM["Promoteur / Délégué Général<br/>(Supervision globale, finances, agrément)"]
        DIR["Directeur d'Établissement / Recteur<br/>(Responsable légal et académique)"]
        PREF["Préfet des Études / Doyen<br/>(Pédagogie, délibération, jurys, scellement)"]
    end

    subgraph "Corps Enseignant"
        PROF_TIT["Professeur Titulaire / Enseignant Référent<br/>(Gestion d'une classe, synthèse des cotes)"]
        PROF_DISC["Professeur de Discipline / Chargé de Cours<br/>(Saisie des TJ, devoirs, interrogations)"]
    end

    subgraph "Administration & Vie Scolaire"
        SEC_ACAD["Secrétaire des Études / Secrétaire Général<br/>(Inscriptions, PV, documents légaux)"]
        DIR_DISC["Directeur de Discipline / Surveillant Général<br/>(Assiduité, retards, sanctions mineures)"]
        CAISSIER["Caissier / Gestionnaire Financier<br/>(Encaissement minerval, reçus, arrêtés)"]
    end

    PERSONNEL --> PROM & DIR & PREF
    PERSONNEL --> PROF_TIT & PROF_DISC
    PERSONNEL --> SEC_ACAD & DIR_DISC & CAISSIER
```

---

## 3. Mécanisme d'Affectation Dynamique (Contextual Claims)

Un personnel ne dispose pas de droits abstraits ou universels : ses privilèges sont rigoureusement circonscrits à son établissement d'affectation et aux classes qui lui sont assignées.

### 3.1 Structure du Claim d'Affectation dans Firebase Auth
```json
{
  "role": "PROF_DISCIPLINE",
  "etablissement_id": "etab-kin-gomb-0012",
  "affectations": [
    {
      "classe_id": "cls-6e-sc-A",
      "matiere_id": "mat-chimie-6",
      "annee": "2025-2026"
    },
    {
      "classe_id": "cls-5e-sc-B",
      "matiere_id": "mat-chimie-5",
      "annee": "2025-2026"
    }
  ],
  "date_fin_validite": "2026-08-31T23:59:59Z"
}
```

---

## 4. Règles d'Incompatibilité et Séparation des Fonctions (SoD)

Pour garantir l'intégrité de l'institution et prévenir les fraudes ou conflits d'intérêts :

| Rôle Primaire | Rôles Strictement Incompatibles (Cumul Interdit) | Justification Institutionnelle |
|---|---|---|
| **Caissier / Comptable** | Professeur Titulaire, Préfet des Études | Étanchéité absolue Pédagogie / Finances (Article 5) |
| **Préfet des Études** | Caissier, Auditeur de Sécurité DPO | Séparation du pouvoir décisionnel et du contrôle |
| **Professeur de Discipline** | Inspecteur Provincial de sa propre discipline | Conflit d'intérêts flagrant en cas de recours ou audit |

---

## 5. Workflow de Mutation et Changement d'Affectation

```mermaid
sequenceDiagram
    participant SG as Préfet / Directeur Provincial
    participant SYS as admin-service (Cloud Run)
    participant FA as Firebase Auth
    participant SQL as Cloud SQL
    participant PROF as Personnel Enseignant

    SG->>SYS: Saisie de l'arrêté de mutation / affectation
    SYS->>SQL: Clôture de l'affectation active (date_fin = NOW())
    SYS->>SQL: Création de la nouvelle affectation (statut = EN_ATTENTE_PRISE_FONCTION)
    SYS->>FA: Révocation immédiate des Custom Claims sur l'ancienne école
    SYS->>FA: Injection des nouveaux claims d'affectation
    SYS->>PROF: Notification d'affectation officielle par Push FCM & Email
    PROF->>SYS: Première connexion dans la nouvelle école (prise de fonction certifiée)
    SYS->>SQL: Bascule statut = 'ACTIF'
```

---

## 6. Verrous Fonctionnels

| ID | Règle | Niveau |
|---|---|---|
| VF-195-01 | Interdiction absolue du cumul des rôles pédagogique et caissier (Art. 5) | CONSTITUTIONNEL |
| VF-195-02 | Les privilèges d'accès expirent automatiquement à la date de fin d'année scolaire | OBLIGATOIRE |
| VF-195-03 | L'affectation d'un enseignant requiert son numéro de matricule SECOPE officiel | LÉGAL |
| VF-195-04 | Révocation immédiate des droits (< 30s) en cas de suspension de personnel | TECHNIQUE |
| VF-195-05 | Journalisation WORM de toute modification de la grille des droits d'affectation | OBLIGATOIRE |
| VF-195-06 | Toute opération administrative est réversible jusqu'à validation humaine explicite par le responsable hiérarchique | OBLIGATOIRE |

---

*Sous-tome rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*
