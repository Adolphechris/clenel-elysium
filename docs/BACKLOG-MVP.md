# BACKLOG MVP — PGI ELLYSIUM (Pilote 10 écoles)
> Dérivé des modules fonctionnels 55–83 (Tome 5), T9/T10/T12/T13. Unité : SP ≈ 1 jour-personne.
> Statuts : TODO / WIP / DONE. Dépendances notées →. Total MVP : **≈ 520 SP** (≈ 25 mois-homme) — équipe de 5 : ~4–5 mois.

## E0 — Fondations techniques (34 SP) *(IA : squelettes fournis)*
- PGI-E001 Monorepo + CI Cloud Build (lint, tests, build) — T13/232 · 5 SP
- PGI-E002 Terraform GCP : projets, Cloud Run, Cloud SQL HA, GCS, Memorystore, Pub/Sub — T13/230–232 · 10 SP
- PGI-E003 Envs dev/staging/prod + secrets Secret Manager — T13/232, T7/127 · 5 SP
- PGI-E004 Observabilité (Cloud Monitoring/Logging/Trace, alertes SLO) — T13/234 · 8 SP
- PGI-E005 Posture sécurité : CMEK, WORM, journalisation immuable — T9/158,161 · 6 SP

## E1 — Identité, accès, RBAC/ABAC (46 SP) *(M58, M80, T7/117)*
- Auth Firebase + JWT/mTLS, sessions révocables (M58) · 12 SP
- Rôles et permissions fines RBAC/ABAC : élève, enseignant, direction, parent, admin (M80) · 18 SP
- Entonnoir d'accès unifié (parcours Établissement / Personne) (M58) · 10 SP
- Tests d'intrusion basiques IAM + audit des accès (T9) · 6 SP

## E2 — Établissements & scolarité (58 SP) *(M59–M64)*
- Multi-tenant création/configuration établissement (M61) · 12 SP
- Inscriptions & admissions (M59) · 10 SP
- Dossier numérique unifié élève/étudiant/enseignant (M60) · 12 SP
- Classes, promotions, groupes (M62) · 8 SP
- Paramétrage pédagogique : matières, coefficients, référentiels (M63) · 10 SP
- Emploi du temps (M64) · 6 SP (version pilote simplifiée)

## E3 — Cœur pédagogique (72 SP) *(M65–M69)*
- Cahier de présence & assiduité (M65) · 10 SP
- Cahier des cotes (M66) + saisie hors-ligne · 14 SP
- **Moteur formule RDC déterministe** (M67) + batterie 100 000 combinaisons (M281) · 16 SP
- Bulletins & relevés scellés PDF/A + QR (M68) · 18 SP
- Devoirs & travaux à rendre (M69) · 14 SP

## E4 — Examens, jurys, diplômes (44 SP) *(M75, M76, T10)*
- Organisation examens & jurys (M75) · 16 SP
- Délivrance diplômes/attestations infalsifiables : hachage + QR vérifiable (M76) · 20 SP
- Vérification publique d'authenticité d'un document (T10) · 8 SP

## E5 — Caisse étanche (28 SP) *(M71, Art. 5)*
- Module caisse : frais, reçus, échéancier (M71) · 16 SP
- Séparation absolue caisse/pédagogie + test d'étanchéité (M281 §4.1.3) · 8 SP
- Exports comptables OHADA (M123) · 4 SP

## E6 — Communication (22 SP) *(M70)*
- Messagerie interne + notifications FCM (M70) · 14 SP
- Annonces direction → classes/parents · 8 SP

## E7 — Clients : PWA hors-ligne + Android (86 SP) *(T12, T7/112–113)*
- PWA : Service Workers, IndexedDB, cache prédictif (T7/112) · 24 SP
- Sync différentielle chiffrée + résolution de conflits (T12) · 24 SP
- Mode avion : consultation 10 modules + passation 5 évaluations déconnectées (M281) · 16 SP
- App Android (Flutter) minimale pilote (T7/113) · 22 SP

## E8 — Tuteur IA encadré (24 SP) *(M74, T8 — post-MVP optionnel pilote)*
- Interfaces tuteur + garde-fous éthiques (M74) · 12 SP
- RAG strict sur corpus fermé via Vertex AI/Gemini (T8) · 12 SP

## E9 — Tableaux de bord & BI (20 SP) *(M77)*
- Dashboards direction/enseignant (M77) · 12 SP
- Export BigQuery + rapports (T11) · 8 SP

## E10 — SRE & continuité (36 SP) *(T13)*
- PCA/PRA + sauvegardes 3-2-1 (M236–237) · 10 SP
- Tests charge/stress (objectif pilote : 1 000 req/s ; cible produit 65 000) (M240) · 12 SP
- Chaos engineering : bascule zone Cloud Run / réplica Cloud SQL (M281) · 14 SP

## HORS MVP (Phase 2+) : M72 RH complet, M73 OER complet, M78 API partenaires, M81 exceptions/transferts complets, M82 synchronisation fine, T11 analytique avancé.

## RÈGLES D'EXÉCUTION
1. Chaque ticket cite ses verrous VF d'origine — un ticket n'est DONE que si les verrous sont satisfaits (trace dans la PR).
2. CI obligatoire : tests unitaires + lint + scan avant merge (M241).
3. Aucune donnée réelle d'élève avant sortie de Phase 0 (M281).
4. Tout composant = écosystème Google exclusif (Art. 1 bis) — vérifié par `verify-corpus.sh` côté docs et par lint d'imports côté code.
