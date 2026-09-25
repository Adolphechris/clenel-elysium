# TOME 7 — ARCHITECTURE TECHNIQUE ET INTEROPÉRABILITÉ
## 123. Interopérabilité — Systèmes Comptables OHADA et Exports Financiers

---

> **Positionnement :** Passerelles financières, génération des Fichiers des Écritures Comptables (FEC) et conformité SYSCOHADA  
> **Autorité :** Conforme à l'Acte Uniforme OHADA relatif au Droit Comptable et à l'Information Financière  
> **Liaison amont :** Module 71 (Caisse d'établissement), Module 122 (Mobile Money) | **Liaison aval :** Module 127 (Environnements)

---

## 1. Objet et Portée du Sous-Tome

Les établissements scolaires et universitaires partenaires d'ELLYSIUM tiennent leur comptabilité générale selon le référentiel juridique du **SYSCOHADA Révisé**. Pour éviter aux comptables et gestionnaires d'écoles une double saisie fastidieuse et source d'erreurs, le module financier d'ELLYSIUM doit exporter automatiquement l'ensemble des écritures d'encaissement et de facturation vers les logiciels de comptabilité du marché (Sage Saari, Tompro, Odoo, QuickBooks). Ce sous-tome spécifie les formats d'échanges et les règles d'intégrité comptable.

---

## 2. Plan Comptable Général OHADA pour Établissement Scolaire

Le système génère des écritures conformes aux numéros de comptes normalisés du SYSCOHADA :

| Compte OHADA | Intitulé Officiel | Nature des Écritures Générées |
|---|---|---|
| **411 100** | Clients / Usagers — Frais Scolaires | Débité lors de l'émission de la facture de minerval |
| **521 100** | Banques Locales (USD / CDF) | Débité lors d'un virement ou dépôt bancaire validé |
| **571 100** | Caisse Espèces Établissement | Débité lors d'un versement en numéraire à l'intendance |
| **578 100** | Portefeuilles Mobile Money (M-Pesa, Orange, Airtel) | Débité lors d'un encaissement validé par webhook opérateur |
| **706 100** | Prestations de Services — Frais d'Études et Minerval | Crédité en contrepartie de la constatation du droit d'études |
| **706 200** | Frais d'Examens d'État / Épreuves Spécifiques | Crédité lors de l'enrôlement aux sessions officielles |

---

## 3. Schéma Comptable Automatisé d'un Règlement Mobile Money

Lorsqu'un parent règle une tranche de 50 USD par Vodacom M-Pesa :

```
Écriture comptable journalière générée :
Journal : BQ_MPESA (Banque / Monnaie Électronique)
Date    : 2025-09-17
Pièce   : CD-REC-2025-08149
-------------------------------------------------------------------------
Compte Débité  : 578100 (Portefeuille M-Pesa Marchand)  --> 50.00 USD
Compte Crédité : 411100 (Compte Usager - Gloire K.)     --> 50.00 USD
Libellé        : Règlement Minerval T1 - IUNE CD-EL-2025-01428590
```

---

## 4. Spécifications du Fichier des Écritures Comptables (FEC OHADA)

Le système génère sur demande mensuelle ou annuelle le fichier plat normalisé (délimiteur tabulation, encodage UTF-8) prêt pour l'import dans Sage Saari ou Tompro :

```tsv
JournalCode	JournalLib	EcritureNum	EcritureDate	CompteNum	CompteLib	CompAuxNum	PieceRef	PieceDate	EcritureLib	Debit	Credit	Devise
VT	VENTES	ECR-001	20250917	411100	Clients Usagers	CD-EL-0142	FAC-2025-01	20250917	Minerval T1	50.00	0.00	USD
VT	VENTES	ECR-001	20250917	706100	Prestations Etudes		FAC-2025-01	20250917	Minerval T1	0.00	50.00	USD
BQ	MPESA	ECR-002	20250917	578100	Mobile Money Mpesa		REC-2025-01	20250917	Reglt Gloire K	50.00	0.00	USD
BQ	MPESA	ECR-002	20250917	411100	Clients Usagers	CD-EL-0142	REC-2025-01	20250917	Reglt Gloire K	0.00	50.00	USD
```

---

## 5. Rapprochement Bancaire et Apurement des Comptes Transitoires

**Règle TECH-123-01** : Les commissions prélevées à la source par les opérateurs télécoms (généralement 1 à 2 %) font l'objet d'un lettrage automatique immédiat :
- Débit du compte de charges financières `631 300` (Frais sur services financiers électroniques).
- Crédit du compte d'attente opérateur `578 100`, assurant un solde de trésorerie net exactement aligné avec l'argent disponible sur le compte bancaire de compensation de l'école.

---

## 6. Verrous Techniques Comptables

| Réf. | Intitulé | Conséquence en cas de transgression |
|---|---|---|
| **VF-123-01** | Principe d'intangibilité des écritures clôturées | Une écriture comptable exportée ou rattachée à une période clôturée est inaltérable. Toute correction ultérieure exige une écriture d'extourne (contre-passation) traçable. |
| **VF-123-02** | Équilibre strict Débit/Crédit | Aucun lot d'écritures ne peut être validé ou exporté si la somme exacte des débits ne coïncide pas au centime près avec la somme exacte des crédits ($\sum \text{Débits} - \sum \text{Crédits} = 0$). |

---

*Sous-tome rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*  
*Version 1.0 — Référence : ELLYSIUM/T7/123/v1.0*

---

## 7. Verrous Fonctionnels Critiques

| Réf. Verrou | Description Fonctionnelle et Technique | Conséquence en Cas de Violation |
| :--- | :--- | :--- |
| **`VF-123-03`** | **Basculement transparent entre régions GCP** | Aucune interruption visible pour l'utilisateur lors d'un failover régional. |
| **`VF-123-04`** | **Politique de rétention des snapshots de base de données** | Conservation de 30 snapshots journaliers et 12 snapshots mensuels. |
| **`VF-123-05`** | **Test de reprise après sinistre (DR Test) annuel** | Simulation de perte totale de la région primaire avec objectif RTO < 4h. |
| **`VF-123-06`** | **Toute réponse d'API cache doit être invalidée via Cloud CDN purge sur écriture critique** | **Conséquence : violation = inéligibilité du module pour mise en production** |

---

*Sous-tome rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*
