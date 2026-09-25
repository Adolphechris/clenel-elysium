# TOME 9 — GOUVERNANCE DES DONNÉES ET CYBERSÉCURITÉ
## 153. Cartographie des Données Collectées par Acteur et Matrice de Sensibilité

---

> **Positionnement :** Registre exhaustif des traitements de données personnelles par rôle, bases légales et classification de sécurité  
> **Autorité :** Conforme au Code du Numérique de la RDC et aux exigences de proportionnalité de la collecte  
> **Liaison amont :** Module 57 (12 Personas), Module 150 (Gouvernance) | **Liaison aval :** Module 154 (Cycle de vie), Module 157 (Mineurs)

---

## 1. Objet et Portée du Sous-Tome

Le principe républicain de sobriété numérique interdit toute collecte superflue de données privées sur les citoyens. ELLYSIUM applique le principe de **minimisation stricte** : chaque donnée enregistrée doit posséder une base légale démontrable et un niveau de sensibilité formellement classifié. Ce sous-tome dresse la cartographie exhaustive des données collectées pour les 12 profils d'usagers du système.

---

## 2. Échelle de Classification de la Sensibilité des Données

ELLYSIUM structure son patrimoine informationnel selon 4 niveaux de sécurité stricts :

```mermaid
graph LR
    N1["NIVEAU 1 : DONNÉES PUBLIQUES CERTIFIÉES\n• Annuaire des établissements agréés\n• Programmes DIPROMAT & Syllabus LMD\n• Validité publique d'un diplôme via QR Code"]
    
    N2["NIVEAU 2 : DONNÉES ACADÉMIQUES RESTREINTES\n• Notes et bulletins d'une classe (accessible au prof & préfet)\n• Cahiers de textes et horaires scolaires"]
    
    N3["NIVEAU 3 : DONNÉES PERSONNELLES SENSIBLES (PII)\n• État civil complet, date de naissance, téléphone\n• Rapprochement bancaire Mobile Money et coordonnées parents"]
    
    N4["NIVEAU 4 : SECRET D'ÉTAT & SÉCURITÉ NATIONALE\n• Clés privées de signature des diplômes nationaux\n• Registre des fraudes académiques & journaux d'audit Merkle"]

    N1 --> N2 --> N3 --> N4
```

---

## 3. Matrice de Collecte Détaillée par Persona

| Profil Utilisateur | Données Collectées | Base Légale (Code Numérique RDC) | Niveau Sensibilité | Durée de Rétention |
|---|---|---|---|---|
| **Élève Mineur Affilié** | Nom, post-nom, prénom, date naissance, sexe, photo, cotes, présences | Obligation scolaire légale (EPST) | **Niveau 3** | À vie (IUNE souverain) |
| **Apprenant Indépendant** | Nom, prénom, téléphone, province, cursus choisi, copies de devoirs | Contrat de formation gratuit (Art. 4) | **Niveau 3** | À vie (IUNE souverain) |
| **Étudiant LMD** | Identité civile, EXETAT, crédits ECTS acquis, TFE / mémoires | Mission d'intérêt public académique (ESU) | **Niveau 3** | À vie (Diplômes pérennes) |
| **Parent / Tuteur** | Nom, téléphone payeur, lien de parenté, historique reçus de caisse | Autorité parentale & obligation civile | **Niveau 3** | Scolarité de l'enfant + 5 ans |
| **Enseignant** | Matricule SECOPE, diplômes, volume horaire presté, compte bancaire | Contrat de travail / Statut enseignant | **Niveau 3** | Carrière + 10 ans (Retraite) |
| **Préfet / Doyen** | Arrêté de nomination, signature électronique, PV de jury | Mandat officiel d'autorité publique | **Niveau 2 / 4** | Archivage historique d'État |
| **Inspecteur Ministériel** | Matricule IGEN, ordre de mission, rapports d'audit signés | Prérogative régalienne de contrôle | **Niveau 2** | Archivage d'État (50 ans) |
| **Caissier d'École** | Identifiant poste, journal des écritures de caisse journalières | Comptabilité légale OHADA | **Niveau 3** | 10 ans (Droit commercial) |

---

## 4. Données Formellement Interdites de Collecte

**Règle RGPD-153-01** : Il est strictement interdit au système d'enregistrer, de stocker ou d'inférer les données suivantes :
- L'appartenance ethnique ou tribale de l'usager.
- Les convictions religieuses ou philosophiques.
- Les opinions politiques ou affiliations syndicales.
- Les données biométriques invasives (empreintes digitales complètes ou données génétiques bannies, seule la photo d'identité scolaire est tolérée).

---

## 5. Verrous Techniques de Cartographie

| Réf. | Intitulé | Conséquence en cas de transgression |
|---|---|---|
| **VF-153-01** | Blocage des champs non déclarés | Tout ajout d'un champ de collecte dans un formulaire sans déclaration préalable au registre de cartographie bloque automatiquement le build de l'application. |
| **VF-153-02** | Cloisonnement strict des données Niveau 4 | Les données de Niveau 4 sont hébergées dans un schéma chiffré séparé accessible uniquement par les agents assermentés munis d'un jeton matériel HSM. |

---

*Sous-tome rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*  
*Version 1.0 — Référence : ELLYSIUM/T9/153/v1.0*

---

## 7. Verrous Fonctionnels Critiques

| Réf. Verrou | Description Fonctionnelle et Technique | Conséquence en Cas de Violation |
| :--- | :--- | :--- |
| **`VF-153-03`** | **Données minimales collectées selon le principe de minimisation** | Aucun champ de données non strictement nécessaire n'est collecté. |
| **`VF-153-04`** | **Consentement granulaire pour chaque catégorie de données** | L'utilisateur contrôle individuellement chaque type de donnée collectée. |
| **`VF-153-05`** | **Interdiction de corrélation des données entre apprenants sans anonymisation** | Les analyses croisées inter-apprenants utilisent exclusivement des données agrégées. |
| **`VF-153-06`** | **Aucun accès en ligne de mire aux données sensibles n'est possible sans justifier d'un motif légitime** | **Conséquence : violation = inéligibilité du module pour mise en production** |

---

*Sous-tome rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*
