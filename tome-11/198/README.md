# Module 198 — Gestion Administrative des Élèves, Étudiants et Enseignants

> **Positionnement :** Tome 11 — Administration et Communication Interne · Module 198 sur 210
> **Autorité :** Direction des Ressources Humaines / Direction de la Scolarité
> **Liaison amont/aval :** ← Module 197 (Inscriptions) → Module 199 (Calendriers) →

---

## 1. Objet

Ce module régit le suivi administratif continu, la tenue des dossiers individuels, le contrôle d'assiduité, la gestion de la discipline et l'actualisation des pièces administratives pour les trois populations clés de la communauté éducative : les élèves de l'éducation de base et des humanités (EPST), les étudiants de l'enseignement supérieur (ESU), et le corps professoral et enseignant.

---

## 2. Dossier Administratif Permanent par Profil

### 2.1 Élèves du Secondaire & Primaire (EPST)
- **Filiation & Tuteur Référent** : Nom, téléphone, adresse, profession, numéro d'identité du parent/tuteur.
- **Registre des Présences et Retards** : Saisie quotidienne en classe (< 90 secondes, Module 90).
- **Historique Disciplinaire** : Avertissements, blâmes, retenues, exclusions temporaires (motivées et visées par le Préfet).
- **Suivi Sanitaire & Aménagements** : Allergies, troubles visuels/auditifs, autorisations d'urgence.

### 2.2 Étudiants du Supérieur (ESU — LMD)
- **Curriculum Vitae Académique** : Relevé permanent des 180 ou 300 crédits ECTS capitalisés.
- **Stage et Professionnalisation** : Conventions de stage signées, attestations de présence en entreprise.
- **Affiliation Sécurité Sociale / Mutuelle Étudiante**.

### 2.3 Corps Enseignant (Professeurs Titulaires & Chargés de Cours)
- **Matricule SECOPE Officiel** : Référence d'identification auprès du Ministère de l'Éducation Nationale.
- **Titres et Diplômes Homologués** : Copies scannées des diplômes universitaires, certificats pédagogiques.
- **Volume Horaire et Charge Hebdomadaire** : Nombre d'heures prestées, classes prises en charge, états d'émargement.
- **Évaluations Pédagogiques** : Rapports de visite d'inspection, synthèses d'appréciation des auditeurs.

---

## 3. Gestion Dématérialisée de l'Assiduité et des Absences

```mermaid
flowchart TD
    APPEL["📱 Appel Numérique en Classe<br/>(Enseignant via Mobile ou Tablette < 90s)"]
    ABSENCE{"Statut de l'Élève"}
    
    ABSENCE -->|Présent| OK["✅ Enregistrement Silencieux"]
    ABSENCE -->|Retard| RETARD["⏱️ Enregistrement du Retard (Minutes)"]
    ABSENCE -->|Absent| ALERTE["🚨 Déclenchement Automatique Alerte"]
    
    ALERTE --> NOTIF["📢 Notification SMS / Push FCM Immédiate au Tuteur<br/>(Moins de 5 minutes après début du cours)"]
    NOTIF --> JUSTIF{"Justificatif Transmis ?"}
    
    JUSTIF -->|OUI (Certificat médical)| VALIDE["🟢 Absence Justifiée (ABJ)"]
    JUSTIF -->|NON (Sans motif)| NON_VALIDE["🔴 Absence Injustifiée (ABS)<br/>Impact sur le seuil légal de 15% d'absentéisme"]
```

---

## 4. Seuil Légal d'Assiduité et Conséquences Réglementaires

En conformité avec le règlement général des études en RDC :
- Tout élève ou étudiant cumulant plus de **15 % d'absences non justifiées** sur un trimestre ou un semestre est automatiquement exclu du droit de se présenter à la première session d'examen ordinaire.
- Le système émet une alerte automatique à l'attention du Préfet et des parents lorsque le cumul atteint 10 % d'heures manquées.

---

## 5. Modèle de Données d'Assiduité (Cloud SQL)

```sql
CREATE TABLE presences_cours (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seance_id               UUID NOT NULL REFERENCES seances_cours(id),
    eleve_id                UUID NOT NULL REFERENCES users(id),
    statut_presence         TEXT NOT NULL CHECK (statut_presence IN ('PRESENT', 'RETARD', 'ABSENT_NON_JUSTIFIE', 'ABSENT_JUSTIFIE')),
    retard_minutes          INTEGER DEFAULT 0,
    motif_justification     TEXT,
    justificatif_uri        TEXT,
    enregistre_par          UUID NOT NULL REFERENCES users(id),
    horodatage_appel        TIMESTAMPTZ DEFAULT NOW(),
    notifie_tuteur          BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_presences_eleve ON presences_cours (eleve_id, statut_presence);
```

---

## 6. Verrous Fonctionnels

| ID | Règle | Niveau |
|---|---|---|
| VF-198-01 | Alerte tuteur obligatoire par SMS/Push en moins de 5 minutes après constat d'absence | OBLIGATOIRE |
| VF-198-02 | Seuil légal des 15% d'absences calculé automatiquement par tâche planifiée | CONSTITUTIONNEL |
| VF-198-03 | L'appel en classe doit s'effectuer en moins de 90 secondes sur l'interface mobile | ERGONOMIE (SLO) |
| VF-198-04 | Impossibilité pour un enseignant de modifier l'appel passé plus de 2 heures auparavant | SÉCURITÉ |
| VF-198-05 | Protection des données de santé : motifs médicaux réservés au dossier confidentiel | LÉGAL |

---

*Sous-tome rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*
