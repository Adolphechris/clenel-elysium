# Module 164 — Protection contre les Attaques Courantes (OWASP Top 10)

> **Positionnement :** Tome 9 — Gouvernance des Données & Cybersécurité · Module 164 sur 170
> **Autorité :** RSSI ELLYSIUM / Équipe Développement
> **Liaison amont/aval :** ← Module 163 (Incidents) · Module 143 (Sécurité IA) → Module 165 (Sécurité mobile) →

---

## 1. Objet

Ce module décrit les contre-mesures spécifiques appliquées dans ELLYSIUM contre chacune des 10 vulnérabilités les plus critiques référencées par l'OWASP (Open Web Application Security Project), édition 2021. Chaque contre-mesure est concrète, implémentée et vérifiable.

---

## 2. Matrice OWASP Top 10 × ELLYSIUM

### A01 — Broken Access Control

**Risque :** Un élève accède aux bulletins d'un autre; un parent voit les finances d'un établissement.

```
Contre-mesures ELLYSIUM :
✅ RBAC + ABAC stricts (Module 159)
✅ Row Level Security PostgreSQL sur toutes les tables sensibles
✅ Firebase Custom Claims vérifiés côté serveur à chaque requête
✅ Tests automatiques d'isolation (DAST hebdomadaire)
✅ Principe du moindre privilège : accès par défaut = aucun
✅ Cloud Armor : règles WAF bloquant les patterns d'élévation
```

---

### A02 — Cryptographic Failures

**Risque :** Mots de passe en clair, données transmises sans TLS, clés exposées.

```
Contre-mesures ELLYSIUM :
✅ TLS 1.3 obligatoire sur toutes les connexions (Certificate Manager GCP)
✅ Argon2id pour les mots de passe (Module 160)
✅ AES-256-GCM pour le chiffrement au repos (Module 158)
✅ Clés dans Cloud KMS uniquement — jamais dans le code ou les variables d'environnement
✅ Secret Manager pour tous les secrets applicatifs
✅ Interdiction des algorithmes MD5, SHA-1, DES, RC4
✅ TLS 1.0 et 1.1 désactivés sur Cloud Load Balancing
```

---

### A03 — Injection (SQL, NoSQL, OS, LDAP)

**Risque :** Injection SQL pour exfiltrer les cotes ou les données personnelles.

```go
// ✅ Requêtes paramétrées UNIQUEMENT (jamais de concaténation SQL)
// Go + pgx
rows, err := db.Query(ctx,
    "SELECT cote, matiere FROM cotes WHERE eleve_id = $1 AND annee = $2",
    eleveID, anneeAcademique,
)

// ❌ INTERDIT absolument
query := "SELECT * FROM cotes WHERE nom = '" + nomEleve + "'"
```

```
Contre-mesures complémentaires :
✅ ORM avec requêtes paramétrées (GORM / sqlx)
✅ Validation stricte des entrées (whitelist, pas blacklist)
✅ Cloud Armor WAF : règles anti-SQLi et anti-XSS préconfigurées (règles OWASP CRS)
✅ Least-privilege DB user : rôle app_user sans DROP/ALTER/TRUNCATE
✅ Scanner SAST Semgrep : règle anti-injection dans CI/CD
```

---

### A04 — Insecure Design

**Risque :** Architecture permettant le contournement des contrôles par conception.

```
Contre-mesures ELLYSIUM :
✅ Threat modeling (STRIDE) à chaque nouvelle fonctionnalité
✅ Design review sécurité obligatoire avant tout développement sensible
✅ Séparation stricte pédagogie/finances (Constitution Art. 5)
✅ Defense in depth : Cloud Armor → API Gateway → Service Mesh → DB RLS
✅ Fail-secure : en cas d'erreur, accès refusé par défaut
✅ Principes Zero Trust : pas de confiance implicite interne
```

---

### A05 — Security Misconfiguration

**Risque :** Bucket GCS public, API non sécurisée, erreurs détaillées exposées.

```
Contre-mesures ELLYSIUM :
✅ Organisation GCP Policy : aucun bucket public par défaut (org policy enforced)
✅ Messages d'erreur génériques côté client (jamais de stacktrace)
✅ Logs d'erreur détaillés uniquement dans Cloud Logging (côté serveur)
✅ Headers de sécurité HTTP obligatoires :
   Content-Security-Policy: default-src 'self'; img-src 'self' storage.googleapis.com
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
   Permissions-Policy: camera=(), microphone=(), geolocation=()
✅ Checkov + tfsec : scan IaC avant déploiement
✅ Security Command Center (GCP) : détection misconfiguration en temps réel
```

---

### A06 — Vulnerable and Outdated Components

**Risque :** Dépendances npm/Go avec CVE critique non patchées.

```
Contre-mesures ELLYSIUM :
✅ Dependabot : alertes automatiques CVE (GitHub + Artifact Registry)
✅ OSV Scanner : scan hebdomadaire toutes les dépendances
✅ Container Analysis : scan des images Docker à chaque build
✅ SBOM (Software Bill of Materials) généré à chaque release
✅ Politique de mise à jour : CVE critique → patch < 24h, haute → < 7 jours
✅ Images de base : distroless Google (surface d'attaque minimale)
```

---

### A07 — Identification and Authentication Failures

**Risque :** Credential stuffing, brute force, sessions non invalidées.

```
Contre-mesures ELLYSIUM :
✅ Firebase Authentication (MFA, rate limiting, anomaly detection intégré)
✅ Argon2id + pepper Cloud KMS (Module 160)
✅ Délai exponentiel entre tentatives (1s → 2s → 4s → blocage 15 min)
✅ Révocation immédiate de tous les tokens en cas de compromission
✅ Sessions hors-ligne limitées à 30 jours avec re-auth obligatoire
✅ Have I Been Pwned : vérification mots de passe connus
✅ Alerte après 3 échecs d'authentification
```

---

### A08 — Software and Data Integrity Failures

**Risque :** Mises à jour malveillantes, désérialisation unsafe, CI/CD compromis.

```
Contre-mesures ELLYSIUM :
✅ Signature des images Docker (Artifact Registry + Binary Authorization)
✅ Binary Authorization : seules les images signées et vérifiées peuvent s'exécuter sur GKE
✅ Conventional Commits + CODEOWNERS : toute modification critique nécessite 2 reviewers
✅ Signatures HMAC-SHA256 sur tous les webhooks entrants (Module 116)
✅ Chaîne de Merkle sur les logs d'audit (Module 162)
✅ Diplômes et bulletins scellés avec hash SHA-256 (Module 185)
✅ Pas de désérialisation d'objets non fiables (JSON uniquement, pas de pickle/serialize)
```

---

### A09 — Security Logging and Monitoring Failures

**Risque :** Attaque non détectée pendant des semaines, absence de preuves forensiques.

```
Contre-mesures ELLYSIUM :
✅ Cloud Logging : centralisation de TOUS les logs (Module 162)
✅ Google SecOps (SIEM) : détection d'anomalies en temps réel
✅ Alertes Cloud Monitoring : MTTD < 5 minutes pour incidents critiques
✅ Logs immuables WORM 7 ans
✅ Chaîne de Merkle : détection falsification
✅ Tests d'alertes mensuels (simuler un incident pour vérifier le pipeline)
```

---

### A10 — Server-Side Request Forgery (SSRF)

**Risque :** Un attaquant force le serveur à accéder aux métadonnées GCP (169.254.169.254).

```
Contre-mesures ELLYSIUM :
✅ Validation stricte et liste blanche (whitelist) des URLs autorisées côté serveur
✅ Cloud Run : désactivation de l'accès aux métadonnées d'instance si non nécessaire
✅ Workload Identity Federation : les services n'ont pas de clés SA exposées
✅ Firewall VPC : sortie restreinte (egress) aux seuls domaines autorisés
✅ Blocage réseau : 169.254.169.254 inaccessible depuis les pods applicatifs
✅ Scanner SAST : règles anti-SSRF dans Semgrep
```

---

## 3. Dashboard Sécurité OWASP (Cloud Monitoring)

```yaml
# Cloud Monitoring Dashboard — OWASP Top 10
metrics:
  - name: "owasp_a01_access_denied_rate"
    alert_threshold: "> 50/min"
  - name: "owasp_a03_sqli_attempts"
    alert_threshold: "> 0"  # Zéro tolérance
  - name: "owasp_a07_auth_failures"
    alert_threshold: "> 100/min"
  - name: "owasp_a10_ssrf_blocked"
    alert_threshold: "> 0"  # Zéro tolérance
```

---

## 4. Verrous Fonctionnels

| ID | Règle | Niveau |
|---|---|---|
| VF-164-01 | Zéro requête SQL non paramétrée autorisée en production | OBLIGATOIRE |
| VF-164-02 | Binary Authorization : seules les images signées s'exécutent sur GKE | OBLIGATOIRE |
| VF-164-03 | Tout bucket GCS en production est privé par défaut (org policy) | OBLIGATOIRE |
| VF-164-04 | Les headers de sécurité HTTP sont vérifiés à chaque déploiement | OBLIGATOIRE |
| VF-164-05 | Cloud Armor WAF avec règles OWASP CRS activé sur tout le trafic public | OBLIGATOIRE |
| VF-164-06 | Accès aux métadonnées GCP bloiqué depuis les pods applicatifs | OBLIGATOIRE |

---

*Sous-tome rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*
