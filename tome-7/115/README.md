# TOME 7 — ARCHITECTURE TECHNIQUE ET INTEROPÉRABILITÉ
## 115. API Internes — Conventions RESTful, Versioning et Contrats OpenAPI

---

> **Positionnement :** Standardisation des interfaces de programmation internes, formats d'échanges et contrats d'intégration  
> **Autorité :** Conforme aux spécifications IETF HTTP/REST et OpenAPI 3.1  
> **Liaison amont :** Module 110 (Contextes DDD), Module 111 (Clean Architecture) | **Liaison aval :** Module 116 (API Partenaires), Module 117 (Sessions)

---

## 1. Objet et Portée du Sous-Tome

Les interfaces de programmation (API) constituent le tissu conjonctif reliant les clients web, les applications mobiles et les services backend d'ELLYSIUM. Une API désordonnée ou mal typée engendre des régressions catastrophiques lors des mises à jour applicatives sur le terrain. Ce sous-tome standardise les conventions RESTful, la structure canonique des réponses JSON, le versioning d'API et la génération des contrats OpenAPI 3.1.

---

## 2. Structure Canonique des Payloads JSON

Toute réponse HTTP issue d'une API interne ELLYSIUM respecte obligatoirement la structure enveloppe à 4 clés fondamentales :

```json
{
  "status": "success",
  "data": {
    "iune": "CD-EL-2025-01428590",
    "nom": "KABAMBA",
    "prenom": "Gloire",
    "statut": "ACTIF"
  },
  "error": null,
  "meta": {
    "timestamp": "2025-09-17T14:30:00Z",
    "request_id": "req-8f4b2c1a-9823-4e12",
    "server_version": "1.4.2"
  }
}
```

### 2.1 Enveloppe d'Erreur Normalisée

En cas d'échec (HTTP 4xx ou 5xx), le champ `data` est nul et le champ `error` contient le diagnostic structuré :

```json
{
  "status": "fail",
  "data": null,
  "error": {
    "code": "GRADE_EXCEEDS_MAXIMUM",
    "message": "La cote saisie (12.5) dépasse le maximum autorisé pour cette épreuve (10.0).",
    "field": "note",
    "help_url": "https://docs.cnele.cd/errors/GRADE_EXCEEDS_MAXIMUM"
  },
  "meta": {
    "timestamp": "2025-09-17T14:31:12Z",
    "request_id": "req-9c5e3d2b-1104-4a55"
  }
}
```

---

## 3. Stratégie de Versioning d'API

**Règle TECH-115-01** : Le versioning des endpoints s'opère explicitement dans le chemin d'URL : `/api/v1/`, `/api/v2/`.
- **Règle de rétrocompatibilité** : Une version majeure d'API reste maintenue et active en production pendant un minimum de **24 mois** après la publication de la version suivante, assurant la continuité de service pour les terminaux non encore mis à jour en milieu rural.
- **En-tête de dépréciation** : Dès qu'un endpoint est marqué obsolète, les réponses incluent les en-têtes RFC 8594 :
  ```http
  Deprecation: @1767225600
  Sunset: Wed, 01 Jan 2026 00:00:00 GMT
  ```

---

## 4. Pagination Standardisée par Curseur (Cursor-Based Pagination)

Pour les listes lourdes (annuaires d'élèves, flux d'audit, historiques de cotes), la pagination par décalage (`OFFSET/LIMIT`) est interdite en raison de ses dégradations de performance sur les grandes tables.

**Règle TECH-115-02** : Utilisation exclusive de la pagination par curseur opaque encodé en base64 :

```http
GET /api/v1/classes/cls-4sc-a/eleves?limit=25&cursor=ZXlKaGJHY2lPaUpTVXpVeE1pSXNJbg==
```

---

## 5. En-têtes HTTP Souverains Obligatoires

Chaque requête transitant par le système doit comporter les en-têtes suivants :

| En-tête HTTP | Description fonctionnelle | Obligatoire |
|---|---|---|
| `X-Request-ID` | UUID unique de traçabilité pour la corrélation des logs | OUI |
| `X-Client-Version` | Version sémantique de l'application cliente (ex. `1.2.0-android`) | OUI |
| `X-Offline-Timestamp` | Horodatage de création locale de l'action si émise hors-ligne | OUI (si offline) |
| `Idempotency-Key` | Clé d'idempotence pour éviter les doublons d'évaluation ou de paiement | OUI (sur POST/PUT) |

---

## 6. Verrous Techniques d'API

| Réf. | Intitulé | Conséquence en cas de transgression |
|---|---|---|
| **VF-115-01** | Documentation OpenAPI 3.1 obligatoire | Tout nouveau point d'accès d'API non documenté dans le fichier `openapi.yaml` central est automatiquement rejeté par le pipeline d'intégration. |
| **VF-115-02** | Conformité stricte des statuts HTTP | L'usage du statut `HTTP 200 OK` avec un corps de réponse contenant une erreur cachée (`{"error": true}`) est formellement interdit. Tout échec métier doit retourner un code HTTP 4xx approprié. |

---

*Sous-tome rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*  
*Version 1.0 — Référence : ELLYSIUM/T7/115/v1.0*

---

## 7. Verrous Fonctionnels Critiques

| Réf. Verrou | Description Fonctionnelle et Technique | Conséquence en Cas de Violation |
| :--- | :--- | :--- |
| **`VF-115-03`** | **Forum de parents modéré et non commercial** | Espace d'échange entre parents excluant toute prospection commerciale. |
| **`VF-115-04`** | **Accès aux résultats des conseils de classe résumés** | Compte-rendu anonymisé du conseil de classe transmis aux parents. |
| **`VF-115-05`** | **Signalement direct au DPO pour data privacy** | Formulaire de plainte data personnalisé accessible depuis l'espace parent. |

---

*Sous-tome rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*
