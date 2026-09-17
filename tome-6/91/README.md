# TOME 6 — EXPÉRIENCE UTILISATEUR ET DESIGN SYSTEM
## 91. Parcours Utilisateur — Parent ou Responsable Légal

---

> **Positionnement :** Interface d'accompagnement familial, de suivi éducatif et de gestion financière des frais scolaires  
> **Autorité :** Conforme à la Constitution ELLYSIUM (Art. 3 — Protection des mineurs, Art. 5 — Étanchéité Pédagogie / Finances) et au Tome 5, Modules 70, 71  
> **Liaison amont :** Modules 57, 58, 60, 65, 68, 71 (Caisse d'établissement) | **Liaison aval :** Module 96 (Navigation), Module 98 (Composants)

---

## 1. Objet et Portée du Sous-Tome

Le parent ou tuteur légal est le garant moral et financier de la scolarité de l'enfant mineur. Souvent contraint par des journées de travail chargées et une connectivité mobile intermittente, il a besoin d'une interface épurée, sans jargon technique, lui permettant de veiller sur la régularité des présences, les résultats scolaires et d'effectuer le paiement sécurisé des frais d'études par Mobile Money sans se déplacer physiquement à l'école.

---

## 2. Spécificités Ergonomiques Fondamentales

```mermaid
graph TD
    PARENT["ESPACE PARENT / RESPONSABLE"]
    PARENT --> C1["Bascule Multi-Enfants Instantanée\n(Un seul compte parent supervise tous les enfants scolarisés\ndans des classes ou écoles partenaires différentes)"]
    PARENT --> C2["Alertes SMS & Push Proactives\n(Notification en temps réel dès signalement d'absence le matin)"]
    PARENT --> C3["Paiement Mobile Money en 3 Étapes\n(M-Pesa, Orange Money, Airtel Money avec reçu numérique certifié)"]
    PARENT --> C4["Étanchéité Pédagogique Garantie\n(Transparence totale des finances sans pénaliser l'apprentissage de l'enfant)"]
```

---

## 3. Cartographie du Parcours Utilisateur Parent

```mermaid
stateDiagram-v2
    [*] --> CONNEXION_PARENT : N° Téléphone + Code PIN
    CONNEXION_PARENT --> SELECT_ENFANT : Sélecteur de profil (si fratrie)
    SELECT_ENFANT --> VUE_SYNTHETIQUE : Tableau de bord de l'enfant sélectionné
    
    state VUE_SYNTHETIQUE {
        [*] --> ETAT_PRESENCE_JOUR : Présence ce matin (Vert / Alerte)
        ETAT_PRESENCE_JOUR --> DERNIERES_NOTES : Interrogations récentes
        DERNIERES_NOTES --> SITUATION_FINANCIERE : Frais payés / reste à payer
    }
    
    VUE_SYNTHETIQUE --> REGLEMENT_FRAIS : Clic "Payer les frais"
    REGLEMENT_FRAIS --> MOBILE_MONEY_PROMPT : Push USSD sur le téléphone
    MOBILE_MONEY_PROMPT --> RECU_OFFICIEL : Téléchargement reçu numéroté
    
    VUE_SYNTHETIQUE --> DIALOGUE_ECOLE : Carnet de correspondance
    DIALOGUE_ECOLE --> PRISE_RDV : Demande d'audience avec le Préfet/Titulaire
    RECU_OFFICIEL --> [*]
    PRISE_RDV --> [*]
```

---

## 4. Phase 1 — Connexion et Gestion de la Fratrie (Multi-Profil)

### 4.1 Sélecteur de Fratrie (Carousel d'enfants)

**Règle UX-91-01** : En tête de l'écran d'accueil parent, un carrousel horizontal affiche chaque enfant avec sa photo, son prénom, son école et sa classe actuelle. Un simple glissement ou tapotement permet de commuter l'intégralité du tableau de bord d'un enfant à l'autre sans rechargement de page.

```
+-------------------------------------------------------------+
| [Photo Gloire]            | [Photo Divine]                  |
| Gloire (15 ans)           | Divine (11 ans)                 |
| 3e Sc. - Institut Lumumba | 7e EB - Complexe Boboto         |
| [ ACTIF (Sélectionné) ]   | [ Tapoter pour basculer ]       |
+-------------------------------------------------------------+
```

---

## 5. Phase 2 — Suivi des Présences et Alertes Immédiates

### 5.1 Alerte Absence en Temps Réel

Dès que le professeur titulaire valide l'appel du matin avec une mention *Absent* :
1. Déclenchement d'un SMS prioritaire :  
   *« ELLYSIUM ALERTE : Gloire a été signalé absent ce matin à 07h45 à l'Institut Lumumba. Si cette absence est prévue, veuillez la justifier dans l'application. »*
2. Notification push enrichie dans l'application.

**Règle UX-91-02** : Le parent peut transmettre un justificatif d'absence en deux tapotements : choix du motif (Maladie, Deuil familial, Problème de transport) + ajout facultatif d'une photo de certificat médical.

---

## 6. Phase 3 — Consultation des Notes et Bulletins Périodiques

### 6.1 Lisibilité bienveillante des résultats

- Affichage des notes avec codes couleur rassurants (Vert $\ge 60\%$, Jaune $50-59\%$, Rouge $< 50\%$).
- Graphique d'évolution périodique de l'enfant montrant sa progression par rapport aux périodes précédentes.
- Consultation et téléchargement du bulletin officiel signé numériquement.

**Règle UX-91-03** : Le bulletin est toujours consultable et téléchargeable par le parent dès sa publication officielle par l'école, que les frais scolaires soient totalement réglés ou non.

---

## 7. Phase 4 — Caisse Scolaire et Règlement Mobile Money

### 7.1 Tunnel de paiement sécurisé en 3 clics

```mermaid
sequenceDiagram
    participant P as Parent
    participant APP as ELLYSIUM App
    participant GW as Passerelle Mobile Money
    participant OP as Opérateur (M-Pesa/Orange/Airtel)

    P->>APP: Choisit la tranche (ex. Minerval T2 : 45 USD / CDF équivalent)
    APP->>P: Récapitulatif net (taux du jour officiel affiché)
    P->>APP: Sélectionne "Payer par M-Pesa" + saisit n° payeur
    APP->>GW: Requête d'initiation USSD push
    GW->>OP: Déclenche popup PIN sur le téléphone du parent
    P->>OP: Saisit son code secret Mobile Money sur son écran
    OP->>GW: Confirmation débit immédiate
    GW->>APP: Événement webhook paiement validé
    APP->>P: Reçu officiel généré CD-REC-2025-XXXXX + Notification SMS
```

**Règle UX-91-04** : Le reçu de caisse émis est téléchargeable hors-ligne au format PDF/A sécurisé avec QR code vérifiable, prouvant juridiquement la libération de la dette scolaire.

---

## 8. Verrous Fonctionnels et Règles Métier

| Réf. | Intitulé | Conséquence en cas de transgression |
|---|---|---|
| **VF-91-01** | Étanchéité financière absolue | Aucun retard de paiement d'un parent ne peut entraîner l'exclusion numérique de l'enfant, la coupure des cours ou le refus d'affichage des devoirs (Constitution, Art. 5). |
| **VF-91-02** | Confidentialité stricte des fratries | Les informations d'un enfant ne sont visibles que par les personnes légalement autorisées enregistrées sur son dossier (pas de fuite inter-familles). |
| **VF-91-03** | Traçabilité légale des transactions financières | Chaque transaction Mobile Money est enregistrée avec sa référence opérateur unique, garantissant le non-répudiement comptable. |

---

## 9. Modèle Conceptuel de Données (MCD) — Espace Parent

```mermaid
erDiagram
    RESPONSABLE_LEGAL {
        string identifiant_parent PK
        string nom
        string prenom
        string telephone_principal
        string telephone_secondaire
        string adresse_residence
    }

    LIEN_FAMILIAL {
        uuid id PK
        string identifiant_parent FK
        string iune_enfant FK
        string nature_lien "PERE | MERE | TUTEUR_LEGAL"
        bool est_contact_d_urgence
        bool est_payeur_principal
    }

    TRANSACTION_PAIEMENT {
        string reference_recu PK "CD-REC-YYYY-NNNNNN"
        string iune_enfant FK
        string identifiant_parent FK
        float montant_paye
        string devise "USD | CDF"
        string moyen_paiement "MPESA | ORANGE_MONEY | AIRTEL_MONEY | BANQUE"
        string reference_operateur
        timestamp horodatage_paiement
        string statut "VALIDE | EN_ATTENTE | REJETE"
    }

    RESPONSABLE_LEGAL ||--o{ LIEN_FAMILIAL : "est lié à"
    RESPONSABLE_LEGAL ||--o{ TRANSACTION_PAIEMENT : "effectue"
```

---

*Sous-tome rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*  
*Version 1.0 — Référence : ELLYSIUM/T6/91/v1.0*
