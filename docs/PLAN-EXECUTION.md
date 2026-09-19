# PLAN D'EXÉCUTION ELLYSIUM — Feuille de route opérationnelle
> Version 1.0 — 17/09/2026 · Conforme : Constitution Art. 1 bis, Doctrine GCP, Fondations 04, Tome 16 (Phases 0–3)
> **Base de départ mesurée :** spécifications ≈ 87 % · chantier global ≈ 13,5 % · code applicatif : 0 %

---

## 1. PRINCIPE DE DIVISION DU TRAVAIL (règle permanente)

| Piste | Responsable | Contenu |
|---|---|---|
| **PISTE IA** (ce dépôt) | Agent IA (Cline) | Tout ce qui est exécutable numériquement : rédaction/consolidation documentaire, backlog d'ingénierie, squelettes de code et CI/CD, catalogue de leçons, brouillons de leçons (soumis à validation humaine), scripts de contrôle, tableaux de suivi |
| **PISTE HUMAINE** (hors dépôt) | Promoteur + équipes | Immatriculation ASBL, agréments/autorisations EPST–ESU, partenariats écoles & ministères, compte bancaire et facturation GCP, recrutement, laboratoire physique de Kinshasa, validation didactique des contenus |

Règle : **l'IA ne déclare jamais accompli un travail humain**, et réciproquement. Chaque livrable porte son responsable.

---

## 2. ÉTAT DES LIEUX VÉRIFIÉ (baseline 17/09/2026)

- 282/282 modules (55–336) rédigés ; 1 422/1 680 verrous VF (M001–M054 non unitarisés) ;
- tomes 11–14 : statuts « EN COURS » à consolider ; module 228 « en cours » ;
- **0 ligne de code applicatif** ; 0 projet GCP ; 0 leçon rédigée ; ASBL non immatriculée.

---

## 3. PLAN SÉQUENCÉ (chemin vers la mise en production)

### SÉQUENCE 0 — Clôture BLOC A  *(IA — 2 à 4 semaines)*
0.1 Consolider les statuts des tomes 11–14 et du module 228.  *(IA)*
0.2 Découper M001–M054 en modules unitaires + baliser les ~258 verrous manquants → 1 680/1 680.  *(IA)*
0.3 Scellement officiel du BLOC A après `tools/verify-corpus.sh` vert + revue humaine.  *(IA + Promoteur)*

### SÉQUENCE 1 — Montage du chantier  *(semaines 1–6)*
1.1 Immatriculation ASBL (statuts = Tome 19).  **(HUMAIN — bloque le reste)**
1.2 Compte Google Cloud organisationnel + facturation + 3 projets (dev/staging/prod).  **(HUMAIN + IA : préparation IaC)**
1.3 Monorepo code + CI Cloud Build + Terraform provider GCP.  *(IA — squelettes livrés)*
1.4 Recrutement équipe cœur : 4–6 devs, 1 SRE, 1 QA, 1 designer.  **(HUMAIN)**

### SÉQUENCE 2 — Construction MVP PGI  *(mois 1–7 — voir `BACKLOG-MVP.md`, ≈ 520 SP)*
Socle identité/RBAC → établissements → scolarité → présences → cotes → **moteur formule RDC** → bulletins scellés → caisse étanche → examens/diplômes QR → messagerie → PWA hors-ligne + Android. Sécurité transverse T9 + SRE T13 en continu.  *(IA : code + revues ; HUMAIN : arbitrages produit, validation métier)*

### SÉQUENCE 3 — Phase 0 laboratoire  *(mois 7–13 — Module 281)*
Banc Kinshasa (50 postes, WAN 2G/800 ms/25 % perte, coupures électriques) ; cohorte 50 testeurs ; 4 épreuves de certification ; critères de sortie.  *(HUMAIN : labo physique, cohorte — IA : outils de test, jeux de données, correction)*

### SÉQUENCE 4 — Contenus pédagogiques  *(parallèle dès le mois 4)*
4.1 Contenus de test pilote (cours témoins, devoirs formateurs — léger).  *(IA rédige, humains valident)*
4.2 **Catalogue L1 Informatique** : ≈ 200 leçons (voir `CATALOGUE-LECONS-L1-INFORMATIQUE.md`) — chaîne Tome 14 : brouillon IA → validation didactique humaine → publication OER.  *(bloque Phase 2, pas Phase 1)*

### SÉQUENCE 5 — Phase 1 pilote  *(J0 → J+180 — Module 290)*
10 écoles, 2 600 élèves, 100 enseignants ; jalons J+30/60/90/120/150/180 ; **6 feux verts** : rétention ≥ 75 %, réussite ≥ 65 %, NPS ≥ +40, SLA ≥ 99,5 %, zéro violation Art. 5, formule RDC conforme.  *(HUMAIN : terrain — IA : tableaux de suivi)*

### SÉQUENCE 6 — Passage à l'échelle
Phase 2 (filière Informatique, 15 000 apprenants) → Phase 3 (généralisation). Partenariats/accréditation (T15) **(HUMAIN)**.

---

## 4. CHECKLIST PISTE HUMAINE (votre domaine — rien n'est accompli)

- [ ] Dépôt des statuts ASBL + RCCM + compte bancaire *(Tome 19 prêt)*
- [ ] Compte Google Cloud organisationnel + moyen de paiement *(bloque IaC réelle)*
- [ ] Recrutement de l'équipe cœur (fiches de poste disponibles dans Tome 14)
- [ ] Convention avec 10 écoles pilotes de Kinshasa *(Module 282)*
- [ ] Contacts EPST / ESU / Ministère *(Tome 15)* — sans blocage du pilote privé
- [ ] Laboratoire physique : 50 postes hétérogènes + simulateur réseau + onduleurs *(Module 281)*
- [ ] Auteurs/validateurs didactiques pour la chaîne éditoriale *(Tome 14)*

## 5. JALONS DE CONTRÔLE

| Jalon | Critère de sortie | Vérification |
|---|---|---|
| BLOC A scellé | 1 680/1 680 VF, statuts 19/19 | `verify-corpus.sh` + revue |
| MVP code-froid | Backlog 0 ouvert critique, démos des 29 domaines | Revue COPIL (M280) |
| Sortie labo | 4 épreuves du M281 réussies | PV de certification |
| J+180 | 6 feux verts du M290 | Décision COPIL Go/No-Go |
