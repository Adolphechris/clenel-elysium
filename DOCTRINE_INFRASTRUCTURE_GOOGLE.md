# 🔱 DOCTRINE D'INFRASTRUCTURE IMMUABLE — ELLYSIUM / CNEL
## Acte Fondateur — Décret d'Architecture Souveraine

---

> **INSCRIT EN MARBRE — INTANGIBLE — OPPOSABLE À TOUT INTERVENANT**
>
> Ce document constitue la **loi suprême technique** du projet ELLYSIUM / CNEL.
> Aucune décision d'architecture, aucun choix d'outil, aucune ligne de code,
> aucune configuration d'infrastructure ne peut contredire les présentes dispositions.
> Tout intervenant — développeur, architecte, DevOps, consultant, IA — est tenu de
> lire, comprendre et respecter scrupuleusement ce document avant toute contribution.

---

## ARTICLE 1 — DÉCLARATION SOLENNELLE D'INFRASTRUCTURE EXCLUSIVE GOOGLE

**Le projet ELLYSIUM / CNEL est, a toujours été, et restera EXCLUSIVEMENT déployé
sur l'écosystème Google Cloud Platform (GCP) dans sa totalité.**

Il n'y a pas de dérogation. Il n'y a pas d'exception. Il n'y a pas de "cas particulier".

> *"Ce chantier est et restera et sera déployé et mis en production
> EXCLUSIVEMENT dans un environnement GOOGLE."*
> — **Directive fondatrice du Promoteur, inscrite en marbre le 17 septembre 2026**

Toute référence à une infrastructure concurrente (AWS, Azure, Hetzner, OVH, Scaleway,
K3s bare-metal, MinIO auto-hébergé, NATS self-hosted, ou tout autre cloud tiers)
est **nulle et non avenue** dans ce projet.
---

## ARTICLE 1 BIS — RÈGLE D'OR : « GOOGLE ET GOOGLE UNIQUEMENT » (Amendement du 17/09/2026)

**Par directive écrite et irrévocable du Promoteur, l'écosystème ELLYSIUM est GOOGLE,
et GOOGLE UNIQUEMENT.** Cette règle vaut pour l'intégralité de la chaîne de valeur technique :

1. **Infrastructure & runtime** : GKE Autopilot, Cloud Run, Cloud Functions, Compute Engine — rien d'autre.
2. **Données & stockage** : Cloud SQL, Cloud Spanner, Cloud Storage (GCS), Firestore, Memorystore, BigQuery.
3. **Intelligence artificielle** : Vertex AI, Model Garden, Gemini API, Vector Search, Document AI.
4. **Identité & sécurité** : Firebase Authentication, Cloud Identity, Cloud KMS/EKM, Secret Manager, Cloud Armor.
5. **Réseau & diffusion** : Cloud CDN, Cloud Load Balancing, Cloud DNS, VPC, Certificate Manager.
6. **Observabilité** : Cloud Monitoring, Cloud Logging, Cloud Trace, Error Reporting.
7. **Productivité & collaboration** : Google Workspace (Gmail, Drive, Docs, Meet, Calendar, Forms).
8. **Cartographie & interfaces** : Google Maps Platform, reCAPTCHA Enterprise.
9. **Analytics & BI** : BigQuery, Looker Studio, GA4.
10. **Chaîne de développement** : Cloud Build, Cloud Deploy, Artifact Registry, Cloud Workstations, Cloud Code, Gemini Code Assist.
11. **Mobile & web clients** : Firebase (Hosting, FCM, Crashlytics, Test Lab, App Distribution).

### Table de Transposition Normative (obligatoire dans tout le corpus)

Toute mention d'une technologie auto-hébergée ou tierce héritée des anciennes spécifications
est **nulle et non avenue en tant qu'infrastructure** et doit être lue comme suit :

| Mention héritée dans le corpus | Équivalent Google OBLIGATOIRE |
|---|---|
| Redis (cache, files, sessions) | **Cloud Memorystore pour Redis** |
| MinIO / stockage S3 auto-hébergé | **Cloud Storage (GCS)** |
| NATS / NATS JetStream | **Cloud Pub/Sub** |
| K3s / Kubernetes self-hosted / bare-metal | **GKE Autopilot** |
| Prometheus | **Cloud Monitoring** |
| Grafana | **Tableaux de bord Cloud Monitoring / Looker Studio** |
| Loki / ELK / Elastic Stack | **Cloud Logging** |
| Jaeger | **Cloud Trace** |
| OpenTofu / Terraform (provisioning) | **Terraform avec provider Google Cloud** (Art. 6.1) ou **Infrastructure Manager** |
| Ansible (configuration d'OS) | **OS Config / Patch Management (Google Cloud)** |
| ArgoCD (GitOps) | **Cloud Deploy** |
| SonarQube (qualité de code) | **Gemini Code Assist + Cloud Build** |
| HashiCorp Vault | **Secret Manager + Cloud KMS** |
| Keycloak / Auth0 | **Firebase Authentication / Cloud Identity** |
| Jitsi / BigBlueButton | **Google Meet API** |
| Vercel / Netlify / Cloudflare Pages | **Firebase Hosting** |
| DockerHub (registry finale) | **Artifact Registry** |
| PostgreSQL / MongoDB auto-hébergés | **Cloud SQL / Firestore** |

**Deux exceptions encadrées, et elles seules :**
- **Stockage embarqué côté client** (SQLite, IndexedDB, caches Service Worker) : il s'agit de
  données locales sur le terminal de l'usager, pas d'infrastructure — autorisé et même exigé
  par la doctrine Local-First (Tome 7).
- **Dépôt des sources sur GitHub** : toléré comme miroir de code uniquement (les Google Cloud
  Source Repositories ayant été retirés du marché), sans aucun compute ni CI associé ;
  toute intégration continue s'exécute **exclusivement sur Cloud Build**.

Les contenus **pédagogiques** (programmes d'études, syllabus) peuvent citer des technologies
tiers comme *objets d'enseignement* ; cette citation ne constitue jamais une autorisation
d'infrastructure.

---

## ARTICLE 2 — CARTOGRAPHIE DES SERVICES GOOGLE AUTORISÉS

---

## ARTICLE 2 — CARTOGRAPHIE DES SERVICES GOOGLE AUTORISÉS

### 2.1 Compute & Orchestration

| Service Google | Rôle dans ELLYSIUM | Remplace |
|---|---|---|
| **Google Kubernetes Engine (GKE Autopilot)** | Orchestration microservices production | K3s bare-metal |
| **Cloud Run** | Microservices serverless, APIs | Pods manuels |
| **Cloud Functions (Gen 2)** | Webhooks, triggers événementiels | Lambda-style auto-hébergé |
| **Compute Engine** | VMs spéciales (HSM, batch lourd) | Bare-metal |

### 2.2 Données & Stockage

| Service Google | Rôle dans ELLYSIUM | Remplace |
|---|---|---|
| **Cloud SQL (PostgreSQL 16)** | Base de données principale managée | PostgreSQL auto-hébergé |
| **Cloud Spanner** | Transactions globales si nécessaire | CockroachDB |
| **Cloud Storage (GCS)** | Fichiers, médias, backups, artefacts | MinIO |
| **Firestore** | Données temps réel, mobile-first | MongoDB auto-hébergé |
| **Memorystore for Redis** | Cache L2 distribué | Redis auto-hébergé |
| **BigQuery** | Analytics, rapports, BI éducative | ClickHouse auto-hébergé |

### 2.3 Intelligence Artificielle & Machine Learning

| Service Google | Rôle dans ELLYSIUM | Remplace |
|---|---|---|
| **Vertex AI** | Hébergement souverain des modèles LLM | vLLM auto-hébergé |
| **Vertex AI Model Garden** | Mistral, Llama 3.1, Gemma — fine-tuning | GPU bare-metal |
| **Firebase AI Logic (Gemini API)** | Tuteur IA côté frontend, mobile | Appels LLM directs |
| **Vertex AI Vector Search** | Recherche sémantique RAG | Qdrant auto-hébergé |
| **Vertex AI Pipelines** | Fine-tuning LoRA, DPO automatisé | Kubeflow self-hosted |
| **Document AI** | Traitement documents officiels | Tesseract OCR local |

### 2.4 Réseau, CDN & Sécurité

| Service Google | Rôle dans ELLYSIUM | Remplace |
|---|---|---|
| **Cloud CDN** | Distribution de contenu mondiale | Varnish / Nginx cache |
| **Cloud Load Balancing** | Répartition de charge globale | HAProxy bare-metal |
| **Cloud Armor** | WAF, protection DDoS, OWASP | ModSecurity self-hosted |
| **Cloud DNS** | Résolution DNS managée | BIND auto-hébergé |
| **VPC & Private Service Connect** | Réseau isolé, sécurisé | Réseau bare-metal |
| **Certificate Manager** | TLS 1.3 automatique | Let's Encrypt manuel |
| **Cloud KMS** | Gestion des clés de chiffrement | HSM logiciel local |
| **Secret Manager** | Secrets, tokens, mots de passe | HashiCorp Vault |

### 2.5 Frontend & Applications Web

| Service Google | Rôle dans ELLYSIUM | Remplace |
|---|---|---|
| **Firebase Hosting** | Landing pages + PWA publique | Nginx statique |
| **Firebase App Hosting** | Backend Next.js / Angular si applicable | Vercel / Netlify |
| **Firebase Authentication** | Auth souveraine (JWT, MFA, RBAC) | Auth0 / Keycloak |
| **Firebase Cloud Messaging (FCM)** | Push notifications mobile + web | FCM self-hosted |
| **Firebase Remote Config** | Feature flags, A/B testing | LaunchDarkly |
| **Firebase Analytics** | Mesure d'usage respectueuse | Mixpanel / Amplitude |

### 2.6 Messaging & Événements

| Service Google | Rôle dans ELLYSIUM | Remplace |
|---|---|---|
| **Cloud Pub/Sub** | Bus d'événements asynchrone | NATS JetStream |
| **Eventarc** | Routage d'événements inter-services | Kafka self-hosted |
| **Cloud Tasks** | Files de tâches différées | Celery / BullMQ |
| **Cloud Scheduler** | CRON jobs managés | Crontab système |

### 2.7 DevOps & Observabilité

| Service Google | Rôle dans ELLYSIUM | Remplace |
|---|---|---|
| **Cloud Build** | CI/CD pipelines | Jenkins / GitLab CI |
| **Artifact Registry** | Docker images, paquets | DockerHub / Nexus |
| **Cloud Deploy** | Déploiement Canary / Blue-Green | Argo CD self-hosted |
| **Cloud Monitoring** | Métriques, SLO, alertes | Prometheus / Grafana |
| **Cloud Logging** | Centralisation des logs | ELK Stack self-hosted |
| **Cloud Trace** | Distributed tracing | Jaeger self-hosted |
| **Error Reporting** | Détection erreurs automatique | Sentry self-hosted |

### 2.8 Workspace & Collaboration

| Service Google | Rôle dans ELLYSIUM | Remplace |
|---|---|---|
| **Google Workspace for Education** | Email institutionnel, Drive, Meet | Nextcloud / Zimbra |
| **Google Meet API** | Classes virtuelles intégrées | Jitsi self-hosted |
| **Google Classroom API** | Interopérabilité LMS (optionnel) | N/A |

---

## ARTICLE 3 — ARCHITECTURE DU SITE PUBLIC (LANDING PAGES)

**Le site public d'ELLYSIUM est hébergé exclusivement sur Firebase Hosting.**

Il est composé de **multiples landing pages belles les unes que les autres**, chacune
ciblant un public précis, avec une expérience visuelle de premier plan.

### 3.1 Pages obligatoires (minimum)

| URL | Audience cible | Objectif |
|---|---|---|
| `/` | Grand public, parents | Page d'accueil principale, hero animé |
| `/apprenant` | Apprenants indépendants | Inscription, bénéfices, gratuité |
| `/ecole` | Directeurs, Promoteurs | Onboarding établissement |
| `/enseignant` | Enseignants | Rejoindre comme professeur |
| `/universite` | Étudiants LMD | ECTS, TFE, portail universitaire |
| `/partenaires` | Institutionnels, ONG, bailleurs | Partenariat et convention |
| `/entreprise` | Employeurs, recruteurs | Vérification diplômes, alternance |
| `/tarifsMineral` | Tous | Transparence minerval / gratuité AIS |
| `/mission` | Tous | Mission, valeurs, Constitution |
| `/presse` | Journalistes, médias | Kit presse, communiqués |
| `/contact` | Tous | Formulaire de contact multilingue |
| `/mentions-legales` | Tous | Mentions légales RDC |

### 3.2 Standards de qualité des landing pages

- **Performance** : Score Lighthouse ≥ 95 sur mobile
- **Accessibilité** : WCAG 2.2 AA minimum (AAA visé)
- **Responsive** : Mobile-first, 360px → 1440px+
- **Multilingue** : Français (principal), Lingala, Swahili, Kikongo, Tshiluba, Anglais
- **Technologies** : Astro / Next.js statique, Tailwind CSS, animations Framer Motion
- **CDN** : Cloud CDN + Firebase Hosting (PoP mondial + présence Africa)
- **Analytics** : Firebase Analytics + Google Analytics 4 (RGPD-conforme)
- **SEO** : SSG (Static Site Generation), balises OG, schema.org, sitemap XML
- **Design** : Bleu Souverain `#0B2545`, Or Académique `#D4AF37`, blanc cassé `#F5F5F0`

### 3.3 Principe de beauté non négociable

> Chaque landing page doit être un chef-d'œuvre visuel digne d'une institution
> nationale de premier rang. Les images, typographies, animations et interactions
> doivent refléter l'excellence et la fierté congolaise.
> **La médiocrité visuelle est prohibée.**

---

## ARTICLE 4 — RÉGIONS GOOGLE CLOUD AUTORISÉES

Pour des raisons de souveraineté des données (Art. 1 Constitution ELLYSIUM)
et de performance réseau (latence Afrique centrale) :

| Priorité | Région GCP | Usage |
|---|---|---|
| **Primaire** | `africa-south1` (Johannesburg) | Données sensibles, production principale |
| **Secondaire** | `europe-west1` (Belgique) | Réplication, backup, Edge |
| **Tertiaire** | `us-central1` (Iowa) | Vertex AI si africa-south1 indisponible |

> **Règle absolue** : Les données personnelles des citoyens congolais ne peuvent
> pas quitter le territoire africain sauf nécessité technique documentée et approuvée.
> Toute réplication hors-Afrique est chiffrée AES-256 + clé gérée par Cloud KMS
> en région africaine.

---

## ARTICLE 4 BIS — SOUVERAINETÉ CRYPTOGRAPHIQUE ET IMMUNITÉ CLOUD ACT SUR GOOGLE CLOUD

Afin de concilier le choix irrévocable de l'infrastructure 100% Google Cloud Platform (GCP) avec l'exigence constitutionnelle de souveraineté des données de la République Démocratique du Congo (Tome 9, Art. 1), ELLYSIUM applique le cadre de **Souveraineté Cryptographique Google Cloud** :

1. **Chiffrement Systématique par Clés Gérées par le Client (CMEK / Cloud EKM)** :
   - L'intégralité des données au repos (Cloud SQL, Firestore, Cloud Storage, BigQuery) est chiffrée en AES-256 via Cloud KMS.
   - Les clés maîtresses de chiffrement (Root Keys) sont contrôlées exclusivement par l'ASBL ELLYSIUM et son autorité de tutelle congolaise via Cloud External Key Manager (Cloud EKM) ou HSM certifiés FIPS 140-2/3.
2. **Neutralisation Technique et Juridique du US Cloud Act** :
   - Google n'a jamais accès aux clés de déchiffrement en clair.
   - En conséquence technique prouvée, toute réquisition judiciaire ou administrative étrangère (notamment au titre du US Cloud Act) adressée à Google est matériellement inopérante : Google est dans l'impossibilité cryptographique de fournir des données intelligibles sans la clé détenue sous juridiction congolaise.
3. **Chiffrement Côté Client (Client-Side Encryption - CSE)** :
   - Les données hautement sensibles (identifiants uniques IUNE, dossiers médicaux scolaires, délibérations de jurys) sont chiffrées sur le terminal de l'utilisateur avant tout transit vers les serveurs GCP.
4. **Conclusion Souveraine** :
   - L'infrastructure matérielle, réseau et applicative demeure **100% Google Cloud**.
   - La propriété, le contrôle et l'accès souverain aux données demeurent **100% congolais**.

---

## ARTICLE 5 — CE QUI EST STRICTEMENT INTERDIT

Les éléments suivants sont **formellement et définitivement proscrits** du projet :

```
❌ AWS (Amazon Web Services) — toute forme
❌ Microsoft Azure — toute forme
❌ Hetzner, OVH, Scaleway, DigitalOcean, Linode
❌ K3s, K0s, MicroK8s, RKE2 ou tout Kubernetes self-hosted
❌ MinIO (remplacé par Cloud Storage / GCS)
❌ NATS JetStream self-hosted (remplacé par Cloud Pub/Sub)
❌ HashiCorp Vault (remplacé par Secret Manager + Cloud KMS)
❌ Prometheus + Grafana self-hosted (remplacé par Cloud Monitoring)
❌ Elastic Stack / ELK self-hosted (remplacé par Cloud Logging)
❌ Jaeger self-hosted (remplacé par Cloud Trace)
❌ Keycloak / Auth0 (remplacé par Firebase Authentication)
❌ Jitsi / BigBlueButton (remplacé par Google Meet API)
❌ Vercel, Netlify, Cloudflare Pages (remplacé par Firebase Hosting)
❌ DockerHub comme registry final (remplacé par Artifact Registry)
```

---

## ARTICLE 6 — DISPOSITIONS POUR LES INTERVENANTS

### 6.1 Pour les développeurs

- Tout code infrastructure (Terraform, Pulumi) doit cibler **uniquement les providers Google**
- Les variables d'environnement pointent vers **GCP services** uniquement
- Les URLs de services sont des URLs GCP (`.googleapis.com`, `.firebaseapp.com`, `.run.app`)
- Les SDK utilisés sont les SDK officiels Google (`google-cloud-*`, `firebase-admin`, `@google-cloud/*`)

### 6.2 Pour les agents IA (dont Antigravity / Gemini)

- Toute suggestion d'outil ou service doit être **validée contre cette doctrine**
- En cas de doute sur un service, **préférer le service Google équivalent**
- Les modules Tome 7, Tome 8 et Tome 9 doivent être lus à la lumière de ce document
- Si un sous-tome mentionne K3s, MinIO, NATS ou un service non-Google, le **corriger**

### 6.3 Pour les architectes

- Les diagrammes d'architecture utilisent **exclusivement des icônes GCP**
- Les appels d'offres techniques citent exclusivement des services GCP
- Les estimations de coûts sont établies sur le **Google Cloud Pricing Calculator**

---

## ARTICLE 7 — ENGAGEMENT DE CONTINUITÉ

Cette doctrine est **permanente et irrévocable** sauf décision formelle écrite du
Promoteur / Fondateur du projet ELLYSIUM, cosignée par le Directeur Technique.

Elle s'applique :
- ✅ En développement local (émulateurs Firebase, Cloud Code, LocalStack interdit)
- ✅ En staging (projet GCP dédié `ellysium-staging`)
- ✅ En production (projet GCP dédié `ellysium-prod`)
- ✅ Pour les tests d'intégration (Firebase Test Lab, Cloud Build)
- ✅ Pour les sauvegardes (Cloud Storage, Cloud SQL automated backups)
- ✅ Pour les outils ML (Vertex AI Workbench, Colab Enterprise)

---

## ARTICLE 8 — RÉFÉRENCE AUX TOMES CONCERNÉS

| Tome | Impact de cette doctrine |
|---|---|
| **Tome 7** — Architecture Technique | Modules 109, 110, 118, 119, 122, 124, 126, 128 à relire avec GCP |
| **Tome 8** — Intelligence Artificielle | Modules 132, 133, 134, 148 → Vertex AI Model Garden |
| **Tome 9** — Données & Sécurité | Modules 158, 161, 162 → Cloud KMS, Cloud Armor |
| **Tome 11** — Administration | Module 204 → FCM, Workspace for Education |
| **Tome 15** — Déploiement | Intégralité → GKE Autopilot, Cloud Run, Firebase Hosting |

---

*Document fondateur rédigé par l'agent ELLYSIUM selon directive du Promoteur.*
*Valeur : CONSTITUTIONNELLE — Opposable à tout intervenant humain ou IA.*
*Version 1.0 — Inscrit en marbre le 17 septembre 2026.*
*Version 1.1 — Amendement du 17 septembre 2026, par directive écrite du Promoteur : Article 1 bis « Règle d'or : Google et Google uniquement », Table de Transposition Normative, Acquit de transposition (Article 9), exception GitHub encadrée.*
*Toute modification ultérieure requiert l'accord écrit explicite du Fondateur.*

---

## ARTICLE 9 — ACQUIT DE TRANSPOSITION DU CORPUS (17/09/2026)

Les Tomes 7, 8, 9, 13, 17 et 19 mentionnaient des composants auto-hébergés hérités
des spécifications antérieures (Redis, MinIO, NATS, K3s, Prometheus, Grafana, Loki,
OpenTofu, Ansible, ArgoCD, SonarQube). **La transposition intégrale vers les équivalents
Google de la Table 1 bis a été effectuée et vérifiée le 17 septembre 2026.** Toute
réintroduction d'une infrastructure non-Google dans le corpus est interdite et devra
être corrigée immédiatement conformément à l'Article 6.2.

---

**🔱 GOOGLE ET GOOGLE. UNIQUEMENT GOOGLE. TOUJOURS GOOGLE. 🔱**
