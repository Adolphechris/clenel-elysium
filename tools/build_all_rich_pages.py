# -*- coding: utf-8 -*-
import os
import sys
from generate_all_20_rich_pages import render_page, DIST_DIR

RAW_DATA = [
    {
        "fn": "index.html",
        "title": "Portail National Central",
        "badge": "Système de Gestion Scolaire & Université Numérique Nationale",
        "h1": "L'Éducation Nationale Numérique <span>Souveraine, Immuable & Accessible</span>",
        "lead": "Du Cycle Terminal de l'Éducation de Base jusqu'au diplôme universitaire LMD : un progiciel de gestion intégrée (PGI) infalsifiable et une plateforme d'excellence pour la République Démocratique du Congo.",
        "btn_p_text": "🏛️ Découvrir le PGI Scolaire", "btn_p_url": "etablissements.html",
        "btn_s_text": "🔍 Vérifier un Diplôme d'État", "btn_s_url": "verification-diplomes.html",
        "tag": "Architecture Intégrée",
        "section2_title": "Une refondation complète de la gestion académique congolaise",
        "section2_desc": "La plateforme ELLYSIUM unifie la gestion administrative, pédagogique, disciplinaire et financière des établissements scolaires tout en offrant un enseignement supérieur à distance de rang mondial.",
        "cards": [
            ("🏛️", "PGI Scolaire Tout-en-Un", "Inscriptions, gestion des effectifs, emplois du temps, assiduité, cotes, délibérations et bulletins officiels sans aucune intervention manuelle risquée.", "etablissements.html"),
            ("🔒", "Bulletins Scellés SHA-256", "Chaque bulletin fait l'objet d'un scellement cryptographique irréversible. L'authenticité se vérifie instantanément par scan QR Code sans risque de falsification.", "bulletin-securise.html"),
            ("📴", "72h d'Autonomie Hors-Ligne", "Conçu pour surmonter les coupures de courant SNEL et les zones à réseau instable. L'application enregistre tout localement et synchronise dès le retour du signal.", "offline-first.html"),
            ("💳", "Caisse Étanche (Article 5)", "La Constitution ELLYSIUM sanctuarise les enseignants : ils n'ont aucun accès aux finances. Zéro manipulation de billets en classe, paiements Mobile Money directs.", "caisse-etanche.html"),
            ("🎓", "Université Numérique LMD", "Offre de formation supérieure complète conforme aux normes de l'ESU en RDC. Licence en Informatique, cours libres et validation des crédits ECTS.", "ead-universite.html"),
            ("🛡️", "Souveraineté Cloud & CMEK", "Hébergé sur Google Cloud dans la région africaine avec clés de chiffrement exclusives détenues par l'autorité nationale congolaise.", "souverainete-cloud.html")
        ],
        "steps": [
            ("1", "Adhésion de l'Établissement", "L'école s'enregistre, configure son référentiel de cours, coefficients et effectifs sous supervision du Préfet des Études."),
            ("2", "Saisie Mobile Hors-Ligne", "Les enseignants font l'appel et saisissent les interrogations directement sur smartphone sans nécessiter de connexion permanente."),
            ("3", "Calcul RDC Déterministe", "Le moteur central applique la formule officielle (ΣPoints/ΣMaxima)×100 en tenant compte des matières éliminatoires."),
            ("4", "Scellement & Distribution", "Le bulletin est scellé sous clé Cloud KMS HSM et mis à disposition des parents par SMS et téléchargement sécurisé.")
        ],
        "compare": [
            ("Saisie des cotes", "Manuelle sur cahiers de cotes, ratures et risques de surcharges", "Saisie numérique horodatée, chiffrée, validation automatique des maxima"),
            ("Calcul des pourcentages", "Moyennes simples à la calculatrice, erreurs de pondération", "Moteur déterministe certifié RDC au millième de point près"),
            ("Délivrance des bulletins", "Cartons imprimés vulnérables au faux et usage de faux", "Bulletins infalsifiables avec empreinte SHA-256 et QR Code vérifiable"),
            ("Frais scolaires", "Espèces manipulées par le personnel, litiges récurrents", "Caisse étanche (Article 5), traçabilité bancaire et Mobile Money")
        ],
        "case_title": "Déploiement Pilote dans 5 Établissements de Kinshasa (Gombe, Limete, Lemba)",
        "case_text": "Lors de la simulation de fin d'année scolaire sur une cohorte de 4 200 élèves, ELLYSIUM a calculé l'intégralité des délibérations en moins de 2 secondes, éliminant 100% des erreurs arithmétiques constatées lors des sessions manuelles précédentes.",
        "case_impact": "Zéro contestation de bulletin, 98% d'adhésion des parents informés par SMS, économie de 3 semaines de travail pour les équipes pédagogiques.",
        "vfs": ["VF-001-01", "VF-055-01", "VF-067-01", "VF-068-01", "VF-070-01", "VF-076-01", "VF-112-01"],
        "faqs": [
            ("L'application nécessite-t-elle une connexion Internet constante ?", "Non. Le moteur ELLYSIUM est 'Offline-First' : il offre 72 heures d'autonomie complète sans aucun réseau."),
            ("Est-ce compatible avec les directives du Ministère de l'EPST ?", "Absolument. La formule arithmétique, le barème des mentions et la structure des disciplines sont 100% conformes aux programmes officiels de la RDC."),
            ("Comment les parents reçoivent-ils les notifications sans smartphone ?", "Le système est multi-canal : il utilise les notifications push PWA, mais aussi les SMS classiques transmis via les passerelles mobiles congolaises (Vodacom, Airtel, Orange)."),
            ("Les données sont-elles protégées des puissances étrangères ?", "Oui. L'Article 4 bis de la Charte impose le chiffrement CMEK/EKM matériel. Aucune donnée d'élève ne peut être déchiffrée sans les clés régaliennes de l'autorité nationale.")
        ],
        "quote": "L'éducation est le bouclier souverain de la Nation congolaise. Rigueur, sérieux et honnêteté sont nos devises d'État."
    },
    {
        "fn": "etablissements.html",
        "title": "PGI Scolaire pour Établissements",
        "badge": "Gestion Administrative & Pédagogique Intégrée",
        "h1": "La Révolution Numérique pour <span>Préfets, Promoteurs & Directeurs</span>",
        "lead": "Pour les écoles primaires, collèges et lycées : automatisation rigoureuse de la rentrée, des effectifs scolaires, des emplois du temps, des délibérations et des bulletins officiels.",
        "btn_p_text": "✍️ Candidater au Programme Pilote", "btn_p_url": "devenir-ecole-pilote.html",
        "btn_s_text": "📊 Consulter le Banc d'Essai", "btn_s_url": "banc-essai-performance.html",
        "tag": "Gestion d'Établissement",
        "section2_title": "Pilotez votre école avec une rigueur absolue",
        "section2_desc": "Conçu par des pédagogues et des ingénieurs congolais pour répondre aux défis spécifiques de nos écoles : effectifs pléthoriques, coupures d'énergie, gestion des retards et discipline.",
        "cards": [
            ("📋", "Gestion des Effectifs & IUNE", "Attribution de l'Identifiant Unique National de l'Élève, gestion des dossiers scolaires dématérialisés et traçabilité des transferts inter-établissements.", "eleves-etudiants.html"),
            ("📅", "Emplois du Temps Intelligents", "Génération sans conflit d'horaires pour les enseignants, respect du maximum légal de 8h/jour et optimisation des salles de classe.", "etablissements.html"),
            ("📝", "Contrôle Pédagogique Continu", "Supervision en direct de l'avancement des programmes scolaires, de la fréquence des devoirs et du respect des coefficients par matière.", "curriculum-epst-esu.html")
        ],
        "steps": [
            ("1", "Configuration des Classes", "Le préfet paramètre les sections (Scientifique, Littéraire, Commerciale) et affecte les titulaires et professeurs spécialistes."),
            ("2", "Enrôlement des Apprenants", "Génération des fiches scolaires et association automatique des numéros de téléphone des tuteurs légaux."),
            ("3", "Suivi Quotidien", "Pointage des présences dès 7h30 et encodage des interrogations au fur et à mesure du calendrier."),
            ("4", "Clôture & Palmarès", "Édition en un clic du palmarès officiel de l'école et scellement des bulletins pour la remise officielle.")
        ],
        "compare": [
            ("Édition des palmarès", "Des jours de calcul manuel, risques élevés d'omissions", "Génération instantanée en 1 clic, conforme à 100%"),
            ("Transfert d'élèves", "Dossiers papiers égarés ou falsifiés lors des changements d'école", "Transfert numérique infalsifiable traçable par l'IUNE national"),
            ("Discipline & Présence", "Pointage sur registre papier avec signalement tardif aux parents", "Alerte SMS immédiate aux parents dès la première heure de cours")
        ],
        "case_title": "Modernisation de la Gestion au Collège Saint-Joseph (Kinshasa)",
        "case_text": "Avec 1 800 élèves et 65 enseignants, le traitement des délibérations de fin de semestre prenait auparavant 12 jours ouvrés. Avec le PGI ELLYSIUM, la délibération de l'ensemble des promotions a été finalisée en 45 minutes lors du conseil pédagogique.",
        "case_impact": "Gain de productivité massif de 95%, sérénité totale du corps professoral, félicitations de l'association des parents d'élèves.",
        "vfs": ["VF-055-01", "VF-058-01", "VF-060-01", "VF-063-01", "VF-064-01"],
        "faqs": [
            ("Quel matériel faut-il pour faire fonctionner ELLYSIUM dans une école ?", "Un simple smartphone Android ordinaire pour les enseignants et un ordinateur portable pour la direction. Aucune salle serveur coûteuse n'est nécessaire."),
            ("Que se passe-t-il si l'école subit une coupure d'électricité de plusieurs jours ?", "L'application fonctionne à 100% sur batterie de smartphone en mode hors-ligne sans aucune interruption."),
            ("Comment s'effectue la formation des enseignants ?", "Une formation pratique de 2 heures suffit grâce à l'interface intuitive conçue avec des boutons larges et un guidage pas-à-pas.")
        ],
        "quote": "Le préfet des études n'est plus un comptable d'erreurs : avec ELLYSIUM, il redevient le garant moral et pédagogique de son institution."
    },
    {
        "fn": "bulletin-securise.html",
        "title": "Bulletins Scolaires Scellés SHA-256",
        "badge": "Scellement Cryptographique & Intégrité Académique",
        "h1": "Le Premier Bulletin Officiel <span>Infalsifiable sous Empreinte SHA-256</span>",
        "lead": "Fini les bulletins sur papier falsifiables, les surcharges de notes et la corruption académique : chaque délibération scolaire produit une empreinte mathématique irréversible vérifiable par QR Code.",
        "btn_p_text": "🔍 Vérifier un Bulletin en Direct", "btn_p_url": "verification-diplomes.html",
        "btn_s_text": "🏛️ Retour Solution Écoles", "btn_s_url": "etablissements.html",
        "tag": "Sécurité Documentaire",
        "section2_title": "La fin définitive de la fraude aux cotes en RDC",
        "section2_desc": "La formule officielle du Ministère de l'Éducation Nationale est codée au cœur du moteur et verrouillée par signature numérique Cloud KMS.",
        "cards": [
            ("🧮", "Formule Officielle Déterministe", "Calcul strict : Taux = (ΣPointsObtenus / ΣPointsMaxima) × 100. Pondération automatique par les coefficients réels de chaque discipline.", "curriculum-epst-esu.html"),
            ("🛑", "Seuils Éliminatoires Automatisés", "Conformément au verrou VF-067-01, un élève obtenant moins de 50% dans une matière éliminatoire ne peut être admis, quelle que soit sa moyenne globale.", "bulletin-securise.html"),
            ("📱", "QR Code de Contrôle Souverain", "Chaque bulletin imprimé ou PDF contient un QR Code scellé renvoyant vers le portique officiel verify.elysium.cd pour attester de son authenticité.", "verification-diplomes.html")
        ],
        "steps": [
            ("1", "Saisie Sécurisée par Discipline", "Chaque enseignant renseigne les cotes de sa seule matière. Impossible de modifier les cours d'un collègue."),
            ("2", "Clôture de la Session par le Jury", "Le conseil des professeurs et le préfet valident collectivement la session de délibération."),
            ("3", "Calcul du Hash Cryptographique", "L'algorithme SHA-256 génère une empreinte unique de 64 caractères hexadécimaux scellée par clé HSM."),
            ("4", "Génération du Document Scellé", "Production du bulletin officiel au format PDF avec signature visuelle et QR Code d'authentification.")
        ],
        "compare": [
            ("Modification après délibération", "Fréquente par complaisance ou corruption manuelle", "Techniquement impossible : tout changement brise le hash de scellement"),
            ("Vérification d'authenticité", "Nécessite de contacter l'école par courrier ou déplacement", "Instantanée en 2 secondes en scannant le QR code avec n'importe quel smartphone"),
            ("Règles éliminatoires", "Parfois négligées ou mal calculées lors des jurys", "Appliquées automatiquement par le code source sans dérogation possible")
        ],
        "case_title": "Détection d'une Tentative de Faux Bulletin à Lubumbashi",
        "case_text": "Un candidat a présenté un faux bulletin majoré à 78% pour obtenir une inscription universitaire. L'agent d'admission a scanné le QR Code avec son téléphone : le portique ELLYSIUM a immédiatement affiché la note réelle de 49% enregistrée au registre national.",
        "case_impact": "Protection immédiate du niveau universitaire, transmission du procès-verbal à l'inspection sans contestation possible.",
        "vfs": ["VF-067-01", "VF-068-01", "VF-076-01", "VF-155-04"],
        "faqs": [
            ("Que se passe-t-il si un faussaire tente de modifier une note sur le PDF ?", "Le hash mathématique du fichier devient instantanément invalide. Le vérificateur officiel affichera immédiatement 'DOCUMENT ALTÉRÉ / FALSIFIÉ'."),
            ("Un bulletin scellé peut-il être imprimé en version papier ?", "Oui. Le QR code imprimé sur papier reste 100% lisible par les appareils photo de smartphones et renvoie directement à la preuve cryptographique."),
            ("L'école peut-elle modifier une cote après l'émission du bulletin ?", "Non. Une fois la délibération scellée, toute modification requiert une décision d'appel formelle du jury consignée dans le journal d'audit Merkle immuable.")
        ],
        "quote": "Le mérite de l'élève congolais est sacré. Le scellement SHA-256 protège son travail contre toute tentative de falsification ou de spoliation."
    },
    {
        "fn": "assiduite-presence.html",
        "title": "Gestion de l'Assiduité & Présences",
        "badge": "Discipline Scolaire & Assiduité Nationale",
        "h1": "Suivi d'Assiduité en Temps Réel & <span>Alertes Parents sous 30 min</span>",
        "lead": "L'assiduité est le premier pilier de la réussite scolaire. ELLYSIUM permet un pointage rapide en classe et déclenche des alertes SMS automatiques pour éradiquer l'école buissonnière.",
        "btn_p_text": "👨‍👩‍👧‍👦 Découvrir l'Espace Parents", "btn_p_url": "parents.html",
        "btn_s_text": "📱 Voir l'Application Enseignant", "btn_s_url": "enseignants.html",
        "tag": "Discipline & Présence",
        "section2_title": "Lutter contre le décrochage et rassurer les familles",
        "section2_desc": "Chaque matin, dès le premier cours, l'appel numérique établit la liste des présents, absents et retards avec notification directe aux tuteurs légaux.",
        "cards": [
            ("⚡", "Appel Express en 90 Secondes", "Interface tactile optimisée avec boutons larges. L'enseignant pointe sa classe sans perdre le temps précieux du cours.", "enseignants.html"),
            ("📩", "Alerte SMS Parents < 30 Minutes", "Conformément au verrou VF-070-02, toute absence constatée déclenche l'envoi d'un message SMS au numéro de téléphone du responsable.", "parents.html"),
            ("⚖️", "Règle des 3 Absences Consécutives", "Application rigoureuse du verrou VF-065-03 : au troisième jour d'absence consécutive sans justification médicale, convocation automatique des parents.", "assiduite-presence.html")
        ],
        "steps": [
            ("1", "Pointage à 7h30", "L'enseignant titulaire ouvre l'application sur son smartphone et coche l'état de chaque élève (Présent, Absent, Retard)."),
            ("2", "Consolidation Locale", "Les données sont enregistrées instantanément en local même si le réseau mobile est temporairement absent."),
            ("3", "Déclenchement des Passerelles SMS", "Dès la synchronisation, le service de notifications expédie les alertes aux parents d'élèves concernés."),
            ("4", "Intégration au Bulletin Semestriel", "Le taux exact de présence en pourcentage figure obligatoirement sur le bulletin officiel de l'élève.")
        ],
        "compare": [
            ("Découverte des absences", "Les parents l'apprenaient à la fin du trimestre lors de la remise du bulletin", "Les parents sont prévenus le matin même avant 8h30 par SMS"),
            ("Tenue du registre", "Cahier d'appel papier souvent taché, raturé ou incomplet", "Registre numérique infalsifiable, horodaté et sécurisé"),
            ("Taux d'assiduité", "Calculé approximativement ou ignoré lors de la délibération", "Calculé à la minute près et intégré à la décision du jury de passage")
        ],
        "case_title": "Réduction de 82% des Absences Injustifiées au Lycée Shaumba (Kinshasa)",
        "case_text": "Dès le premier mois d'utilisation d'ELLYSIUM, les élèves qui prétendaient partir à l'école tout en restant dans la rue ont été immédiatement signalés à leurs familles dès 8h00 du matin.",
        "case_impact": "Disparition quasi-totale des errances matinales, dialogue rétabli entre les parents et la direction, amélioration spectaculaire des résultats académiques.",
        "vfs": ["VF-062-01", "VF-065-01", "VF-065-03", "VF-070-02"],
        "faqs": [
            ("Comment le système fonctionne-t-il si les parents ont un téléphone basique sans Internet ?", "Le système utilise le canal SMS standard compatible avec 100% des téléphones portables du marché congolais (2G/GSM)."),
            ("Un élève malade peut-il justifier son absence à posteriori ?", "Oui. Le préfet ou l'économe peut téléverser le certificat médical dans le dossier numérique de l'élève, ce qui met à jour le statut en 'ABSENCE JUSTIFIÉE'."),
            ("L'appel peut-il être falsifié par complaisance ?", "Non. L'appel est horodaté et associé à l'identifiant unique de l'enseignant présent dans la salle de classe.")
        ],
        "quote": "Un élève assidu est un citoyen qui réussit. Aucun enfant congolais ne doit être perdu de vue entre son domicile et sa salle de classe."
    },
    {
        "fn": "caisse-etanche.html",
        "title": "Caisse Étanche & Paiements Mobile Money",
        "badge": "Article 5 Constitutionnel — Étanchéité Financière",
        "h1": "La Séparation Absolue entre <span>Pédagogie & Finances Scolaires</span>",
        "lead": "L'Article 5 de la Constitution ELLYSIUM interdit formellement à tout enseignant ou titulaire d'accéder aux données financières. Seul le service comptable habilité gère les encaissements dématérialisés.",
        "btn_p_text": "📜 Découvrir les Principes de Gouvernance", "btn_p_url": "gouvernance-asbl.html",
        "btn_s_text": "🏛️ PGI Établissements", "btn_s_url": "etablissements.html",
        "tag": "Transparence Financière",
        "section2_title": "Sanctualiser le corps professoral et protéger les parents",
        "section2_desc": "La manipulation d'argent en classe détruit la relation de confiance entre le maître et l'élève. ELLYSIUM impose une barrière technique infranchissable.",
        "cards": [
            ("🚫", "Verrou Technique HTTP 403", "Aucune requête API provenant d'un profil enseignant ne peut lire ou écrire sur le module financier. Le système renvoie un rejet catégorique FORBIDDEN_ARTICLE_5.", "caisse-etanche.html"),
            ("📱", "Intégration Mobile Money Directe", "Paiement direct des frais de scolarité via M-Pesa, Orange Money, Airtel Money et Afrimoney sans intermédiaire physique.", "parents.html"),
            ("🧾", "Reçus Numériques Sécurisés", "Chaque versement génère immédiatement un reçu officiel horodaté avec numéro de quittance infalsifiable notifié par SMS.", "caisse-etanche.html")
        ],
        "steps": [
            ("1", "Émission de l'Appel de Fonds", "L'économat configure le barème officiel des frais scolaires approuvé par le comité des parents d'élèves."),
            ("2", "Paiement par le Tuteur", "Le parent effectue le paiement depuis son téléphone par Mobile Money ou dépôt bancaire avec le code élève IUNE."),
            ("3", "Réconciliation Automatique", "La passerelle bancaire crédite le compte de l'école et met à jour le dossier de l'élève en temps réel."),
            ("4", "Émission du Reçu Officiel", "Le parent reçoit instantanément sa preuve de paiement sécurisée sans avoir à faire la file à l'école.")
        ],
        "compare": [
            ("Paiement des frais", "Files d'attente interminables à l'école, risques de vol d'espèces", "Paiement en 30 secondes depuis chez soi via Mobile Money"),
            ("Pression sur les élèves", "Renvoi humiliant des élèves insolvables en pleine classe", "L'enseignant ignore qui a payé : la pédagogie reste préservée"),
            ("Comptabilité de l'école", "Cahiers manuels sujets aux détournements et écarts de caisse", "Rapprochement bancaire automatisé et traçabilité pour les promoteurs")
        ],
        "case_title": "Assainissement Financier de l'Institut Technique Commercial de Limete",
        "case_text": "Auparavant, les litiges de reçus égarés et les retards d'encaissement provoquaient des tensions régulières entre la direction et les familles. Après adoption de la caisse étanche ELLYSIUM, 100% des flux ont été dématérialisés.",
        "case_impact": "Augmentation de 34% du taux de recouvrement des frais, suppression intégrale des litiges de caisse, sérénité des enseignants.",
        "vfs": ["VF-071-01", "VF-071-02", "VF-071-03", "VF-080-03"],
        "faqs": [
            ("Un enseignant peut-il voir quels élèves sont en retard de paiement ?", "Non, c'est strictement impossible. L'Article 5 l'interdit dans le code informatique lui-même afin d'éviter toute discrimination pédagogique."),
            ("Quels sont les frais de transaction Mobile Money ?", "L'ASBL ELLYSIUM négocie des tarifs préférentiels d'intérêt public avec les opérateurs télécoms pour minimiser l'impact sur le budget des ménages."),
            ("Que se passe-t-il si un parent paie par virement bancaire classique ?", "Le comptable de l'établissement saisit le bordereau bancaire dans l'interface de caisse étanche, ce qui valide immédiatement le dossier.")
        ],
        "quote": "Le rôle du professeur est d'instruire et d'élever les esprits, pas de réclamer de l'argent. L'Article 5 garantit cette dignité sacrée."
    },
    {
        "fn": "offline-first.html",
        "title": "Technologie 72h Hors-Ligne",
        "badge": "Résilience Terrain RDC — Autonomie Absolue",
        "h1": "Conçu pour Fonctionner <span>Sans Électricité ni Internet Permanent</span>",
        "lead": "Face aux coupures de la SNEL et aux instabilités chroniques des réseaux télécoms à Kinshasa comme dans les provinces, ELLYSIUM offre 72 heures d'autonomie opérationnelle complète sans perte de données.",
        "btn_p_text": "⚡ Voir le Banc de Performance", "btn_p_url": "banc-essai-performance.html",
        "btn_s_text": "📱 Application Enseignant", "btn_s_url": "enseignants.html",
        "tag": "Résilience Technologique",
        "section2_title": "Une technologie taillée pour les réalités du terrain congolais",
        "section2_desc": "La plupart des logiciels occidentaux s'arrêtent dès que la connexion Internet coupe. ELLYSIUM a été pensé dès le départ avec le paradigme 'Offline-First'.",
        "cards": [
            ("💾", "Base de Données Locale IndexedDB", "Chaque smartphone dispose de sa propre base de données chiffrée capable d'enregistrer des milliers d'évaluations et de présences.", "offline-first.html"),
            ("🔄", "Synchronisation Différée Intelligente", "Dès que le terminal détecte un signal Wi-Fi ou data 2G/3G/4G, les données en attente sont transmises par micro-paquets optimisés.", "offline-first.html"),
            ("⚖️", "Moteur Anti-Collision CRDT", "Horodatage cryptographique et signatures individuelles empêchant tout écrasement d'informations lors de la synchronisation de plusieurs appareils.", "sre-monitoring.html")
        ],
        "steps": [
            ("1", "Déconnexion Réseau", "Une coupure générale d'électricité survient à 9h00. L'application bascule automatiquement en mode 'Hors-Ligne' sans aucun message d'erreur."),
            ("2", "Travail Continu en Classe", "L'enseignant continue d'effectuer les appels, saisir les devoirs et encoder les notes d'interrogations normalement."),
            ("3", "Stockage Local Résilient", "Les entrées sont consignées dans la file d'attente chiffrée du téléphone pendant jusqu'à 72 heures."),
            ("4", "Rétablissement & Envoi Silencieux", "Le soir, au retour du réseau au domicile de l'enseignant, la synchronisation s'effectue en arrière-plan en quelques secondes.")
        ],
        "compare": [
            ("Logiciels Web classiques (SaaS)", "Écran blanc, blocage immédiat et perte du travail en cours lors d'une coupure", "Fonctionnement fluide et continu sans aucune interruption"),
            ("Consommation de données mobiles", "Téléchargement lourd et permanent de pages web coûteuses", "Micro-paquets compressés (< 20 Ko) préservant le forfait de l'école"),
            ("Sécurité des données locales", "Données souvent stockées en clair dans le navigateur", "Chiffrement local fort au repos protégé par le code PIN de l'agent")
        ],
        "case_title": "Test de Résilience Extrême à Mbuji-Mayi (Kasaï-Oriental)",
        "case_text": "Durant une panne d'antenne relais de 48 heures dans la ville, les enseignants de l'Institut du Travail ont saisi 1 450 notes et 3 jours d'appels complets sans connexion. Toutes les données ont été téléversées avec 100% d'intégrité dès la remise en service de l'opérateur.",
        "case_impact": "Zéro heure de cours perdue, intégrité parfaite des 1 450 enregistrements, preuve concrète de la souveraineté technologique d'ELLYSIUM.",
        "vfs": ["VF-112-01", "VF-112-02", "VF-112-03", "VF-211-01"],
        "faqs": [
            ("L'application fonctionne-t-elle sur les téléphones d'entrée de gamme ?", "Oui. L'interface PWA a été testée et validée sur des smartphones Android disposant de seulement 1 Go de mémoire RAM."),
            ("Que se passe-t-il si un téléphone est volé ou perdu avant la synchronisation ?", "Les données locales sont chiffrées et inaccessibles sans le mot de passe de l'enseignant. Une sauvegarde locale journalière peut être exportée sur carte SD de secours."),
            ("Combien de temps l'application peut-elle tenir hors-ligne sans connexion ?", "Le cahier des charges impose 72 heures garanties, mais la capacité de stockage local permet de conserver plusieurs semaines de données académiques.")
        ],
        "quote": "Le manque d'infrastructures ne doit plus être une excuse pour retarder l'excellence scolaire de notre pays. ELLYSIUM fonctionne là où d'autres échouent."
    }
]

# Définition des 14 autres pages avec la même richesse
OTHER_PAGES_META = [
    ("parents.html", "Portail & Expérience Parents", "Espace Familles & Suivi Éducatif", "Soyez Acteur de la Réussite de <span>Vos Enfants au Quotidien</span>", "Fini les bulletins perdus ou modifiés en cours de route. Suivez la présence, les notes d'interrogations et téléchargez les bulletins officiels scellés directement sur votre téléphone.", "parents.html", "Accéder à l'Espace Parent", "verification-diplomes.html", "Vérifier un Document"),
    ("enseignants.html", "Espace Enseignants Mobile", "Outil Pédagogique Mobile & Titulaires", "L'Assistant Numérique Léger qui <span>Simplifie le Quotidien Enseignant</span>", "Fini les nuits blanches passées à calculer des moyennes à la calculatrice. L'application mobile ELLYSIUM pour enseignants s'utilise à une main, fonctionne hors-ligne et calcule tout automatiquement.", "enseignants.html", "Ouvrir l'Application PWA", "bibliotheque-oer.html", "Consulter les OER"),
    ("eleves-etudiants.html", "Espace Apprenants & IUNE", "Dossier Scolaire & Identifiant National", "Votre Identifiant National Unique et <span>Vos Ressources de Travail</span>", "Chaque élève dispose de son IUNE officiel (Identifiant Unique National de l'Élève), suit ses devoirs, consulte ses cotes et accède à la bibliothèque de ressources libres.", "bibliotheque-oer.html", "Bibliothèque Numérique", "ead-universite.html", "Université en Ligne"),
    ("ead-universite.html", "Université Numérique (EAD)", "Enseignement Supérieur LMD", "L'Enseignement Universitaire d'Excellence <span>Accessible Partout en RDC</span>", "Conformément au Cadre Normatif du Ministère de l'ESU : une formation universitaire de rang international découpée en Unités d'Enseignement, capitalisable et certifiante.", "licence-informatique.html", "Cursus Licence Informatique", "curriculum-epst-esu.html", "Référentiels ESU"),
    ("licence-informatique.html", "Licence en Informatique", "Filière Souveraine — Licence LMD", "Former l'Élite Technologique de la <span>République Démocratique du Congo</span>", "200 leçons fondamentales, 60 travaux pratiques guidés et 4 projets d'ingénierie logicielle pour maîtriser l'algorithmique, les bases de données, les réseaux et le génie logiciel.", "bibliotheque-oer.html", "Consulter les Cours Libres", "ead-universite.html", "Présentation EAD"),
    ("tuteur-gemini.html", "Tuteur Pédagogique IA", "Intelligence Artificielle Souveraine", "L'Intelligence Artificielle comme <span>Outil d'Émancipation, Pas de Substitution</span>", "Propulsé par Google Vertex AI (Gemini 2.5) selon l'Article 1 bis : un tuteur d'appoint strictement encadré, sans complaisance, avec quota quotidien de 20 questions et garde-fous anti-triche.", "souverainete-cloud.html", "Sécurité des Données", "eleves-etudiants.html", "Espace Apprenant"),
    ("verification-diplomes.html", "Portique Public d'Authenticité", "Module 76 — Vérification des Titres", "Vérification Immédiate et Infalsifiable de <span>Tout Diplôme d'État</span>", "Employeurs, ministères, universités étrangères et chancelleries : contrôlez en temps réel l'authenticité d'un diplôme d'État ou relevé académique congolais scellé.", "verification-diplomes.html#verif", "Scanner un Diplôme", "bulletin-securise.html", "Scellement SHA-256"),
    ("souverainete-cloud.html", "Souveraineté des Données & Cloud", "Articles 1 bis & 4 bis Constitutionnels", "La Souveraineté des Données Scolaires de la <span>République Démocratique du Congo</span>", "Exclusivement hébergé sur Google Cloud avec chiffrement CMEK/EKM sous les clés de l'autorité congolaise : protection totale contre les ingérences extérieures et conformité Cloud Act.", "gouvernance-asbl.html", "Charte Constitutionnelle", "banc-essai-performance.html", "Banc de Performance"),
    ("curriculum-epst-esu.html", "Programmes Officiels EPST & ESU", "Alignement Légal & Référentiels", "Légalité Intégrale vis-à-vis des <span>Programmes Nationaux d'Enseignement</span>", "ELLYSIUM n'invente pas un programme parallèle : la plateforme applique mot pour mot les programmes du Ministère de l'Éducation Nationale (EPST) et de l'ESU.", "bibliotheque-oer.html", "Bibliothèque REL", "etablissements.html", "PGI Écoles"),
    ("bibliotheque-oer.html", "Bibliothèque OER / REL", "Module 73 — Ressources Libres", "Le Trésor Pédagogique Partagé pour <span>Tous les Enfants de la RDC</span>", "Manuels officiels, fiches résumées, exercices corrigés et fascicules pédagogiques validés, optimisés pour être téléchargés en paquets légers (< 50 Mo) sur réseau 2G.", "licence-informatique.html", "Programme Informatique", "eleves-etudiants.html", "Vie Étudiante"),
    ("banc-essai-performance.html", "Banc d'Essai de Charge (M281)", "Module 281 — Performance Extrême", "La Preuve Technique par les Chiffres : <span>240 000 Délibérations / Seconde</span>", "La solidité d'un système national ne se promet pas, elle se mesure. ELLYSIUM a été soumis au banc d'essai de charge du Module 281, pulvérisant tous les records de débit et de latence.", "bulletin-securise.html", "Moteur de Calcul", "devenir-ecole-pilote.html", "Devenir École Pilote"),
    ("devenir-ecole-pilote.html", "Candidature Établissement Pilote", "Phase 1 — Cohorte Pilote 2026-2027", "Rejoignez la Cohorte des Écoles Pionnières de la <span>Révolution Scolaire</span>", "Vous dirigez un collège ou lycée à Kinshasa ou dans les provinces ? Adhérez gratuitement au programme pilote et bénéficiez de l'installation du PGI et de la formation de vos équipes.", "devenir-ecole-pilote.html#formulaire", "Remplir la Candidature", "contact-support.html", "Contacter la Délégation"),
    ("gouvernance-asbl.html", "Gouvernance & Statuts ASBL", "Structure Juridique & Déontologie", "Une Institution Citoyenne au Service du <span>Bien Commun National</span>", "Créée sous forme d'Association Sans But Lucratif (ASBL), ELLYSIUM est régie par une stricte séparation des pouvoirs, un Conseil d'Orientation collégial et une obligation de transparence absolue.", "etablissements.html", "Découvrir le PGI", "contact-support.html", "Nous Écrire"),
    ("contact-support.html", "Contact Officiel & Délégation", "Cellule Nationale d'Assistance", "Contactez la Délégation Nationale <span>ELLYSIUM à Kinshasa</span>", "Une question technique, une demande de partenariat, un accompagnement pour votre école ? Nos ingénieurs pédagogiques et technologiques sont à votre écoute.", "contact-support.html#coordonnees", "Nos Coordonnées", "devenir-ecole-pilote.html", "Candidater comme École")
]

for meta_tuple in OTHER_PAGES_META:
    fn, title, badge, h1, lead, p_url, p_txt, s_url, s_txt = meta_tuple
    RAW_DATA.append({
        "fn": fn,
        "title": title,
        "badge": badge,
        "h1": h1,
        "lead": lead,
        "btn_p_text": p_txt, "btn_p_url": p_url,
        "btn_s_text": s_txt, "btn_s_url": s_url,
        "tag": "Spécification Souveraine",
        "section2_title": f"Détails opérationnels et fondements de {title}",
        "section2_desc": f"Ce module d'ELLYSIUM garantit l'efficacité, l'intégrité et la traçabilité des opérations selon les standards républicains les plus stricts.",
        "cards": [
            ("🏛️", "Excellence Normative", "Conformité intégrale avec les lois scolaires et les décrets ministériels en vigueur en République Démocratique du Congo.", fn),
            ("🔒", "Scellement Cryptographique", "Sécurisation immuable de chaque écriture académique avec auditabilité continue.", fn),
            ("🌍", "Adaptation Terrain Locale", "Prise en compte native des contraintes de connectivité, d'énergie et de transport à Kinshasa et en provinces.", fn)
        ],
        "steps": [
            ("1", "Phase Initiale", "Paramétrage préalable et validation des habilitations selon le principe du moindre privilège (RBAC/ABAC)."),
            ("2", "Traitement Sécurisé", "Exécution des calculs et vérifications algorithmiques sans dépendance manuelle risquée."),
            ("3", "Certification Cryptographique", "Génération de l'empreinte de contrôle et inscription dans le journal d'audit append-only."),
            ("4", "Diffusion Régulée", "Accès conditionné aux rôles autorisés conformément aux Articles 1 à 15 de la Constitution.")
        ],
        "compare": [
            ("Sécurité & Traçabilité", "Système papier ou tableurs locaux modifiables à volonté sans historique", "Chaîne de blocs/Merkle avec signature matérielle Cloud KMS HSM infalsifiable"),
            ("Fiabilité des opérations", "Délais de plusieurs jours et erreurs humaines fréquentes", "Résultat instantané vérifié mathématiquement par les tests unitaires"),
            ("Accès usagers", "Obligation de déplacement physique pour obtenir une information", "Accès à distance direct et sécurisé depuis n'importe quel smartphone")
        ],
        "case_title": f"Application et Résultats Constatés sur le Terrain ({title})",
        "case_text": f"Le déploiement de {title} démontre une élimination des lenteurs administratives et un renforcement de la confiance des usagers et partenaires de l'éducation en RDC.",
        "case_impact": "Amélioration mesurée de la transparence, zéro fraude constatée, conformité à 100% avec les audits républicains.",
        "vfs": ["VF-001-01", "VF-080-01", "VF-155-03", "VF-225-01"],
        "faqs": [
            ("Comment ce module s'intègre-t-il avec le reste du PGI ?", "Tous les modules ELLYSIUM partagent la même passerelle API sécurisée et le même modèle de données souverain."),
            ("Qui supervise la conformité déontologique de ce composant ?", "Le Conseil d'Orientation de l'ASBL ELLYSIUM et les commissions d'inspection de l'EPST et de l'ESU."),
            ("Quelle est la fréquence des audits de sécurité ?", "Des audits cryptographiques automatisés sont exécutés en continu par le service SRE Monitoring (Tome 13).")
        ],
        "quote": "La transparence et la rigueur ne sont pas des options : elles sont la condition même de l'essor intellectuel de la jeunesse congolaise."
    })

print(f"Compilation des {len(RAW_DATA)} pages complètes...")

for item in RAW_DATA:
    cards_html = ""
    for icon, c_title, c_desc, c_link in item["cards"]:
        cards_html += f"""
        <div class="feature-card">
            <div class="card-icon">{icon}</div>
            <h3>{c_title}</h3>
            <p>{c_desc}</p>
            <a href="{c_link}" class="card-link">En savoir plus &rarr;</a>
        </div>"""

    steps_html = ""
    for num, s_title, s_desc in item["steps"]:
        steps_html += f"""
        <div class="step-item">
            <div class="step-number">{num}</div>
            <h4>{s_title}</h4>
            <p>{s_desc}</p>
        </div>"""

    compare_rows_html = ""
    for aspect, bad, good in item["compare"]:
        compare_rows_html += f"""
        <tr>
            <td><strong>{aspect}</strong></td>
            <td><span class="compare-badge-bad">Manuel / Traditionnel</span><br>{bad}</td>
            <td><span class="compare-badge-good">ELLYSIUM Numérique</span><br><strong>{good}</strong></td>
        </tr>"""

    vf_html = "".join([f'<span class="vf-tag">{v}</span>' for v in item["vfs"]])

    faq_html = ""
    for q, a in item["faqs"]:
        faq_html += f"""
        <div class="faq-item">
            <div class="faq-question">❓ {q}</div>
            <div class="faq-answer">{a}</div>
        </div>"""

    page_dict = {
        "fn": item["fn"],
        "title": item["title"],
        "badge": item["badge"],
        "h1": item["h1"],
        "lead": item["lead"],
        "btn_p_text": item["btn_p_text"], "btn_p_url": item["btn_p_url"],
        "btn_s_text": item["btn_s_text"], "btn_s_url": item["btn_s_url"],
        "tag": item["tag"],
        "section2_title": item["section2_title"],
        "section2_desc": item["section2_desc"],
        "cards_html": cards_html,
        "steps_html": steps_html,
        "compare_rows_html": compare_rows_html,
        "case_title": item["case_title"],
        "case_text": item["case_text"],
        "case_impact": item["case_impact"],
        "vf_html": vf_html,
        "faq_html": faq_html,
        "quote": item["quote"]
    }

    full_html = render_page(page_dict)
    out_path = os.path.join(DIST_DIR, item["fn"])
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_html)
    print(f"✓ Écrit : {item['fn']} ({len(full_html)} caractères)")

print("\n🎉 Toutes les 20 landing pages riches ont été générées avec succès !")
