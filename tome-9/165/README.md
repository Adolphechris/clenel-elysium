# Module 165 — Sécurité des Applications Mobiles et Web

> **Positionnement :** Tome 9 — Gouvernance des Données & Cybersécurité · Module 165 sur 170
> **Autorité :** RSSI ELLYSIUM / Équipe Mobile (Flutter) + Équipe Web (PWA)
> **Liaison amont/aval :** ← Module 164 (OWASP) · Module 113 (App Android) → Module 166 (Caisse) →

---

## 1. Objet

Ce module définit les exigences de sécurité spécifiques aux applications mobiles Android (Flutter) et à la PWA d'ELLYSIUM. Il couvre la sécurité locale (stockage, certificats), la sécurité des communications, la protection contre l'ingénierie inverse, et les mesures spécifiques au contexte congolais (appareils d'entrée de gamme, réseau instable).

---

## 2. Sécurité de l'Application Android (Flutter)

### 2.1 Stockage local sécurisé

```dart
// ✅ Données sensibles → flutter_secure_storage (Android Keystore)
final storage = FlutterSecureStorage(
  aOptions: AndroidOptions(
    encryptedSharedPreferences: true,
    keyCipherAlgorithm: KeyCipherAlgorithm.RSA_ECB_OAEPwithSHA_256andMGF1Padding,
    storageCipherAlgorithm: StorageCipherAlgorithm.AES_GCM_NoPadding,
  ),
);

// Token offline : chiffré dans Android Keystore
await storage.write(key: 'offline_token', value: encryptedToken);

// ❌ INTERDIT : SharedPreferences pour données sensibles
// ❌ INTERDIT : Fichiers non chiffrés dans /sdcard/
// ❌ INTERDIT : SQLite non chiffré pour données personnelles
// ✅ OBLIGATOIRE : SQLCipher pour toute base SQLite locale
```

### 2.2 Sécurité réseau (Android)

```xml
<!-- res/xml/network_security_config.xml -->
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <!-- Uniquement l'autorité de certification Google -->
            <certificates src="system"/>
        </trust-anchors>
    </base-config>
    <!-- Certificate pinning pour les APIs ELLYSIUM -->
    <domain-config>
        <domain includeSubdomains="true">api.ellysium.cd</domain>
        <pin-set expiration="2027-09-17">
            <pin digest="SHA-256">HASH_CERT_PRIMAIRE=</pin>
            <pin digest="SHA-256">HASH_CERT_BACKUP=</pin>
        </pin-set>
    </domain-config>
</network-security-config>
```

### 2.3 Protection contre l'ingénierie inverse

```
✅ ProGuard / R8 : obfuscation du code en production (build release)
✅ Root detection : refus de démarrage sur appareils rootés (mode admin)
✅ Emulator detection : désactivation des fonctions sensibles en émulateur
✅ Tampering detection : vérification de l'intégrité de l'APK au démarrage
✅ Anti-screenshot : FLAG_SECURE activé sur les écrans de paiement et bulletins
✅ Export des composants Android : android:exported="false" par défaut
✅ Pas de logs en production (BuildConfig.DEBUG contrôlé)
```

### 2.4 Permissions Android (principe du moindre privilège)

```xml
<!-- Permissions demandées uniquement si nécessaires -->
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.CAMERA"/>  <!-- QR code / CameraX -->
<uses-permission android:name="android.permission.USE_BIOMETRIC"/>  <!-- Auth offline -->

<!-- INTERDITES sans justification documentée -->
<!-- android.permission.READ_CONTACTS -->
<!-- android.permission.ACCESS_FINE_LOCATION -->
<!-- android.permission.READ_PHONE_STATE -->
```

---

## 3. Sécurité de la PWA (Web)

### 3.1 Content Security Policy stricte

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://www.gstatic.com https://apis.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://storage.googleapis.com https://lh3.googleusercontent.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com;
  frame-ancestors 'none';
  form-action 'self';
  base-uri 'self';
  object-src 'none';
```

### 3.2 Service Worker — Sécurité du cache

```javascript
// sw.js — Stratégies de cache sécurisées
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // ❌ Jamais mettre en cache les requêtes d'authentification
  if (url.pathname.startsWith('/api/auth/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // ❌ Jamais mettre en cache les données financières
  if (url.pathname.startsWith('/api/finance/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // ✅ Cache-first pour les ressources statiques
  if (url.pathname.startsWith('/static/')) {
    event.respondWith(cacheFirst(event.request));
    return;
  }
});
```

### 3.3 Stockage local PWA (chiffrement)

```javascript
// ❌ INTERDIT : localStorage pour données sensibles
// ✅ OBLIGATOIRE : IndexedDB chiffré avec CryptoKey (Web Crypto API)

const key = await crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  false,  // non extractable
  ['encrypt', 'decrypt']
);

// Les tokens offline sont stockés chiffrés uniquement
const encryptedToken = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv: crypto.getRandomValues(new Uint8Array(12)) },
  key,
  new TextEncoder().encode(rawToken)
);
```

---

## 4. Sécurité des Communications

### 4.1 Certificate Pinning (mobile + web)

```
Mobile (Android) :
  - Pinning sur les certificats Google-issued pour api.ellysium.cd
  - 2 pins : primaire + backup (rotation préventive)
  - Expiration du pin : 1 an (renouvellement via mise à jour app)

Web (PWA) :
  - HSTS Preload activé (max-age=31536000; includeSubDomains; preload)
  - Expect-CT header pour Certificate Transparency
  - Public Key Pinning (HPKP) déprécié → HSTS + CT uniquement
```

### 4.2 Protection des tokens JWT côté client

```
✅ Tokens stockés en mémoire (RAM) uniquement pour la session active
✅ Refresh tokens dans HttpOnly Secure Cookie (web) ou Android Keystore (mobile)
✅ Expiration courte : Access Token 15 min, Refresh Token 30 jours offline
✅ Rotation du Refresh Token à chaque usage (sliding expiration)
✅ Révocation centralisée : Firebase Auth revokeRefreshTokens()
```

---

## 5. Tests de Sécurité Mobile

```
Référentiel : OWASP Mobile Application Security Verification Standard (MASVS) Level 2

Tests automatisés :
✅ Firebase Test Lab : tests sur > 50 appareils physiques Android (Itel, Tecno, Samsung...)
✅ MobSF (Mobile Security Framework) : analyse statique APK en CI/CD
✅ Frida : tests de hooking en environnement de staging

Tests manuels (annuels) :
✅ Pentest mobile par cabinet agréé (référentiel OWASP MSTG)
✅ Test de rétro-ingénierie (décompilation APK, extraction strings)
✅ Test de communication réseau (interception MITM)
✅ Test de stockage local (forensics appareil)
```

---

## 6. Verrous Fonctionnels

| ID | Règle | Niveau |
|---|---|---|
| VF-165-01 | Aucune donnée personnelle en clair dans le stockage local (mobile ou web) | OBLIGATOIRE |
| VF-165-02 | L'APK de production est signé avec la clé de signature ELLYSIUM stockée dans Cloud KMS | OBLIGATOIRE |
| VF-165-03 | FLAG_SECURE activé sur tous les écrans affichant des cotes, bulletins ou paiements | OBLIGATOIRE |
| VF-165-04 | La CSP bloque tout contenu non autorisé (inline scripts interdits sauf gstatic) | OBLIGATOIRE |
| VF-165-05 | Les requêtes d'authentification ne sont jamais mises en cache (Service Worker) | OBLIGATOIRE |
| VF-165-06 | Les appareils rootés ne peuvent pas accéder aux fonctions d'administration | OBLIGATOIRE |

---

*Sous-tome rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*
