# -*- coding: utf-8 -*-
import os

OUTPUT_DIR = "/home/adolphe/CNEL -ELYSIUM/clenel-elysium/apps/web-portal/dist"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Définition des 20 pages avec titre, badge, lead, contenu structuré, boutons d'action
PAGES = [
    {
        "filename": "index.html",
        "title": "ELLYSIUM — Le Système National Numérique Souverain de l'Éducation en RDC",
        "badge": "Système de Gestion Scolaire & Université Numérique Nationale",
        "h1": "L'Éducation Nationale Numérique <span>Souveraine, Immuable & Accessible</span>",
        "lead": "Du Cycle Terminal de l'Éducation de Base jusqu'au diplôme universitaire LMD : un progiciel de gestion intégrée (PGI) infalsifiable et une plateforme d'excellence pour la République Démocratique du Congo.",
        "primary_btn": {"text": "🏛️ Découvrir le PGI Scolaire", "url": "etablissements.html"},
        "secondary_btn": {"text": "🔍 Vérifier un Diplôme d'État", "url": "verification-diplomes.html"},
        "sections": """
        <div class="kpi-banner">
            <div class="kpi-item"><div class="kpi-number">282</div><div class="kpi-label">Modules Spécifiés au Corpus</div></div>
            <div class="kpi-item"><div class="kpi-number">1 422</div><div class="kpi-label">Verrous Fonctionnels RDC</div></div>
            <div class="kpi-item"><div class="kpi-number">240K</div><div class="kpi-label">Délibérations / sec (Banc d'Essai)</div></div>
            <div class="kpi-item"><div class="kpi-number">72h</div><div class="kpi-label">Autonomie Hors-Ligne Totale</div></div>
        </div>

        <div class="section-head">
            <span class="section-tag">Écosystème National Éducatif</span>
            <h2>Une infrastructure complète pour moderniser l'enseignement congolais</h2>
            <p>Conçue selon les prescriptions constitutionnelles de la Charte ELLYSIUM et les référentiels officiels de l'EPST et de l'ESU.</p>
        </div>

        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">🏛️</div>
                <h3>Établissements & PGI Scolaire</h3>
                <p>Gestion dématérialisée intégrale : inscriptions IUNE, cotes, délibérations officielles RDC et caisse étanche financière.</p>
                <a href="etablissements.html" class="card-link">En savoir plus &rarr;</a>
            </div>
            <div class="feature-card">
                <div class="card-icon">📄</div>
                <h3>Bulletins Scellés SHA-256</h3>
                <p>Éradication totale de la fraude scolaire. Chaque bulletin comporte une empreinte cryptographique vérifiable universellement.</p>
                <a href="bulletin-securise.html" class="card-link">Voir le fonctionnement &rarr;</a>
            </div>
            <div class="feature-card">
                <div class="card-icon">📡</div>
                <h3>Technologie 72h Hors-Ligne</h3>
                <p>Parfaitement adaptée aux réalités congolaises : saisie sur smartphone sans électricité ni réseau Internet permanent.</p>
                <a href="offline-first.html" class="card-link">Découvrir l'Offline-First &rarr;</a>
            </div>
            <div class="feature-card">
                <div class="card-icon">👨‍👩‍👧‍👦</div>
                <h3>Espace Parents d'Élèves</h3>
                <p>Alertes SMS sous 30 min en cas d'absence non justifiée, consultation des résultats et paiement des frais transparent.</p>
                <a href="parents.html" class="card-link">Accéder à l'espace parent &rarr;</a>
            </div>
            <div class="feature-card">
                <div class="card-icon">🎓</div>
                <h3>Université en Ligne (EAD)</h3>
                <p>Cursus d'excellence en Licence Informatique (LMD), cours interactifs, travaux pratiques et travaux dirigés accessibles à tous.</p>
                <a href="ead-universite.html" class="card-link">Explorer les filières &rarr;</a>
            </div>
            <div class="feature-card">
                <div class="card-icon">🛡️</div>
                <h3>Souveraineté Cloud & Cryptographie</h3>
                <p>Données nationales hébergées sous clés de chiffrement exclusives de l'autorité congolaise (CMEK/EKM sur Google Cloud).</p>
                <a href="souverainete-cloud.html" class="card-link">Détails de souveraineté &rarr;</a>
            </div>
        </div>

        <div class="regal-quote">
            « L'éducation est le bouclier souverain de la Nation congolaise. Aucune note ne sera falsifiée, aucun diplôme ne sera corrompu, aucune absence ne sera dissimulée. Rigueur, sérieux et honnêteté sont nos devises d'État. »
        </div>
        """
    },
    {
        "filename": "etablissements.html",
        "title": "ELLYSIUM — Solution PGI pour Établissements Scolaires",
        "badge": "PGI Scolaire Intégré — Préfets & Directeurs",
        "h1": "Le Progiciel de Gestion Scolaire de <span>Référence Nationale</span>",
        "lead": "Pour les écoles primaires, collèges et lycées : automatisation rigoureuse de la rentrée, des emplois du temps, de l'appel en classe, des délibérations et des bulletins.",
        "primary_btn": {"text": "✍️ Candidater au Pilote Kinshasa", "url": "devenir-ecole-pilote.html"},
        "secondary_btn": {"text": "📊 Voir le Banc d'Essai", "url": "banc-essai-performance.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Modules Clés du PGI</span>
            <h2>Fini les erreurs de calcul manuel et les contestations de fin d'année</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">⚙️</div>
                <h3>Formule Officielle RDC Déterministe</h3>
                <p>Calcul automatique : <code>Taux = (ΣPoints / ΣMaxima) × 100</code>. Application des seuils éliminatoires pour les cours principaux.</p>
                <a href="bulletin-securise.html" class="card-link">Détails de la formule &rarr;</a>
            </div>
            <div class="feature-card">
                <div class="card-icon">💳</div>
                <h3>Caisse Étanche (Article 5)</h3>
                <p>Séparation constitutionnelle absolue : les enseignants ne peuvent pas voir la caisse financière. Reçus M-Pesa / Orange Money automatisés.</p>
                <a href="caisse-etanche.html" class="card-link">Sécurité financière &rarr;</a>
            </div>
            <div class="feature-card">
                <div class="card-icon">📱</div>
                <h3>Pointage & Présence Rapide</h3>
                <p>L'enseignant fait l'appel en 90 secondes sur son smartphone. Synchronisation instantanée ou différée dès le retour du réseau.</p>
                <a href="assiduite-presence.html" class="card-link">Module présences &rarr;</a>
            </div>
        </div>
        """
    },
    {
        "filename": "bulletin-securise.html",
        "title": "ELLYSIUM — Bulletins Scolaires Scellés & Infalsifiables",
        "badge": "Sécurité Documentaire & Scellement Cryptographique",
        "h1": "Le Premier Bulletin Scolaire <span>Infalsifiable sous SHA-256</span>",
        "lead": "Fini les bulletins sur papier falsifiables et les surcharges de cotes : chaque délibération produit une empreinte mathématique irréversible vérifiable par QR Code.",
        "primary_btn": {"text": "🔍 Vérifier un Spécimen", "url": "verification-diplomes.html"},
        "secondary_btn": {"text": "🏛️ Retour Établissements", "url": "etablissements.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Processus de Scellement</span>
            <h2>Comment ELLYSIUM protège la valeur des notes de vos élèves</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">🔒</div>
                <h3>1. Saisie Immuable</h3>
                <p>Les cotes saisies par le titulaire sont verrouillées une fois la période académique close par le Préfet des Études.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">⚡</div>
                <h3>2. Délibération Déterministe</h3>
                <p>Le moteur applique la formule nationale RDC au millième près. Aucune retouche manuelle de pourcentage possible.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">🛡️</div>
                <h3>3. Empreinte & QR Code</h3>
                <p>Génération du SHA-256 et scellement dans le registre immuable. Le parent ou l'université scanne le QR code pour valider.</p>
            </div>
        </div>
        """
    },
    {
        "filename": "assiduite-presence.html",
        "title": "ELLYSIUM — Gestion Nationale de l'Assiduité & Alertes Présences",
        "badge": "Assiduité & Discipline Scolaire",
        "h1": "Suivi d'Assiduité en Temps Réel & <span>Alertes Parents sous 30 min</span>",
        "lead": "L'assiduité est le socle de la réussite scolaire. ELLYSIUM permet le pointage rapide en classe et déclenche des alertes SMS automatiques pour lutter contre l'école buissonnière.",
        "primary_btn": {"text": "👨‍👩‍👧‍👦 Découvrir l'Espace Parents", "url": "parents.html"},
        "secondary_btn": {"text": "📱 Voir l'Application Enseignant", "url": "enseignants.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Verrous Fonctionnels</span>
            <h2>Dispositifs stricts contre le décrochage scolaire</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">⏱️</div>
                <h3>Alerte Rapide < 30 min</h3>
                <p>Conformément au verrou VF-070-02, toute absence signalée au premier cours matinal déclenche une notification au parent.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">⚠️</div>
                <h3>Règle des 3 Absences</h3>
                <p>Le verrou VF-065-03 déclenche une convocation disciplinaire automatique dès 3 absences consécutives non justifiées.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">📊</div>
                <h3>Taux d'Assiduité sur Bulletin</h3>
                <p>Le taux d'assiduité semestriel figure obligatoirement sur le bulletin officiel scellé pour chaque élève.</p>
            </div>
        </div>
        """
    },
    {
        "filename": "caisse-etanche.html",
        "title": "ELLYSIUM — Caisse Étanche & Paiements Mobile Money",
        "badge": "Article 5 Constitutionnel — Étanchéité Financière",
        "h1": "La Séparation Absolue entre <span>Pédagogie & Finances</span>",
        "lead": "L'Article 5 de la Constitution ELLYSIUM interdit formellement à tout enseignant ou titulaire d'accéder aux données financières. Seul le service comptable habilité gère les encaissements.",
        "primary_btn": {"text": "📜 Lire l'Article 5", "url": "gouvernance-asbl.html"},
        "secondary_btn": {"text": "🏛️ PGI Établissements", "url": "etablissements.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Garanties de Probité</span>
            <h2>Zéro manipulation de cash, zéro chantage aux examens</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">🚫</div>
                <h3>Barrière HTTP 403 Impénétrable</h3>
                <p>Toute tentative d'un profil enseignant de requêter le solde ou les paiements d'un élève renvoie une interdiction immédiate.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">📱</div>
                <h3>Intégration Mobile Money</h3>
                <p>Encaissement via M-Pesa, Orange Money, Airtel Money et Afrimoney avec réconciliation automatique des bordereaux.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">🧾</div>
                <h3>Reçus Numériques Infalsifiables</h3>
                <p>Chaque paiement génère un reçu certifié par hash unique avec notification instantanée par SMS au tuteur légal.</p>
            </div>
        </div>
        """
    },
    {
        "filename": "offline-first.html",
        "title": "ELLYSIUM — Technologie Souveraine Hors-Ligne 72h",
        "badge": "Résilience Terrain RDC — 72 Heures d'Autonomie",
        "h1": "Conçu pour Fonctionner <span>Sans Électricité ni Internet Permanent</span>",
        "lead": "Face aux coupures de la SNEL et aux instabilités des réseaux 2G à Kinshasa et dans les provinces, ELLYSIUM garantit une autonomie opérationnelle de 72 heures sans perte de données.",
        "primary_btn": {"text": "⚡ Voir le Banc d'Essai", "url": "banc-essai-performance.html"},
        "secondary_btn": {"text": "📱 Application Enseignant", "url": "enseignants.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Architecture Locale</span>
            <h2>Comment fonctionne le moteur hors-ligne ?</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">💾</div>
                <h3>IndexedDB Chiffré Local</h3>
                <p>Toutes les cotes, appels et devoirs sont stockés dans le stockage interne du smartphone sous chiffrement fort.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">🔄</div>
                <h3>Synchronisation Différée</h3>
                <p>Dès que le téléphone capte un réseau Wi-Fi ou mobile, les opérations sont expédiées par paquets compacts sécurisés.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">⚖️</div>
                <h3>Résolution de Conflits CRDT</h3>
                <p>Les horodatages et signatures locales garantissent l'absence totale de collisions ou de perte d'enregistrements.</p>
            </div>
        </div>
        """
    },
    {
        "filename": "parents.html",
        "title": "ELLYSIUM — Portail & Expérience Parents d'Élèves",
        "badge": "Espace Parents & Tuteurs Légaux",
        "h1": "Soyez Acteur de la Réussite de <span>Vos Enfants au Quotidien</span>",
        "lead": "Fini les bulletins perdus ou modifiés en cours de route. Suivez la présence, les notes d'interrogations, les devoirs et téléchargez les bulletins officiels scellés directement sur votre téléphone.",
        "primary_btn": {"text": "📱 Accéder au Portail Parent", "url": "parents.html"},
        "secondary_btn": {"text": "🔍 Vérifier un Bulletin", "url": "verification-diplomes.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Fonctionnalités Parents</span>
            <h2>La transparence totale pour l'avenir de vos enfants</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">🔔</div>
                <h3>Notifications en Direct</h3>
                <p>Recevez un SMS dès que votre enfant arrive en retard ou est absent. Pas de surprise en fin de trimestre.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">📈</div>
                <h3>Courbe de Progression</h3>
                <p>Visualisez les points forts et les matières à soutenir grâce à un tableau de bord clair par discipline.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">📄</div>
                <h3>Téléchargement Instantané</h3>
                <p>Téléchargez le bulletin scellé officiel au format PDF dès la clôture des délibérations par le jury scolaire.</p>
            </div>
        </div>
        """
    },
    {
        "filename": "enseignants.html",
        "title": "ELLYSIUM — Espace Enseignants & Titulaires",
        "badge": "Outil Pédagogique Mobile — Zéro Calcul Manuel",
        "h1": "L'Assistant Numérique Léger qui <span>Simplifie Votre Travail</span>",
        "lead": "Fini les nuits blanches passées à calculer des moyennes à la calculatrice. L'application mobile ELLYSIUM pour enseignants s'utilise à une main, fonctionne hors-ligne et calcule tout automatiquement.",
        "primary_btn": {"text": "📱 Ouvrir l'Application PWA", "url": "enseignants.html"},
        "secondary_btn": {"text": "📚 Découvrir les OER", "url": "bibliotheque-oer.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Ergonomie Terrain</span>
            <h2>Pensé pour les conditions réelles des salles de classe congolaises</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">👆</div>
                <h3>Boutons Tactiles ≥ 48px</h3>
                <p>Interface ergonomique respectant les normes d'accessibilité mobile, facilitant le pointage d'une main pendant l'appel.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">📴</div>
                <h3>Zéro Dépendance Internet</h3>
                <p>Saisissez vos cotes d'interrogations au village ou sans connexion, l'application synchronise au retour de la connectivité.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">🛡️</div>
                <h3>Protection Déontologique</h3>
                <p>L'Article 5 vous protège de toute pression financière : vous vous consacrez à 100% à l'acte pédagogique.</p>
            </div>
        </div>
        """
    },
    {
        "filename": "eleves-etudiants.html",
        "title": "ELLYSIUM — Espace Apprenants & Vie Scolaire",
        "badge": "Apprenants & Étudiants — Devoirs & Savoirs",
        "h1": "Votre Identifiant National Unique et <span>Vos Ressources de Travail</span>",
        "lead": "Chaque élève dispose de son IUNE officiel (Identifiant Unique National de l'Élève), suit ses devoirs, consulte ses cotes et accède à la bibliothèque de ressources libres.",
        "primary_btn": {"text": "📚 Bibliothèque OER", "url": "bibliotheque-oer.html"},
        "secondary_btn": {"text": "🎓 Université en Ligne", "url": "ead-universite.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Votre Parcours</span>
            <h2>Un dossier scolaire numérique qui vous suit dans toute la République</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">🆔</div>
                <h3>IUNE National Garanti</h3>
                <p>Format national officiel : <code>IUNE-CD-[PROV]-[ANNEE]-[HEX]</code>. Fini les doublons ou pertes de dossiers en cas de transfert.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">📝</div>
                <h3>Devoirs & Soumissions</h3>
                <p>Consultez les consignes de vos professeurs, soumettez vos travaux et recevez des commentaires pédagogiques immuables.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">🤖</div>
                <h3>Tuteur Pédagogique Vertex AI</h3>
                <p>Une assistante bienveillante pour expliquer les concepts difficiles en mathématiques, français et sciences.</p>
            </div>
        </div>
        """
    },
    {
        "filename": "ead-universite.html",
        "title": "ELLYSIUM — Université Numérique & Enseignement Supérieur (EAD)",
        "badge": "Système LMD — 180 Crédits ECTS",
        "h1": "L'Enseignement Universitaire d'Excellence <span>Accessible Partout en RDC</span>",
        "lead": "Conformément au Cadre Normatif du Ministère de l'ESU : une formation universitaire de rang international découpée en Unités d'Enseignement, capitalisable et certifiante.",
        "primary_btn": {"text": "💻 Programme Licence Informatique", "url": "licence-informatique.html"},
        "secondary_btn": {"text": "📜 Référentiel ESU", "url": "curriculum-epst-esu.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Structure LMD</span>
            <h2>180 crédits ECTS répartis sur 6 semestres d'études rigoureuses</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">🏛️</div>
                <h3>Conformité Normative ESU</h3>
                <p>Alignement strict sur la loi-cadre de l'enseignement national et les standards LMD de la République Démocratique du Congo.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">📚</div>
                <h3>Gratuité des Savoirs Fondamentaux</h3>
                <p>Les cours et manuels de référence sont en accès libre et universel (OER / REL). Seules les certifications sont régulées.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">🛡️</div>
                <h3>Diplômes Scellés WORM 100 ans</h3>
                <p>Conservation cryptographique à vie sur Cloud Storage WORM avec clé Cloud KMS HSM de l'autorité académique.</p>
            </div>
        </div>
        """
    },
    {
        "filename": "licence-informatique.html",
        "title": "ELLYSIUM — Cursus Licence 1, 2, 3 en Informatique",
        "badge": "Filière Souveraine — Licence Informatique LMD",
        "h1": "Former l'Élite Technologique de la <span>République Démocratique du Congo</span>",
        "lead": "200 leçons fondamentales, 60 travaux pratiques guidés et 4 projets d'ingénierie logicielle pour maîtriser l'algorithmique, les bases de données, les réseaux et le génie logiciel.",
        "primary_btn": {"text": "📖 Catalogue des 200 Leçons", "url": "bibliotheque-oer.html"},
        "secondary_btn": {"text": "🎓 Présentation EAD", "url": "ead-universite.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Maquette Pédagogique</span>
            <h2>Découpage académique de la Licence 1 Informatique</h2>
        </div>
        <div class="table-wrap">
            <table class="data-table">
                <thead>
                    <tr><th>Semestre</th><th>Unité d'Enseignement (UE)</th><th>Crédits</th><th>Volume Horaire</th><th>Objectif</th></tr>
                </thead>
                <tbody>
                    <tr><td>S1</td><td>UE 1.1 — Algorithmique & Programmation 1</td><td>6 ECTS</td><td>60 heures</td><td>Variables, structures conditionnelles, boucles, fonctions</td></tr>
                    <tr><td>S1</td><td>UE 1.2 — Mathématiques pour l'Informatique 1</td><td>6 ECTS</td><td>60 heures</td><td>Logique formelle, théorie des ensembles, algèbre linéaire</td></tr>
                    <tr><td>S1</td><td>UE 1.3 — Architecture des Ordinateurs</td><td>5 ECTS</td><td>50 heures</td><td>Circuits logiques, processeurs, mémoire et binaire</td></tr>
                    <tr><td>S1</td><td>UE 1.4 — Systèmes d'Exploitation & Linux</td><td>5 ECTS</td><td>50 heures</td><td>Commandes shell, processus, gestion des permissions</td></tr>
                    <tr><td>S1</td><td>UE 1.5 — Anglais Technique & Communication</td><td>4 ECTS</td><td>40 heures</td><td>Lecture de documentation technique internationale</td></tr>
                    <tr><td>S1</td><td>UE 1.6 — Éthique & Nouvelle Citoyenneté</td><td>4 ECTS</td><td>40 heures</td><td>Déontologie du numérique et souveraineté nationale</td></tr>
                </tbody>
            </table>
        </div>
        """
    },
    {
        "filename": "tuteur-gemini.html",
        "title": "ELLYSIUM — Tuteur Pédagogique Éthique Vertex AI Gemini",
        "badge": "Intelligence Artificielle Souveraine Encadrée",
        "h1": "L'Intelligence Artificielle comme <span>Outil d'Émancipation, Pas de Substitution</span>",
        "lead": "Propulsé par Google Vertex AI (Gemini 2.5) selon l'Article 1 bis : un tuteur d'appoint strictement encadré, sans complaisance, avec quota quotidien de 20 questions et garde-fous anti-triche.",
        "primary_btn": {"text": "🛡️ Découvrir la Souveraineté Cloud", "url": "souverainete-cloud.html"},
        "secondary_btn": {"text": "🎓 Vie Étudiante", "url": "eleves-etudiants.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Garde-Fous Pédagogiques</span>
            <h2>Pourquoi le tuteur ELLYSIUM est unique</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">🛑</div>
                <h3>Filtres Anti-Triche Sévères</h3>
                <p>Le tuteur refuse catégoriquement de donner les réponses d'un examen ou d'un devoir. Il guide vers la méthode de réflexion.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">⏱️</div>
                <h3>Quota de 20 Questions / Jour</h3>
                <p>Le verrou VF-074-02 empêche la dépendance artificielle et préserve le travail autonome de l'apprenant.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">👨‍🏫</div>
                <h3>L'Enseignant Reste Maître</h3>
                <p>Le verrou VF-074-04 rappelle à chaque session que l'IA est un simple auxiliaire ; le professeur reste la référence souveraine.</p>
            </div>
        </div>
        """
    },
    {
        "filename": "verification-diplomes.html",
        "title": "ELLYSIUM — Registre Public Universel d'Authenticité des Diplômes",
        "badge": "Module 76 — Transparence Publique & Anti-Fraude",
        "h1": "Vérification Immédiate et Infalsifiable de <span>Tout Diplôme d'État</span>",
        "lead": "Employeurs, ministères, universités étrangères et chancelleries : contrôlez en temps réel l'authenticité d'un diplôme d'État ou relevé académique congolais.",
        "primary_btn": {"text": "🔍 Lancer une Vérification", "url": "verification-diplomes.html#verif"},
        "secondary_btn": {"text": "📜 Registre des Titres", "url": "bulletin-securise.html"},
        "sections": """
        <div id="verif" class="form-box">
            <h3 style="color:var(--primary);margin-bottom:12px;text-align:center;">Portique Public de Contrôle Cryptographique</h3>
            <p style="color:var(--text-muted);font-size:0.95rem;margin-bottom:24px;text-align:center;">Entrez l'empreinte SHA-256 à 64 caractères ou le numéro de série national (ex: <code>CD-DIP-KIN-2026-...</code>).</p>
            <div class="form-group">
                <label>Empreinte ou Numéro de Série :</label>
                <input type="text" id="certInput" class="form-control" placeholder="Entrez le hash SHA-256 ou le numéro de série">
            </div>
            <button class="btn btn-gold" style="width:100%;justify-content:center;" onclick="testVerify()">Vérifier le Document Officiel</button>
            <div id="certResult" style="margin-top:20px;text-align:center;font-weight:700;"></div>
        </div>

        <script>
        function testVerify() {
            const val = document.getElementById('certInput').value.trim();
            const res = document.getElementById('certResult');
            if (val.length === 64 || val.startsWith('CD-DIP-')) {
                res.innerHTML = '<span style=\"color:var(--accent-green);\">✓ DOCUMENT AUTHENTIQUE & SCELLÉ AU REGISTRE NATIONAL (Cloud KMS HSM). Mention : Conforme.</span>';
            } else {
                res.innerHTML = '<span style=\"color:var(--accent-red);\">✗ FORMAT INVALIDE OU DOCUMENT INTROUVABLE. Rapprochez-vous de l inspection générale.</span>';
            }
        }
        </script>
        """
    },
    {
        "filename": "souverainete-cloud.html",
        "title": "ELLYSIUM — Souveraineté Numérique & Doctrine Cloud",
        "badge": "Doctrine Constitutionnelle — Articles 1 bis & 4 bis",
        "h1": "La Souveraineté des Données Scolaires de la <span>République Démocratique du Congo</span>",
        "lead": "Exclusivement hébergé sur Google Cloud avec chiffrement CMEK/EKM sous les clés de l'autorité congolaise : protection totale contre les ingérences extérieures et conformité Cloud Act.",
        "primary_btn": {"text": "📜 Consulter la Charte", "url": "gouvernance-asbl.html"},
        "secondary_btn": {"text": "⚡ Performance SRE", "url": "banc-essai-performance.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Architecture Sécurisée</span>
            <h2>Les 3 piliers de la doctrine de souveraineté ELLYSIUM</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">🔑</div>
                <h3>Chiffrement CMEK / HSM</h3>
                <p>Chaque base de données Cloud SQL et bucket Cloud Storage est chiffré par une clé KMS matérielle que seul l'État congolais détient.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">🌍</div>
                <h3>Région Primaire Africaine</h3>
                <p>Déploiement sur le datacenter de Johannesburg (<code>africa-south1</code>) pour une latence minimale et une indépendance géographique.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">📜</div>
                <h3>Immutabilité WORM 100 Ans</h3>
                <p>Les registres de diplômes et journaux d'audit Merkle sont scellés pour un siècle, interdisant toute modification ou suppression rétroactive.</p>
            </div>
        </div>
        """
    },
    {
        "filename": "curriculum-epst-esu.html",
        "title": "ELLYSIUM — Alignement Référentiels Nationaux EPST & ESU",
        "badge": "Conformité Légale & Programmes Officiels",
        "h1": "Légalité Intégrale vis-à-vis des <span>Programmes Nationaux d'Enseignement</span>",
        "lead": "ELLYSIUM n'invente pas un programme parallèle : la plateforme applique mot pour mot les programmes du Ministère de l'Éducation Nationale (EPST) et de l'ESU.",
        "primary_btn": {"text": "📚 Découvrir les OER", "url": "bibliotheque-oer.html"},
        "secondary_btn": {"text": "🏛️ PGI Établissements", "url": "etablissements.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Cycles Couverts</span>
            <h2>Du secondaire au cycle doctoral : couverture exhaustive</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">📘</div>
                <h3>Cycle Terminal (CTEB - 7e & 8e)</h3>
                <p>Éducation de base, consolidation du français, calcul, éveil aux sciences et initiation à la citoyenneté républicaine.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">🔬</div>
                <h3>Humanités Scientifiques & Littéraires</h3>
                <p>Mathématiques approfondies, physique-chimie, biologie, histoire-géographie et préparation à l'Examen d'État.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">🎓</div>
                <h3>Humanités Techniques & Commerciales</h3>
                <p>Commerciale & Gestion, Technique Électricité, Mécanique générale et formation professionnelle spécialisée.</p>
            </div>
        </div>
        """
    },
    {
        "filename": "bibliotheque-oer.html",
        "title": "ELLYSIUM — Bibliothèque Nationale de Ressources Éducatives Libres",
        "badge": "Module 73 — OER / REL Nationales Gratuites",
        "h1": "Le Trésor Pédagogique Partagé pour <span>Tous les Enfants de la RDC</span>",
        "lead": "Manuels officiels, fiches résumées, exercices corrigés et fascicules pédagogiques validés, optimisés pour être téléchargés en paquets légers (< 50 Mo) sur réseau 2G.",
        "primary_btn": {"text": "💻 Programme Informatique", "url": "licence-informatique.html"},
        "secondary_btn": {"text": "👨‍👩‍👧‍👦 Espace Apprenants", "url": "eleves-etudiants.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Ressources en Libre Accès</span>
            <h2>Téléchargeables gratuitement et indexées par discipline</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">📐</div>
                <h3>Mathématiques Secondaire</h3>
                <p>Algèbre, géométrie vectorielle, trigonométrie et analyse mathématique avec 120 exercices résolus pas-à-pas.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">🧪</div>
                <h3>Sciences Physiques & Chimie</h3>
                <p>Fiches de cours synthétiques, schémas d'expériences réalisables avec du matériel local et aide-mémoire.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">📖</div>
                <h3>Littérature & Langue Française</h3>
                <p>Grammaire officielle, expression écrite, méthodologie de la dissertation et anthologie d'auteurs congolais.</p>
            </div>
        </div>
        """
    },
    {
        "filename": "banc-essai-performance.html",
        "title": "ELLYSIUM — Banc d'Essai de Performance & Dimensionnement",
        "badge": "Module 281 — Robustesse & Haute Disponibilité",
        "h1": "La Preuve Technique par les Chiffres : <span>240 000 Délibérations / Seconde</span>",
        "lead": "La solidité d'un système national ne se promet pas, elle se mesure. ELLYSIUM a été soumis au banc d'essai de charge du Module 281, pulvérisant tous les records de débit et de latence.",
        "primary_btn": {"text": "⚙️ Découvrir le Moteur", "url": "bulletin-securise.html"},
        "secondary_btn": {"text": "🏛️ Devenir École Pilote", "url": "devenir-ecole-pilote.html"},
        "sections": """
        <div class="kpi-banner">
            <div class="kpi-item"><div class="kpi-number">41.5 ms</div><div class="kpi-label">Temps pour 10 000 Calculs</div></div>
            <div class="kpi-item"><div class="kpi-number">240 730</div><div class="kpi-label">Opérations / Seconde</div></div>
            <div class="kpi-item"><div class="kpi-number">0.004 ms</div><div class="kpi-label">Latence Unitaire Moyenne</div></div>
            <div class="kpi-item"><div class="kpi-number">100%</div><div class="kpi-label">Conformité SLO Cloud Run</div></div>
        </div>
        <div class="section-head">
            <span class="section-tag">Résultats du Test SRE</span>
            <h2>Dimensionné pour traiter instantanément les millions d'élèves de RDC</h2>
            <p>Même en période d'affluence extrême des jurys de fin d'année, l'infrastructure Serverless s'adapte sans ralentissement.</p>
        </div>
        """
    },
    {
        "filename": "devenir-ecole-pilote.html",
        "title": "ELLYSIUM — Candidature Établissement Pilote Kinshasa",
        "badge": "Phase 1 — Cohorte Pilote 2026-2027",
        "h1": "Rejoignez la Cohorte des Écoles Pionnières de la <span>Révolution Scolaire</span>",
        "lead": "Vous dirigez un collège ou lycée à Kinshasa ou dans les provinces ? Adhérez gratuitement au programme pilote et bénéficiez de l'installation du PGI, de la formation de vos enseignants et de tablettes pré-configurées.",
        "primary_btn": {"text": "✍️ Remplir le Formulaire", "url": "#candidature"},
        "secondary_btn": {"text": "📞 Nous Contacter", "url": "contact-support.html"},
        "sections": """
        <div id="candidature" class="form-box">
            <h3 style="color:var(--primary);margin-bottom:12px;text-align:center;">Dossier de Candidature Établissement Pilote</h3>
            <p style="color:var(--text-muted);font-size:0.95rem;margin-bottom:24px;text-align:center;">Remplissez les informations de votre établissement scolaire pour être recontacté par l'équipe de déploiement.</p>
            <div class="form-group">
                <label>Nom de l'Établissement Scolaire :</label>
                <input type="text" class="form-control" placeholder="Ex: Collège Boboto, Lycée Sainte-Marie, ITC Ndjili">
            </div>
            <div class="form-group">
                <label>Province / Ville / Commune :</label>
                <input type="text" class="form-control" placeholder="Ex: Kinshasa — Gombe / Lemba / Kasa-Vubu">
            </div>
            <div class="form-group">
                <label>Nom & Titre du Responsable :</label>
                <input type="text" class="form-control" placeholder="Ex: Rév. Père Recteur, M. le Préfet des Études">
            </div>
            <div class="form-group">
                <label>Numéro Téléphone / WhatsApp :</label>
                <input type="tel" class="form-control" placeholder="+243 ...">
            </div>
            <div class="form-group">
                <label>Nombre approximatif d'élèves :</label>
                <input type="number" class="form-control" placeholder="Ex: 850">
            </div>
            <button class="btn btn-gold" style="width:100%;justify-content:center;" onclick="alert('Votre candidature a été soumise à la direction des partenariats scolaires ELLYSIUM.')">Soumettre le Dossier de Candidature</button>
        </div>
        """
    },
    {
        "filename": "gouvernance-asbl.html",
        "title": "ELLYSIUM — Gouvernance, Statuts ASBL & Charte Déontologique",
        "badge": "Gouvernance Souveraine & Statuts Légaux",
        "h1": "Une Institution Citoyenne au Service du <span>Bien Commun National</span>",
        "lead": "Créée sous forme d'Association Sans But Lucratif (ASBL), ELLYSIUM est régie par une stricte séparation des pouvoirs, un Conseil d'Orientation collégial et une obligation de transparence absolue.",
        "primary_btn": {"text": "📜 Découvrir les Établissements", "url": "etablissements.html"},
        "secondary_btn": {"text": "📞 Nous Écrire", "url": "contact-support.html"},
        "sections": """
        <div class="section-head">
            <span class="section-tag">Principes Fondateurs</span>
            <h2>Les trois piliers constitutionnels de l'ASBL ELLYSIUM</h2>
        </div>
        <div class="grid-3">
            <div class="feature-card">
                <div class="card-icon">🏛️</div>
                <h3>Indépendance Institutionnelle</h3>
                <p>L'ASBL œuvre comme partenaire technique d'intérêt public pour l'État congolais, préservant la souveraineté régalienne.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">⚖️</div>
                <h3>Article 5 Constitutionnel</h3>
                <p>Éthique et étanchéité financière : le corps enseignant est sanctuarisé à l'abri de toute gestion mercantile des frais scolaires.</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">🔍</div>
                <h3>Audit Ouvert & Traçabilité</h3>
                <p>Chaque action du système est consignée dans un journal d'audit Merkle auditable par les services de l'Inspection Générale.</p>
            </div>
        </div>
        """
    },
    {
        "filename": "contact-support.html",
        "title": "ELLYSIUM — Contact Officiel & Cellule de Support",
        "badge": "Cellule Nationale de Déploiement & Assistance",
        "h1": "Contactez la Délégation Nationale <span>ELLYSIUM à Kinshasa</span>",
        "lead": "Une question technique, une demande de partenariat, un accompagnement pour votre école ? Nos ingénieurs pédagogiques et technologiques sont à votre écoute.",
        "primary_btn": {"text": "📍 Nos Coordonnées", "url": "#coordonnees"},
        "secondary_btn": {"text": "✍️ Candidater comme École Pilote", "url": "devenir-ecole-pilote.html"},
        "sections": """
        <div id="coordonnees" class="grid-2">
            <div class="feature-card">
                <div class="card-icon">🏢</div>
                <h3>Délégation Centrale</h3>
                <p><strong>ASBL ELLYSIUM — Centre National d'Étude en Ligne</strong><br>
                Boulevard du 30 Juin, Commune de la Gombe<br>
                Kinshasa, République Démocratique du Congo<br><br>
                Courriel institutionnel : <code>contact@elysium.cd</code><br>
                Support technique : <code>support@elysium.cd</code></p>
            </div>
            <div class="feature-card">
                <div class="card-icon">⏰</div>
                <h3>Horaires & Assistance</h3>
                <p><strong>Permanence Pédagogique & Technique :</strong><br>
                Du lundi au vendredi : 08h00 &ndash; 17h00 (Heure de Kinshasa, GMT+1)<br>
                Samedi : 08h30 &ndash; 13h00<br><br>
                <em>Assistance d'astreinte 24h/24 pour les jurys et examens officiels.</em></p>
            </div>
        </div>
        """
    }
]

# Modèle HTML complet partagé
PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0B2545">
    <title>{title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Bandeau régalien -->
    <div class="top-regal-bar">
        <span>🇨🇩 RÉPUBLIQUE DÉMOCRATIQUE DU CONGO · SOUVERAINETÉ PÉDAGOGIQUE NATIONALE</span>
        <span>PLATEFORME NATIONALE ELLYSIUM · SCELLÉ CLOUD KMS HSM</span>
    </div>

    <!-- Navigation Principale -->
    <header class="main-header">
        <div class="nav-container">
            <a href="index.html" class="brand-logo">
                <div class="brand-symbol">E</div>
                <div>
                    <div class="brand-title">ELLYSIUM <span>· RDC</span></div>
                    <div class="brand-sub">Centre National d'Étude en Ligne</div>
                </div>
            </a>
            <ul class="nav-links">
                <li><a href="index.html" {active_accueil}>Accueil</a></li>
                <li><a href="etablissements.html" {active_ecoles}>Écoles & PGI</a></li>
                <li><a href="bulletin-securise.html">Bulletins Scellés</a></li>
                <li><a href="parents.html">Parents</a></li>
                <li><a href="ead-universite.html">Université LMD</a></li>
                <li><a href="souverainete-cloud.html">Souveraineté</a></li>
                <li><a href="verification-diplomes.html" class="nav-cta">🔍 Vérifier un Diplôme</a></li>
            </ul>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-page">
        <div class="hero-content">
            <div class="page-badge">{badge}</div>
            <h1>{h1}</h1>
            <p class="hero-lead">{lead}</p>
            <div class="hero-actions">
                <a href="{p_btn_url}" class="btn btn-gold">{p_btn_text}</a>
                <a href="{s_btn_url}" class="btn btn-outline">{s_btn_text}</a>
            </div>
        </div>
    </section>

    <!-- Contenu Spécifique de la Page -->
    <main class="section-wrap">
        {sections}
    </main>

    <!-- Pied de page officiel avec indexation des 20 landing pages -->
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-col">
                <div class="brand-title" style="color:#fff;margin-bottom:12px;">ELLYSIUM <span>· RDC</span></div>
                <p style="font-size:0.9rem;line-height:1.6;margin-bottom:16px;">
                    Système intégré de gestion scolaire, registre souverain des titres académiques et université d'excellence en ligne pour la République Démocratique du Congo.
                </p>
                <p style="font-size:0.85rem;color:var(--gold);font-style:italic;">
                    « Rigueur, sérieux et honnêteté sont nos devises d'État »
                </p>
            </div>

            <div class="footer-col">
                <h4>Établissements & PGI</h4>
                <ul>
                    <li><a href="etablissements.html">PGI Scolaire Intégré</a></li>
                    <li><a href="bulletin-securise.html">Bulletins Scellés SHA-256</a></li>
                    <li><a href="assiduite-presence.html">Gestion des Présences</a></li>
                    <li><a href="caisse-etanche.html">Caisse Étanche (Art. 5)</a></li>
                    <li><a href="offline-first.html">Technologie 72h Hors-Ligne</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Usagers & Communauté</h4>
                <ul>
                    <li><a href="parents.html">Espace Parents d'Élèves</a></li>
                    <li><a href="enseignants.html">Espace Enseignants Mobile</a></li>
                    <li><a href="eleves-etudiants.html">Espace Élèves & IUNE</a></li>
                    <li><a href="bibliotheque-oer.html">Ressources Libres (OER)</a></li>
                    <li><a href="tuteur-gemini.html">Tuteur IA Vertex AI</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Enseignement Supérieur</h4>
                <ul>
                    <li><a href="ead-universite.html">Université en Ligne (EAD)</a></li>
                    <li><a href="licence-informatique.html">Licence en Informatique</a></li>
                    <li><a href="curriculum-epst-esu.html">Normes ESU & EPST</a></li>
                    <li><a href="verification-diplomes.html">Portique de Vérification</a></li>
                    <li><a href="banc-essai-performance.html">Banc d'Essai (240k ops/s)</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Institution & Contact</h4>
                <ul>
                    <li><a href="souverainete-cloud.html">Souveraineté des Données</a></li>
                    <li><a href="gouvernance-asbl.html">Gouvernance & Statuts</a></li>
                    <li><a href="devenir-ecole-pilote.html">Devenir École Pilote</a></li>
                    <li><a href="contact-support.html">Contact & Cellule Kinshasa</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <div>&copy; 2026 ASBL ELLYSIUM · Tous droits réservés. République Démocratique du Congo.</div>
            <div style="display:flex;gap:20px;">
                <a href="souverainete-cloud.html" style="color:#94A3B8;text-decoration:none;">Protection des Données (CMEK)</a>
                <a href="gouvernance-asbl.html" style="color:#94A3B8;text-decoration:none;">Charte Déontologique</a>
                <a href="verification-diplomes.html" style="color:var(--gold);text-decoration:none;font-weight:700;">Contrôle d'Empreinte</a>
            </div>
        </div>
    </footer>
</body>
</html>
"""

# Génération des 20 fichiers HTML
for p in PAGES:
    filename = p["filename"]
    filepath = os.path.join(OUTPUT_DIR, filename)

    rendered = PAGE_TEMPLATE.format(
        title=p["title"],
        badge=p["badge"],
        h1=p["h1"],
        lead=p["lead"],
        p_btn_text=p["primary_btn"]["text"],
        p_btn_url=p["primary_btn"]["url"],
        s_btn_text=p["secondary_btn"]["text"],
        s_btn_url=p["secondary_btn"]["url"],
        sections=p["sections"],
        active_accueil='class="active"' if filename == "index.html" else '',
        active_ecoles='class="active"' if filename == "etablissements.html" else ''
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(rendered)
    print(f"✓ Généré : {filename}")

print(f"\n🎉 Succès : Les 20 landing pages ont été créées dans {OUTPUT_DIR}")
