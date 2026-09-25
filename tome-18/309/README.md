# Module 309 — Périmètre du Tome 18 : identité de marque, positionnement et écosystème de landing pages

> **Positionnement :** Tome 18 — Communication et Marketing
> Module 1 sur 11 | Référence : ELLYSIUM-T18-M309
> **Autorité :** Direction de la Communication et de la Marque / Direction Générale
> **Liaison amont :** Tome 17 complet (M294–M308)
> **Liaison aval :** Module 310 — Conformité avec la Constitution (transparence, éthique)

---

## 1. Objet

Une œuvre de transformation sociétale de l'envergure d'ELLYSIUM ne peut conquérir le cœur et l'esprit des populations sans une identité de marque puissante, inspirante et immédiatement identifiable. Dans un environnement saturé de promesses technologiques éphémères et de désillusions scolaires, la marque ELLYSIUM doit incarner l'excellence académique, la dignité de la jeunesse congolaise et la souveraineté intellectuelle de l'Afrique.

Ce module définit le périmètre d'action du **Tome 18**, pose le **positionnement de marque institutionnel** et structure l'**écosystème de multiples landing pages haut de gamme**, déployées exclusivement sur **Google Firebase Hosting**, conçues pour convertir chaque public cible (élèves, parents, directeurs, employeurs, diaspora) à travers une expérience visuelle et narrative d'exception.

---

## 2. Le Positionnement de Marque : L'Institution de l'Avenir

ELLYSIUM refuse le positionnement étriqué d'une simple « application mobile » ou d'une « startup EdTech » commerciale. La marque s'impose comme :

```mermaid
mindmap
  root((Identité de Marque\nELLYSIUM))
    Piliers de Marque
      Excellence Académique (Normes mondiales & CAMES)
      Dignité & Gratuité (Émancipation sans barrière financière)
      Souveraineté Technologique (100% Google Cloud Platform)
      Ancrage Africain & Panafricain (Fierté & Solutions locales)
    Tonalité & Voix
      Solennelle et Inspirante (Pas de racolage commercial)
      Claire et accessible (Zéro jargon hermétique)
      Empathique et bienveillante envers les familles
      Exigeante et rigoureuse sur le plan scientifique
```

---

## 3. L'Écosystème des Multiples Landing Pages sur Firebase Hosting

Pour répondre aux attentes radicalement différentes de ses parties prenantes, le site web officiel d'ELLYSIUM n'est pas un portail monolithique confus, mais une **constellation de landing pages thématiques sur-mesure**, toutes servies à très haute vitesse via **Google Firebase Hosting** et le réseau mondial **Google Cloud CDN** :

```mermaid
flowchart TD
    ROOT["Domaine Officiel : ellysium.cd\n(Google Cloud Load Balancer & Firebase Hosting)"]
    
    LP_MAIN["1. Landing Page Institutionnelle & Vision\n(Manifeste, impact national, accès à la PWA)\n-> ellysium.cd"]
    LP_ECOLES["2. Landing Page Écoles & Directions B2B\n(Démo SGS, calculatrice de ROI, conventionnement)\n-> ellysium.cd/ecoles"]
    LP_ELEVES["3. Landing Page Apprenants & Jeunesse\n(Design immersif, catalogue filières, mode offline)\n-> ellysium.cd/apprenants"]
    LP_PARENTS["4. Landing Page Parents d'Élèves\n(Réassurance, gratuité expliquée, suivi par SMS)\n-> ellysium.cd/parents"]
    LP_DIASPORA["5. Landing Page Diaspora & Bailleurs\n(Parrainages d'élèves, transparence BigQuery)\n-> ellysium.cd/diaspora"]
    LP_PROS["6. Landing Page Entreprises & Recruteurs\n(Vivier certifié, stages, compétences vérifiées)\n-> ellysium.cd/entreprises"]

    ROOT --> LP_MAIN
    ROOT --> LP_ECOLES
    ROOT --> LP_ELEVES
    ROOT --> LP_PARENTS
    ROOT --> LP_DIASPORA
    ROOT --> LP_PROS
```

---

## 4. Spécifications Techniques et Ergonomiques des Landing Pages

Chaque landing page est un chef-d'œuvre de design web moderne, respectant les standards les plus exigeants de Google :

| Attribut Technique | Standard d'Ingénierie Google Exigé | Bénéfice Utilisateur |
|---|---|---|
| **Hébergement & Distribution** | Firebase Hosting + Cloud CDN Edge PoP mondial | Temps de chargement initial < 1,2 seconde, même sur réseau 3G |
| **Performance Core Web Vitals** | Score Lighthouse >= 95/100 (LCP < 1,8s, INP < 100ms, CLS = 0) | Fluidité absolue sans saccade ni saut visuel à l'écran |
| **Design System & Typographie** | Google Material You 3.0 / Typographie Roboto & Inter | Lisibilité parfaite, contrastes accessibles conformes WCAG 2.1 AA |
| **Responsive & PWA Ready** | 100 % adaptative (du smartphone 4,5 pouces à l'écran 4K) | Installation en 1 clic sur l'écran d'accueil du téléphone |
| **Mode Sombre / Lumineux** | Détection automatique des préférences du système d'exploitation | Confort de lecture nocturne préservant la batterie |

---

## 5. Schéma de Déploiement CI/CD des Landing Pages (Google Cloud Build)

```mermaid
sequenceDiagram
    participant DEV as Équipe Design UI/UX & Web
    participant GIT as Dépôt Git ELLYSIUM
    participant BUILD as Google Cloud Build
    participant TEST as Google Lighthouse CI Runner
    participant FIREBASE as Firebase Hosting Production (ellysium.cd)

    DEV->>GIT: Commit & Push nouvelle landing page optimisée
    GIT->>BUILD: Déclenchement automatique du pipeline de build
    BUILD->>TEST: Audit automatique de performance et d'accessibilité
    alt Score Lighthouse >= 95
        TEST-->>BUILD: Feu vert d'audit
        BUILD->>FIREBASE: Déploiement atomique multi-canaux (Zero-Downtime)
        FIREBASE-->>DEV: Mise en ligne instantanée avec invalidation globale du cache CDN
    else Score Lighthouse < 95
        TEST-->>DEV: Rejet du déploiement & rapport des optimisations d'images requises
    end
```

---

## 6. Verrous Fonctionnels

| ID | Règle | Niveau |
|---|---|---|
| VF-309-01 | L'ensemble des landing pages et sites web d'ELLYSIUM doit être hébergé exclusivement sur Google Firebase Hosting | CRITIQUE |
| VF-309-02 | Le score de performance Google Lighthouse de chaque landing page doit impérativement être supérieur ou égal à 95/100 | CRITIQUE |
| VF-309-03 | Il est formellement interdit d'afficher de la publicité tierce ou commerciale sur les landing pages d'ELLYSIUM | CRITIQUE |
| VF-309-04 | Chaque landing page doit être accessible en français et comporter un résumé dans les 4 langues nationales congolaises | OBLIGATOIRE |
| VF-309-05 | L'accès à la PWA d'apprentissage doit être directement accessible en 1 clic depuis n'importe quelle landing page | OBLIGATOIRE |
| VF-309-06 | Toute communication institutionnelle porte un identifiant de source vérifiable | OBLIGATOIRE |

---

*Sous-tome rédigé conformément aux Normes documentaires ELLYSIUM — Fondations 04.*
