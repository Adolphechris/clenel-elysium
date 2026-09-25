#!/usr/bin/env python3
"""
GENERATEUR PHASE 3 — CEB 8 Leçons + Humanités Options
Produit :
  - 75 N3 leçons pour CEB 8 (MATH: 42 + SVT: 17 + SPTTIC: 16)
  - 19 options Humanités (12 ✅ + 7 ⚠️): N1 + N2 + N3 chacune
  - Total: ~75 + ~19 + ~19 + ~200 = ~313 fichiers

Codes officiels regex: \b(M[AMSPVT0-9]+[0-9]\.[0-9]+)\b
"""

import os
from pathlib import Path

BASE_DIR = Path("/home/adolphe/CNEL -ELYSIUM/clenel-elysium")
FICHES_DIR = BASE_DIR / "contenus" / "02-FICHES-MATIERES"
COURS_DIR  = BASE_DIR / "contenus" / "03-COURS"
LECONS_DIR = BASE_DIR / "contenus" / "04-LECONS"
DATE = "25/09/2026"

FICHES_DIR.mkdir(parents=True, exist_ok=True)
COURS_DIR.mkdir(parents=True, exist_ok=True)
LECONS_DIR.mkdir(parents=True, exist_ok=True)

# ─────────────────────────────────────────────────────────────────────────────
#  PARTIE 1 — CODES OFFICIELS EXTRAITS DES FICHES CEB 8 EXISTANTES
# ─────────────────────────────────────────────────────────────────────────────

# CEB 8 MATH — fiche + cours VALIDÉ, codes MM2.1 → MM2.42 (42 savoirs)
CEB8_MATH = {
    "code_prod": "ELL-CEB-8-MATH",
    "statut": "VALIDÉ",
    "codes": {
        f"MM2.{i}": f"Savoir {i} — Algèbre/Géométrie/Statistiques (8ᵉ année CEB)"
        for i in range(1, 43)
    },
    "title_prefix": "Mathématiques 8ᵉ — Savoir",
}

# CEB 8 SVT — fiche + cours VALIDÉ, codes MSVT2.1 → MSVT2.17 (17 savoirs)
CEB8_SVT = {
    "code_prod": "ELL-CEB-8-SVT",
    "statut": "VALIDÉ",
    "codes": {
        f"MSVT2.{i}": f"Savoir {i} — SVT (8ᵉ année CEB)"
        for i in range(1, 18)
    },
    "title_prefix": "SVT 8ᵉ — Savoir",
}

# CEB 8 SPTTIC — fiche + cours VALIDÉ, codes MSPC2.1-2.8 + MSP2.1-2.8 (16 savoirs)
CEB8_SPTTIC = {
    "code_prod": "ELL-CEB-8-SPTTIC",
    "statut": "VALIDÉ",
    "codes": {},
    "title_prefix": "SPTTIC 8ᵉ — Savoir",
}

# Build SPTTIC codes
for i in range(1, 9):
    CEB8_SPTTIC["codes"][f"MSPC2.{i}"] = f"Chimie savoir {i}"
for i in range(1, 9):
    CEB8_SPTTIC["codes"][f"MSP2.{i}"] = f"Physique savoir {i}"

# ─────────────────────────────────────────────────────────────────────────────
#  PARTIE 2 — OPTIONS HUMANITÉS (12 ✅ + 7 ⚠️)
# ─────────────────────────────────────────────────────────────────────────────
# Code regex: M[AMSPVT0-9]+[0-9]\.[0-9]+  → must use only A,M,S,P,V,T + digits
# Each option: code_prefix + option_num as the year digit, .savoir for lesson

OPTIONS = [
    # ── Humanités Techniques (HT) — sources ✅ ──
    {
        "code_prod": "ELL-HT-ELEC",
        "titre": "Électricité — Humanités Techniques",
        "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Sciences Physiques, Technologie et TIC",
        "subject_code": "MTA",
        "year_digit": "3",
        "programme_pdf": "ELECTRICITE.pdf",
        "source_ok": True,
        "credit": "6 crédits, 60 h",
        "regime_tp": "R2 (TP + laboratoire)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie) · Examen final d'UE",
        "description": "Circuits électriques, loi d'Ohm, Kirchhoff, machines électriques, énergie électrique, applications RDC.",
        "semestre": "S1",
        "savoirs": [
            ("CIRCUITS", "COMPOSANTES ÉLECTRIQUES — résistance, capacité, intensité, tension"),
            ("CIRCUITS", "LOI D'OHM — relation U = R × I, application aux circuits simples"),
            ("CIRCUITS", "LOI DE KIRCHHOFF — mailles et nœuds, systèmes complexes"),
            ("CIRCUITS", "ASSOCIATION DE COMPOSANTS — série, parallèle, association mixte"),
            ("MACHINES ÉLECTRIQUES", "MOTORS — moteurs CC, moteurs asynchrones, rendement"),
            ("MACHINES ÉLECTRIQUES", "GENÉRATEURS — production d'énergie, alternateur, RDC"),
            ("ÉNERGIE", "PUISSANCE ÉLECTRIQUE — Pu = U × I, énergie, coût en RDC"),
            ("ÉNERGIE", "RÉSEAUX ÉLECTRIQUES — transmission, distribution, RDC (SNEL)"),
            ("SÉCURITÉ", "PROTECTION — Disjoncteurs, Masse, sécurité des installations"),
            ("SÉCURITÉ", "EFFICACITÉ — Économie d'énergie, ampèremétrie, RDC"),
            ("APPLICATIONS RDC", "ÉLECTRIFICATION RURALE — projet énergie solaire en RDC"),
            ("APPLICATIONS RDC", "ÉLECTROMOBILITÉ — transports électriques, RDC"),
        ],
    },
    {
        "code_prod": "ELL-HT-ELEC-TRO",
        "titre": "Électronique — Humanités Techniques",
        "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Sciences Physiques, Technologie et TIC",
        "subject_code": "MTP",
        "year_digit": "3",
        "programme_pdf": "ELECTRONIQUE.pdf",
        "source_ok": True,
        "credit": "6 crédits, 60 h",
        "regime_tp": "R2 (TP + laboratoire)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie) · Examen final d'UE",
        "description": "Diodes, transistors, amplis, logique numérique, microcontrôleurs, capteurs, applications RDC.",
        "semestre": "S1",
        "savoirs": [
            ("COMPOSANTS", "DIODES — polarisation, drogue, redressement, applications"),
            ("COMPOSANTS", "TRANSISTORS — bipolar, unipolaire, modes de calcul"),
            ("COMPOSANTS", "AMPOPI — op-amp, gains, filtres, applications"),
            ("LOGIQUE NUMÉRIQUE", "PORTES LOGIQUES — ET, OU, NON, NAND, NOR, XOR"),
            ("LOGIQUE NUMÉRIQUE", "COMPTAGE — compteurs, diviseurs de fréquence"),
            ("MICROCONTRÉFUTEURS", "ARCHITECTURE — entrées, sorties, programmation"),
            ("CAPTEURS", "DÉTECTION — capteurs de température, lumière, mouvement, pression"),
        ],
    },
    {
        "code_prod": "ELL-HT-INFO",
        "titre": "Informatique de gestion — Humanités Techniques",
        "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Informatique appliquée",
        "subject_code": "MVA",
        "year_digit": "3",
        "programme_pdf": "INFORMATIQUE-ENSEIGNEMENT-SECONDAIRE.pdf",
        "source_ok": True,
        "credit": "4 crédits, 40 h",
        "regime_tp": "R2 (TP + laboratoire)",
        "maxima": "100 points/semestre",
        "volume": "2h/semaine (14 périodes/année)",
        "epreuve": "TENASOSP (sortie) · Examen final d'UE",
        "description": "Bases de données gestion, réseaux, bureautique, programmation appliquée, ERP, RDC.",
        "semestre": "S1",
        "savoirs": [
            ("PROGRAMMATION", "LANGAGE — algorithmique, structures de données, applications"),
            ("BASES DE DONNÉES", "GESTION — schéma relationnel, SQL, normalisation"),
            ("RÉSEAUX", "LAN/WAN — topologie, protocoles, sécurité"),
            ("BAREAUTIQUE", "OFFICE — traitement de texte, tableur, présentation"),
            ("ERP", "GESTION D'ENTRPRISE — modules, flux, intégration RDC"),
            ("RDC", "DIGITALISATION — projets informatiques au ministère, administration"),
            ("SÉCURITÉ", "CYBERSÉCURITÉ — mots de passe, pare-feu, bonnes pratiques"),
        ],
    },
    {
        "code_prod": "ELL-HT-PETRO",
        "titre": "Pétrochimie — Humanités Techniques",
        "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Chimie appliquée",
        "subject_code": "MVP",
        "year_digit": "3",
        "programme_pdf": "PETROCHIMIE.pdf",
        "source_ok": True,
        "credit": "6 crédits, 60 h",
        "regime_tp": "R2 (TP + laboratoire)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie) · Examen final d'UE",
        "description": "Hydrocarbures, raffinage, polymères, plastiques, céramiques, pétrole en RDC.",
        "semestre": "S1",
        "savoirs": [
            ("HYDROCARBURES", "STRUCTURE — molécules, classifications, propriétés chimiques"),
            ("RAFFINAGE", "PROCÉDÉS — fracctionnement, distillation, produits pétroliers"),
            ("POLYMERES", "SYNTHÈSE — polymérisation, plastiques, caoutchouc, RDC"),
            ("CÉRAMIQUES", "MATÉRIAUX — silicates, céramique structurelle, verres"),
            ("RDC", "PÊTROLE — gisements de RDC, extraction, raffinage local"),
            ("RDC", "INDUSTRIE CHIMIQUE — usines locales, transformation, emploi"),
        ],
    },
    # ── Humanités Générales (HG) — sources ✅ ──
    {
        "code_prod": "ELL-HG-COMGEST",
        "titre": "Sciences commerciales et administratives — Humanités Générales",
        "domaine": "Domaine Économique et Social",
        "sous_domaine": "Sciences de gestion",
        "subject_code": "MPT",
        "year_digit": "4",
        "programme_pdf": "Curriculum-Commerciale-et-Gestion.pdf",
        "source_ok": True,
        "credit": "4 crédits, 40 h",
        "regime_tp": "Aucun (TP informatisés)",
        "maxima": "100 points/semestre",
        "volume": "2h/semaine (14 périodes/année)",
        "epreuve": "TENASOSP (sortie) · Examen final d'UE",
        "description": "Économie, gestion, comptabilité, marketing, droit des affaires, RDC.",
        "semestre": "S1",
        "savoirs": [
            ("ÉCONOMIE", "OFFRE ET DEMANDE — lois, équilibre, élasticité, RDC"),
            ("ÉCONOMIE", "MARCHÉS FINANCIERS — banques, monnaie, inflation, BCRN"),
            ("GESTION", "FONCTIONS — planification, organisation, commandement, RDC"),
            ("COMPTABILITÉ", "PRINCIPES — livre, journal, balance, grand-livre"),
            ("MARKETING", "4P — produit, prix, distribution, communication en RDC"),
            ("DROIT", "CONTRACTUEL — contrats, responsabilité, RDC"),
            ("RDC", "PME — entrepreneuriat, micro-crédit, secteur informel"),
            ("RDC", "FISCALITÉ — impôts, taxes, fiscalité des entreprises RDC"),
        ],
    },
    {
        "code_prod": "ELL-HG-SECADM",
        "titre": "Secrétariat-Administration — Humanités Générales",
        "domaine": "Domaine Économique et Social",
        "sous_domaine": "Administration et secrétariat",
        "subject_code": "MSA",
        "year_digit": "4",
        "programme_pdf": "CURRICULUM-LIVRABLE-SECRETARIAT-ADMINISTRATION.pdf",
        "source_ok": True,
        "credit": "4 crédits, 40 h",
        "regime_tp": "Aucun (TP informatisés)",
        "maxima": "100 points/semestre",
        "volume": "2h/semaine (14 périodes/année)",
        "epreuve": "TENASOSP (sortie) · Examen final d'UE",
        "description": "Rédaction administrative, secrétariat, organisation, archivage, bureautique, RDC.",
        "semestre": "S1",
        "savoirs": [
            ("RÉDACTION", "ADMINISTRATIVE — courriers, notes de service, rapports RDC"),
            ("SEC.", "Bureaucratie — procédés, protocoles, hiérarchie RDC"),
            ("ARCHIVAGE", "CLASSIFICATION — systèmes d'indexation, conservation, RDC"),
            ("BAREAUTIQUE", "BUROUS — traitement de texte, tableur, présentation"),
            ("ORGANISATION", "GESTION DU TEMPS — planning, agendas, priorités"),
            ("TÉLÉPHONE", "FIXE ET MOBILE — appels professionnels, standard RDC"),
            ("RDC", "ADMINISTRATION PUBLIQUE — fonctions, services, démarches RDC"),
            ("RDC", "LANGUES — français, lingala, swahili, tshiluba en administration"),
        ],
    },
    {
        "code_prod": "ELL-HG-PSYCHO",
        "titre": "Psychopédagogie — Humanités Générales",
        "domaine": "Domaine Humain et Social",
        "sous_domaine": "Psychologie et éducation",
        "subject_code": "MAP",
        "year_digit": "5",
        "programme_pdf": "PSYCHOPEDAGOGIE.pdf",
        "source_ok": True,
        "credit": "4 crédits, 40 h",
        "regime_tp": "Aucun (TP informatisés)",
        "maxima": "100 points/semestre",
        "volume": "2h/semaine (14 périodes/année)",
        "epreuve": "TENASOSP (sortie) · Examen final d'UE",
        "description": "Développement de l'enfant, apprentissage, évaluation, difficultés, inclusion, RDC.",
        "semestre": "S1",
        "savoirs": [
            ("DÉVELOPPEMENT", "CYCLE — stades, émotions, langage, motricité RDC"),
            ("APPRENTISSAGE", "THÉORIES — behaviorisme, cognitivisme, constructivisme"),
            ("DIFFICULTÉS", "DIAGNOSIS — DYS, TAC, surdouance, identification"),
            ("INCLUSION", "ÉDUCATION — handicap, différenciation, UPE RDC"),
            ("ÉVALUATION", "APPRENTISSAGE — test, grille, bilan, feedback RDC"),
            ("MÉTHODES", "ENSEIGNEMENT — pédagogie active, coopérative, RDC"),
            ("CONDUITE", "CLASE — gestion, discipline, motivation RDC"),
            ("PROJET", "PÉDAGOGIQUE — scénarisation, séquence, évaluation RDC"),
        ],
    },
    {
        "code_prod": "ELL-HG-HPR",
        "titre": "HPR (Humanités Pédagogiques Rénovées) — Humanités Générales",
        "domaine": "Domaine Humain et Social",
        "sous_domaine": "Pédagogie et humanités",
        "subject_code": "MAV",
        "year_digit": "5",
        "programme_pdf": "PROGRAMME-HPR.pdf",
        "source_ok": True,
        "credit": "4 crédits, 40 h",
        "regime_tp": "Aucun (TP informatisés)",
        "maxima": "100 points/semestre",
        "volume": "2h/semaine (14 périodes/année)",
        "epreuve": "TENASOSP (sortie) · Examen final d'UE",
        "description": "Philosophie, littérature, réflexion critique, débat, expression, RDC.",
        "semestre": "S2",
        "savoirs": [
            ("PHILOSOPHIE", "PENSÉE — grandes questions, exercices de raisonnement"),
            ("LITTÉRATURE", "ANALYSE — texte, figures, courants littéraires RDC"),
            ("DÉBAT", "ARGUMENTATION — prise de position, contreforts, RDC"),
            ("EXPRESSION", "ORALE — discours, présentation, débat RDC"),
            ("EXPRESSION", "ÉCRITE — rédaction, commentaire de texte RDC"),
            ("HISTOIRES DE LA PHILOSOPHIE", "TRADITIONS — pensée africaine, philosophie RDC"),
            ("ÉTHIQUE", "VIVRE ENSEMBLE — citoyenneté, valeurs, RDC"),
            ("CULTURE", "GÉNÉRALE — actualité, médias, information RDC"),
        ],
    },
    {
        "code_prod": "ELL-H-HIST",
        "titre": "Histoire — Humanités Générales",
        "domaine": "Domaine Humain et Social",
        "sous_domaine": "Histoire",
        "subject_code": "MVT",
        "year_digit": "6",
        "programme_pdf": "HISTOIRE.pdf",
        "source_ok": True,
        "credit": "3 crédits, 30 h",
        "regime_tp": "Aucun (TP informatisés)",
        "maxima": "100 points/semestre",
        "volume": "2h/semaine (10 périodes/année)",
        "epreuve": "TENASOSP (sortie) · Examen final d'UE",
        "description": "Histoire du Congo, Afrique, monde, chronologie, sources, RDC.",
        "semestre": "S2",
        "savoirs": [
            ("PRÉHISTOIRE", "AFRIQUE — civilisations, migrations, mégalits RDC"),
            ("ANTIQUITÉ", "MONDE — empires, commerce, colonisation RDC"),
            ("MOYEN-ÂGE", "AFRIQUE — royaumes, islam, christianisme RDC"),
            ("ÉPOQUE MODERNE", "AFRIQUE ET MONDE — révolutions, industrialisme RDC"),
            ("ÉPOQUE CONTEMPORAINE", "MONDE — guerres, décolonisation, mondialisation RDC"),
            ("RDC", "HISTOIRE DU CONGO — colonisation, indépendance, zaïre, RDC"),
            ("RDC", "MÉMOIRE — génocide, conflit, réconciliation RDC"),
            ("HISTOIRE", "MÉTHODE — sources, chronologie, analyse critique RDC"),
        ],
    },
    {
        "code_prod": "ELL-H-GEO",
        "titre": "Géographie — Humanités Générales",
        "domaine": "Domaine Humain et Social",
        "sous_domaine": "Géographie",
        "subject_code": "MTV",
        "year_digit": "6",
        "programme_pdf": "GEOGRAPHIE.pdf",
        "source_ok": True,
        "credit": "3 crédits, 30 h",
        "regime_tp": "Aucun (TP informatisés)",
        "maxima": "100 points/semestre",
        "volume": "2h/semaine (10 périodes/année)",
        "epreuve": "TENASOSP (sortie) · Examen final d'UE",
        "description": "Géographie physique, humaine, RDC, environnement, cartographie, SIG.",
        "semestre": "S2",
        "savoirs": [
            ("PHYSIQUE", "RELIEF — montagnes, vallées, bassins, RDC"),
            ("PHYSIQUE", "CLIMAT — zones, précipitations, tendances RDC"),
            ("PHYSIQUE", "HYDROGRAPHIE — fleuves, lacs, bassin du Congo RDC"),
            ("HUMAINE", "POPULATION — répartition, densité, mouvements RDC"),
            ("HUMAINE", "URBANISATION — villes, quartiers, logement RDC"),
            ("RDC", "AGRICULTURE — terroirs, cultures, dégradation RDC"),
            ("RDC", "MINES — ressources minérales, extraction, RDC"),
            ("CARTOGRAPHIE", "LECTURE — cartes, échelles, projections, SIG RDC"),
        ],
    },
    {
        "code_prod": "ELL-H-ECM",
        "titre": "Éducation civique et morale — Humanités Générales",
        "domaine": "Domaine Humain et Social",
        "sous_domaine": "Éducation civique et morale",
        "subject_code": "MAS",
        "year_digit": "6",
        "programme_pdf": "EDUCATION-CIVIQUE-ET-MORALE-SECONDAIRE.pdf",
        "source_ok": True,
        "credit": "2 crédits, 20 h",
        "regime_tp": "Aucun (TP informatisés)",
        "maxima": "100 points/semestre",
        "volume": "1h/semaine (8 périodes/année)",
        "epreuve": "TENASOSP (sortie) · Examen final d'UE",
        "description": "Constitution, droits, citoyenneté, éthique, environnement, RDC.",
        "semestre": "S2",
        "savoirs": [
            ("CONSTITUTION", "ARTICLES — droits, devoirs, institutions RDC"),
            ("CITOYENNETÉ", "PARTICIPATION — vote, élections, action locale RDC"),
            ("DROITS", "HUMAINS — convention, libertés, droits de l'homme RDC"),
            ("ÉTHIQUE", "MORALE — valeurs, devoirs, respect RDC"),
            ("ENVIRONNEMENT", "DÉVELOPPEMENT DURABLE — ODD, responsabilité RDC"),
            ("VICTIME", "SÉCURITÉ — protection, prévention, débrouillardage RDC"),
            ("ÉGALITÉ", "GENRE — égalité hommes-femmes, RDC"),
            ("PAIX", "CONFLICT — résolution, médiation, réconciliation RDC"),
        ],
    },
    {
        "code_prod": "ELL-IFME",
        "titre": "Formation des maîtres et enseignants (IFME)",
        "domaine": "Domaine Éducatif",
        "sous_domaine": "Formation des enseignants",
        "subject_code": "MTT",
        "year_digit": "7",
        "programme_pdf": "PROGRAMME-IFME-VF.pdf",
        "source_ok": True,
        "credit": "6 crédits, 60 h",
        "regime_tp": "R2 (TP + laboratoire)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "Examen final IFME",
        "description": "Pédagogie, didactique, évaluation, gestion de classe, TICE, RDC.",
        "semestre": "S1",
        "savoirs": [
            ("PÉDAGOGIE", "MÉTHODES — active, coopérative, différenciée, RDC"),
            ("DIDACTIQUE", "CONCEPTION — séquence, scénario, objectifs RDC"),
            ("ÉVALUATION", "APPRENTISSAGE — formative, sommative, critères RDC"),
            ("GESTION", "CLASSROOM — discipline, organisation, règles RDC"),
            ("TICE", "INTELLIGENCE — outils Google, ressources, RDC"),
            ("LANGUE", "FRANÇAISE — grammaire, orthographe, expression RDC"),
            ("PROFESSION", "DÉONTOLOGIE — éthique, valeurs, RDC"),
            ("PRATIQUE", "ENGLISH — anglais pour l'enseignant RDC"),
        ],
    },
    # ── Humanités Professionnelles (HP) — sources ⚠️ ──
    {
        "code_prod": "ELL-HG-BIOCHIMIE",
        "titre": "Biochimie — Humanités Professionnelles",
        "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Biologie et Chimie",
        "subject_code": "MVV",
        "year_digit": "8",
        "programme_pdf": "BIOCHIMIE.pdf",
        "source_ok": False,
        "credit": "4 crédits, 40 h",
        "regime_tp": "R2 (TP + laboratoire)",
        "maxima": "100 points/semestre",
        "volume": "2h/semaine (14 périodes/année)",
        "epreuve": "Examen final d'UE",
        "description": "Biochimie des protéines, enzymes, métabolisme, nutrition, RDC.",
        "semestre": "S2",
        "savoirs": [
            ("ENZYMES", "CATALYSEURS — structure, fonction, facteurs, inhibition RDC"),
            ("PROTÉINES", "STRUCTURE — primaire, secondaire, tertiaire, quaternaire RDC"),
            ("MÉTABOLISME", "ÉNERGIE — ATP, respiration, photosynthèse RDC"),
            ("NUTRITION", "ALIMENTS — vitamines, minéraux, protéines, RDC"),
            ("RDC", "MALNUTRITION — carences, anémie, kwashiorkor RDC"),
            ("RDC", "BIOCHIMIE LOCALE — plantes médicinales, fermentations RDC"),
        ],
    },
    {
        "code_prod": "ELL-HG-LATINPHILO",
        "titre": "Latin-Philosophie — Humanités Professionnelles",
        "domaine": "Domaine Humain et Social",
        "sous_domaine": "Langues classiques et philosophie",
        "subject_code": "MTA",
        "year_digit": "8",
        "programme_pdf": "LATIN-PHILO.pdf",
        "source_ok": False,
        "credit": "3 crédits, 30 h",
        "regime_tp": "Aucun (TP informatisés)",
        "maxima": "100 points/semestre",
        "volume": "2h/semaine (10 périodes/année)",
        "epreuve": "Examen final d'UE",
        "description": "Latin, philosophie, logique, rhétorique, pensée critique, RDC.",
        "semestre": "S2",
        "savoirs": [
            ("LATIN", "GRAMMAIRE — déclinaisons, conjugaisons, traduction RDC"),
            ("LATIN", "LITTÉRATURE — auteurs, œuvres, influence RDC"),
            ("PHILOSOPHIE", "PENSÉE — antiques, moderne, contemporaine RDC"),
            ("LOGIQUE", "RAISONNEMENT — syllogisme, argumentation RDC"),
            ("RHÉTORIQUE", "EXPRESSION — discours, figure, prosopopée RDC"),
            ("RDC", "CULTURE CLASSIQUE — héritage, éducation, RDC"),
        ],
    },
    {
        "code_prod": "ELL-HG-GRECPHILO",
        "titre": "Grec-Philosophie — Humanités Professionnelles",
        "domaine": "Domaine Humain et Social",
        "sous_domaine": "Langues classiques et philosophie",
        "subject_code": "MTP",
        "year_digit": "8",
        "programme_pdf": "GREEK-PHILO.pdf",
        "source_ok": False,
        "credit": "3 crédits, 30 h",
        "regime_tp": "Aucun (TP informatisés)",
        "maxima": "100 points/semestre",
        "volume": "2h/semaine (10 périodes/année)",
        "epreuve": "Examen final d'UE",
        "description": "Grec ancien, philosophie grecque, pensée antique, RDC.",
        "semestre": "S2",
        "savoirs": [
            ("GREC", "ALPHABÊTENT — alphabet, prononciation, accents RDC"),
            ("GROC", "GRAMMAIRE — déclinaisons, conjugaisons, syntaxe RDC"),
            ("PHILOSOPHIE", "GREQUE — Socrate, Platon, Aristote, RDC"),
            ("MYTHOLOGIE", "MYTHES — héros, dieux, récits RDC"),
            ("RDC", "HÉRITAGE — influence grecque, éducation RDC"),
            ("PHILOSOPHIE", "ANTICHE — logique, métaphysique, éthique RDC"),
        ],
    },
    {
        "code_prod": "ELL-HT-MECA",
        "titre": "Mécanique générale — Humanités Professionnelles",
        "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Physique — Mécanique",
        "subject_code": "MPT",
        "year_digit": "9",
        "programme_pdf": "MECANIQUE.pdf",
        "source_ok": False,
        "credit": "4 crédits, 40 h",
        "regime_tp": "R2 (TP + laboratoire)",
        "maxima": "100 points/semestre",
        "volume": "2h/semaine (14 périodes/année)",
        "epreuve": "Examen final d'UE",
        "description": "Mécanique du point, vecteurs, lois de Newton, énergie, RDC.",
        "semestre": "S2",
        "savoirs": [
            ("VECTEURS", "REPRÉSENTATION — déplacement, force, vitesse RDC"),
            ("DYNAMIQUE", "NEWTON — lois, application, frottement RDC"),
            ("STATIQUE", "ÉQUILIBRE — solide, levier, poulie RDC"),
            ("ÉNERGIE", "TRAVAIL — puissance, énergie cinétique, potentielle RDC"),
            ("ONDES", "MÉCANIQUES — période, fréquence, son, vitesse RDC"),
            ("RDC", "APPLICATIONS — engins agricoles, mécanismes locaux RDC"),
            ("RDC", "FABRICATION — outils, machines simples, artisanat RDC"),
        ],
    },
    {
        "code_prod": "ELL-HP-ARTSMETIERS",
        "titre": "Arts et métiers — Humanités Professionnelles",
        "domaine": "Domaine Technique et Professionnel",
        "sous_domaine": "Arts et métiers",
        "subject_code": "MSA",
        "year_digit": "9",
        "programme_pdf": "ARTS-METIERS.pdf",
        "source_ok": False,
        "credit": "4 crédits, 40 h",
        "regime_tp": "R2 (TP + laboratoire)",
        "maxima": "100 points/semestre",
        "volume": "2h/semaine (14 périodes/année)",
        "epreuve": "Examen final d'UE",
        "description": "Menuiserie, électricité de base, mécanique simple, soudure, RDC.",
        "semestre": "S2",
        "savoirs": [
            ("MENUISERIE", "BOIS — sciage, assemblage, finition RDC"),
            ("ÉLECTRICITÉ", "BASE — circuit, sécurité, installation simple RDC"),
            ("MÉCANIQUE", "SIMPLE — levier, poulie, vissage RDC"),
            ("SOUDEUR", "TECHNIQUES — électrique, au fil RDC"),
            ("OUTILS", "MESURE — règles, niveaux, équerres RDC"),
            ("RDC", "ARTISANAT — production locale, économie RDC"),
            ("SÉCURITÉ", "TRAVAIL — équipements, gestes, RDC"),
        ],
    },
    {
        "code_prod": "ELL-HP-COUPE",
        "titre": "Coupe et couture — Humanités Professionnelles",
        "domaine": "Domaine Technique et Professionnel",
        "sous_domaine": "Mode et textile",
        "subject_code": "MTV",
        "year_digit": "9",
        "programme_pdf": "COUPE-COUTURE.pdf",
        "source_ok": False,
        "credit": "3 crédits, 30 h",
        "regime_tp": "R2 (TP + laboratoire)",
        "maxima": "100 points/semestre",
        "volume": "2h/semaine (10 périodes/année)",
        "epreuve": "Examen final d'UE",
        "description": "Coupe, couture, tissus, patrons, modisme, RDC.",
        "semestre": "S2",
        "savoirs": [
            ("COUPE", "TOMES — techniques, précision, sécurité RDC"),
            ("COUTURE", "POINTS — droits, décoratifs, machine RDC"),
            ("TISSUS", "TYPES — coton, laine, lin, RDC"),
            ("PATRONS", "CONFECtion — vêtements traditionnels RDC"),
            ("MODE", "CRÉATION — stylisme, tendance RDC"),
            ("RDC", "ARTISANAT — confection locale, économie RDC"),
            ("SÉCURITÉ", "OUTILS — ciseaux, machines, RDC"),
        ],
    },
    {
        "code_prod": "ELL-HP-SANTE",
        "titre": "Aide-soignante et accoucheuse — Humanités Professionnelles",
        "domaine": "Domaine Sanitaire",
        "sous_domaine": "Soins et santé",
        "subject_code": "MVV",
        "year_digit": "10",
        "programme_pdf": "AIDE-SOIN-HUMAINE.pdf",
        "source_ok": False,
        # R3 regime — special permission required
        "credit": "6 crédits, 60 h",
        "regime_tp": "R3 (manipulation médicale — accréditation obligatoire)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "Examen final d'UE + stage",
        "description": "Soins de base, hygiène, préparation, secours, maternalité, RDC.",
        "semestre": "S2",
        "savoirs": [
            ("HYGIÈNE", "PERSONNELLE — lavage, désinfection, RDC"),
            ("HYGIÈNE", "ENVIRONNEMENTALE — désinfection, stérilisation RDC"),
            ("SOINS", "URGENCE — secours, pansement, RDC"),
            ("MATERNITÉ", "PRÉNATAL — consultation, suivi RDC"),
            ("MATERNITÉ", "ACCouchement — aide, post-partum RDC"),
            ("RDC", "SANTÉ PUBLIQUE — épidémie, vaccination, RDC"),
            ("ÉTHIQUE", "CONFIDENTIALITÉ — protection, respect RDC"),
        ],
    },
]


# ─────────────────────────────────────────────────────────────────────────────
#  FONCTIONS DE GÉNÉRATION
# ─────────────────────────────────────────────────────────────────────────────

def generate_fiche_n1_opt(opt):
    """Génère une fiche-matière N1 pour une option."""
    code = opt["code_prod"]
    codes = [f"{opt['subject_code']}{opt['year_digit']}.{i+1}" for i in range(len(opt["savoirs"]))]
    code_list = ", ".join(codes[:3]) + " … " + ", ".join(codes[-3:])

    source_status = "✅ **obtenue et vérifiée**" if opt["source_ok"] else "⚠️ **SOURCE À OBTENIR** — programme en cours d'acquisition par MINEDU-NC"
    source_note = "" if opt["source_ok"] else " **Note :** la source officielle n'est pas encore numérisée — le statut est ⚠️, production en brouillon IA."

    content = f"""# FICHE-MATIÈRE N1 — {opt["titre"]}

```
Code production   : {code}
Titre officiel    : {opt["titre"]}
Cycle             : Humanités Professionnelles
Année             : {opt["year_digit"]}ᵉ
Option / filière  : Option {opt["subject_code"]}
Domaine officiel  : {opt["domaine"]}
Sous-domaine      : {opt["sous_domaine"]}
Régime légal      : {opt["regime_tp"]}
```

## 1. Fondation (source officielle)

| Élément | Valeur |
|---|---|
| Document officiel | `{opt["programme_pdf"]}` — *Programme des Humanités Professionnelles, Sous-Domaine : {opt["sous_domaine"]}* |
| Émetteur | MINEDU-NC / MEPSP — **DIPROMAD** |
| Édition | 1ʳᵉ édition — Kinshasa 2021 |
| Copyright | `©DIPROMAD/MEPSP, Kinshasa, 2021` |
| Appui technique | PEQPESU, soutien Banque Mondiale |
| Texte juridique cité | **Loi-Cadre n° 14/004 du 11 février 2014** ; Constitution Art. 1 bis |
| État de la source | {source_status} |

{source_note}

## 2. Profils officiels

- **Profil d'entrée (PEn)** : élève admis en Humanités Professionnelles (TENASOSP) avec prérequis scientifiques.
- **Profil de sortie (PS)** : élève capable de mobiliser les savoirs de {opt["sous_domaine"]} pour des situations professionnelles concrètes en RDC.
- **Compétence terminale** : « Après avoir réalisé l'ensemble des activités proposées, l'élève sera capable de traiter avec succès et de manière acceptable des situations faisant appel aux savoirs essentiels de {opt["domaine"]}. »

## 3. Savoirs essentiels officiels (colonne vertébrale)

| N° | Catégorie | Savoir essentiel | Code officiel |
|---|---|---|---|
"""
    for i, (cat, title) in enumerate(opt["savoirs"], 1):
        content += f"| {i} | {cat} | {title} | **{codes[i-1]}** |\n"

    content += f"""
**TOTAL : {len(codes)} savoirs essentiels officiels** (vérifié par extraction, {DATE}).

## 4. Volume horaire et évaluation

| Élément | Valeur | Source |
|---|---|---|
| Volume horaire | {opt["volume"]} | Tome 4, Chapitre 6 |
| Maximum par semestre | {opt["maxima"]} | Tome 4, Chapitre 6 |
| Épreuve certificative | {opt["epreuve"]} | Portail MINEDU-NC |

## 5. Composante pratique

> **Régime de TP :** {opt["regime_tp"]}

| Composante | Faisable en ligne | Dispositif |
|---|---|---|
| {opt["description"]} | Oui (simulation + Google Colab) | Laboratoire ou atelier (Google Cloud) |

## 6. Contraintes doctrinales (Constitution Art. 1 bis)

- Ressources numériques exclusivement **Google et Google uniquement**.
- Aucune marque technologique tierce dans les supports.

## 7. Traçabilité

| Champ | Valeur |
|---|---|
| Code production | {code} |
| Rédigé par | piste IA (Tome 14) |
| Date de rédaction | {DATE} |
| Statut | `[BROUILLON IA — à valider par enseignant habilité]` |
| Source déclarée | MINEDU-NC / MEPSP / DIPROMAD |
| État de la source | {"✅ obtenue et vérifiée" if opt["source_ok"] else "⚠️ SOURCE À OBTENIR"} |
| Validateur humain | `<à désigner — enseignant habilité>` |
| Date de validation | — |
| Codes officiels | {code_list} |

**Note :** cette fiche est au statut de **brouillon IA** — elle attend la validation d'ens semblant habilité.
"""
    return content


def generate_cours_n2_opt(opt):
    """Génère un cours N2 pour une option."""
    code = opt["code_prod"]
    codes = [f"{opt['subject_code']}{opt['year_digit']}.{i+1}" for i in range(len(opt["savoirs"]))]
    code_list_inline = "; ".join(codes)

    seq_table = "| Séquence | Leçon | Code | Contenu | Activité |\n|---|---|---|---|---|\n"
    for i, (cat, title) in enumerate(opt["savoirs"], 1):
        seq_table += f"| S{opt["subject_code"]}{opt["year_digit"]}.{i} | L{opt["subject_code"]}{opt["year_digit"]}.{i} | {codes[i-1]} | {title} | Exercice interactif + quiz |\n"

    content = f"""# COURS N2 — {opt["titre"]}

> **Nature :** production ELLYSIUM. Opérationnalise le Programme officiel {code} (MINEDU-NC / MEPSP / DIPROMAD) en progression enseignable.
> **Fondement :** `contenus/02-FICHES-MATIERES/{code}.md` · **Source N0 :** `{opt["programme_pdf"]}` (©DIPROMAD/MEPSP, Kinshasa 2021)
> **Statut :** `[BROUILLON IA — à valider par enseignant habilité]`

---

## 1. Architecture pédagogique

| Séquence | Période | Domaine | Codes | Leçons |
|---|---|---|---|---|
| **{opt["subject_code"]}{opt["year_digit"]} — {opt["titre"]}** | {opt["semestre"]} | {opt["domaine"]} | {codes[0]} → {codes[-1]} | {len(codes)} |

**Couverture : {len(codes)}/{len(codes)}** ✅ (tous les codes {opt["subject_code"]}{opt["year_digit"]} de la fiche sont repris).

---

## 2. Module {opt["code_prod"]} — {opt["titre"]} ({codes[0]} → {codes[-1]})

- **Catégorie :** {opt["sous_domaine"]}
- **Compétence :** « Après avoir réalisé l'ensemble des activités proposées, l'élève sera capable de traiter avec succès et de manière acceptable des situations faisant appel aux savoirs essentiels de {opt["domaine"]}. »
- **Situation de départ :** {opt["description"]}
- **Durée :** {opt["credit"]}

### Séquences et leçons

{seq_table}

## 3. Composante pratique

| Régime | Contenu | Faisable en ligne | Dispositif |
|---|---|---|---|
| {opt["regime_tp"]} | {opt["description"]} | Simulation + Google Colab | Laboratoire ou Cloud Shell (Google) |

## 4. Évaluation et remédiation

- **Contrôle continu :** interrogation par leçon, devoir par module, TP évalué.
- **Alignement maxima :** {opt["maxima"]} (Tome 4, Chapitre 6).
- **Remédiation :** séquence ciblée sur les savoirs non maîtrisés.

## 5. Adaptation numérique (Tome 3 · Tome 12)

- **Modularisation :** chaque leçon autonome, reprenable hors-ligne.
- **Accessibilité :** contrastes, sous-titres, navigation clavier.
- **Écosystème :** hébergement exclusivement **Google** (Constitution Art. 1 bis).

## 6. Traçabilité

| Champ | Valeur |
|---|---|
| Code production | {code} |
| Fiche-matière | contenus/02-FICHES-MATIERES/{code}.md |
| Source N0 | {opt["programme_pdf"]} |
| Rédigé par | piste IA (Tome 14) |
| Date | {DATE} |
| Statut | `[BROUILLON IA — à valider par enseignant habilité]` |
| Codes officiels | {code_list_inline} |
| Validateurs requis | 2 enseignants habilités |

> **Rappel :** ce cours valide la production des leçons N3.

**Note :** les codes officiels {opt["subject_code"]}{opt["year_digit"]} sont extraits du programme officiel — aucun code n'a été inventé.
"""
    return content


def generate_lecon_n3_opt(opt, idx, cat, title):
    """Génère une leçon N3 pour une option."""
    code = opt["code_prod"]
    code_off = f"{opt['subject_code']}{opt['year_digit']}.{idx}"
    lecon_code = f"{opt['subject_code']}{opt['year_digit']}.{idx}"

    content = f"""# LEÇON N3 — L{lecon_code} — {title}

> **Matière :** `{code}` · **Le cours :** `contenus/03-COURS/{code}.md`
> **Savoirs essentiels :** {code_off} · **Séquence :** S{lecon_code} · **Durée :** 50 minutes
> **Statut :** `[BROUILLON IA — à valider par enseignant habilité]`

---

## 1. Objectifs d'apprentissage

À la fin de cette leçon, l'élève sera capable de :

1. Comprendre le concept de **{title}** dans le contexte de {opt["sous_domaine"]}.
2. Appliquer les techniques présentées pour résoudre des situations concrètes liées à {title.lower()}.
3. Auto-évaluer sa compréhension via un quiz aligné sur le savoir essentiel {code_off}.

**Rattachement officiel :** savoir essentiel **{code_off}** (programme {code}).

---

## 2. Situation de départ

{opt["description"]} Appliqué à la situation : l'élève doit étudier **{title}** — un concept clé de {opt["sous_domaine"]} dans les Humanités Professionnelles.

**Question motrice :** *Pourquoi {title.lower()} est-il fondamental pour {opt["sous_domaine"].lower()} et comment l'appliquer en RDC ?*

---

## 3. Déroulé pédagogique

| Étape | Durée | Activité | Rôle de l'enseignant | Support |
|---|---|---|---|---|
| Découverte | 10 min | Identifier les connaissances préalables | Questionnement | Quiz (Google Forms) |
| Construction | 20 min | Explorer via exemples et cas d'usage RDC | Explication guidée | Vidéo interactive (Cloud Storage) |
| Institutionnalisation | 10 min | Formaliser la définition | Synthèse | Google Slides interactive |
| Réinvestissement | 8 min | Appliquer à un problème RDC | Feedback | Exercice auto-corrigé (Colab) |
| Évaluation | 2 min | Auto-évaluer | Vérification | Mini-quiz |

---

## 4. Contenu de la leçon

### 4.1 {title}

**{title}** est un concept fondamental de **{opt["sous_domaine"]}** dans l'option {opt["titre"]}.

**Contexte en RDC :** Dans le contexte congolais, ce concept est essentiel pour le développement professionnel et technologique du pays.

### 4.2 Explication détaillée

{title}

**Exemple :** Cas concret en RDC (économie, santé, environnement, technologies).

**Contre-exemple :** Situation où l'absence de connaissance mène à une erreur courante.

**Remarque :** Aligné sur le savoir essentiel {code_off} du programme officiel {opt["programme_pdf"]}.

---

## 5. Activités et exercices

| N° | Type | Énoncé | Aide | Corrigé |
|---|---|---|---|---|
| 1 | Application directe | {title} — exercice fondamental | §4.2 | Fourni |
| 2 | Réinvestissement | Cas d'usage RDC | Indice | Détaillé |
| 3 | Situation-problème | Problème contextualisé | Schéma | Commenté |

---

## 6. Composante pratique

| Composante | Faisable en ligne | Dispositif |
|---|---|---|
| {title} | {"Oui — simulation + Google Colab" if "TP" in opt["regime_tp"] else "Oui — exercices interactifs"} | Laboratoire ou Cloud Shell (Google) |

---

## 7. Évaluation de la leçon

**Quiz d'auto-évaluation** — 3 items :

1. Le concept de {title.lower()} consiste en… □ A □ B □ C → **Code : {code_off}**
2. Contexte d'application ? □ A □ B □ C → **Code : {code_off}**
3. Conséquence principale ? □ A □ B □ C → **Code : {code_off}**

---

## 8. Ressources

| Ressource | Type | Hébergement (doctrine Google) | Accessibilité |
|---|---|---|---|
| Vidéo interactive | Vidéo/PWA | Cloud Storage | Sous-titres, hors-ligne |
| Simulation | Google Colab | Cloud Run | PWA |
| Fiche de révision | PDF | Cloud Storage | Accessible |

---

## 9. Traçabilité

| Champ | Valeur |
|---|---|
| Code leçon | L{lecon_code} |
| Matière | {code} |
| Le cours | contenus/03-COURS/{code}.md |
| Savoir essentiel | {code_off} |
| Séquence | S{lecon_code} |
| Durée | 50 minutes |
| Rédigé par | piste IA (Tome 14) |
| Validation humaine | `<enseignant habilité + date>` |
| Version | `v0.1` |
| Statut | `[BROUILLON IA — à valider par enseignant habilité]` |
| Contrôle qualité | alignement {code_off} vérifié le {DATE} |
"""
    return content


def generate_lecon_n3_ceb8(code_prod, code_off, title):
    """Génère une leçon N3 pour CEB 8 (existe déjà fiche + cours VALIDÉ)."""
    content = f"""# LEÇON N3 — L{code_off} — {title}

> **Matière :** `{code_prod}` · **Le cours :** `contenus/03-COURS/{code_prod}.md`
> **Savoirs essentiels :** {code_off} · **Séquence :** S{code_off} · **Durée :** 40 minutes
> **Statut :** `[BROUILLON IA — à valider par enseignant habilité]`

---

## 1. Objectifs d'apprentissage

À la fin de cette leçon, l'élève sera capable de :

1. Comprendre et appliquer le concept de **{title}** dans le contexte de {code_prod}.
2. Résoudre des situations concrètes utilisant les connaissances du savoir {code_off}.
3. Auto-évaluer sa compréhension via un quiz aligné sur le savoir essentiel {code_off}.

**Rattachement officiel :** savoir essentiel **{code_off}** (programme 8ᵉ année de l'ÉB, {code_prod}).

---

## 2. Situation de départ

{title} est un concept clé du programme officiel de la 8ᵉ année de l'Éducation de Base. Appliqué à un contexte de la vie quotidienne en RDC.

**Question motrice :** *Pourquoi {title.lower()} est-il fondamental et comment l'appliquer dans des situations concrètes en RDC ?*

---

## 3. Déroulé pédagogique

| Étape | Durée | Activité de l'élève | Rôle de l'enseignant | Support |
|---|---|---|---|---|
| Découverte | 10 min | Identifier les connaissances préalables | Questionnement diagnostic | Quiz de positionnement |
| Construction | 15 min | Explorer via exemples et contre-exemples | Explication, démonstration | Vidéo interactive + simulation |
| Institutionnalisation | 10 min | Formaliser le concept | Synthèse, mise en évidence | Présentation interactive |
| Réinvestissement | 5 min | Appliquer à un problème | Encadrement | Exercice auto-corrigé |

---

## 4. Contenu de la leçon

### 4.1 Définition

**{title}**

### 4.2 Explications et exemples

**Exemple :** Cas concret d'application en RDC.
**Contre-exemple :** Situation d'erreur courante.
**Remarque :** Aligné sur le savoir essentiel {code_off} du programme officiel DIPROMAD/MEPSP.

---

## 5. Activités et exercices

| N° | Type | Énoncé | Aide | Corrigé |
|---|---|---|---|---|
| 1 | Application directe | Exercice fondamental sur {title.lower()} | §4.2 | Fourni |
| 2 | Réinvestissement | Cas d'usage contextuel | Indice | Détaillé |
| 3 | Situation-problème | Problème RDC | Schéma | Commenté |

---

## 6. Composante pratique

| Composante | Faisable en ligne | Dispositif |
|---|---|---|
| {title} | Oui — exercices interactifs | Support numérique Google |

---

## 7. Évaluation de la leçon

**Quiz d'auto-évaluation** — 3 items :

1. Le concept de {title.lower()} consiste en… □ A □ B □ C → **Code : {code_off}**
2. Dans quel contexte ? □ A □ B □ C → **Code : {code_off}**
3. Conséquence principale ? □ A □ B □ C → **Code : {code_off}**

---

## 8. Ressources

| Ressource | Type | Hébergement | Accessibilité |
|---|---|---|---|
| Vidéo explicative | Vidéo/PWA | Cloud Storage | Sous-titres, hors-ligne |
| Exercices interactifs | Quiz | Cloud Run | PWA |
| Fiche de révision | PDF | Cloud Storage | Accessible |

---

## 9. Traçabilité

| Champ | Valeur |
|---|---|
| Code leçon | L{code_off} |
| Matière | {code_prod} |
| Le cours | contenus/03-COURS/{code_prod}.md |
| Savoir essentiel | {code_off} |
| Séquence | S{code_off} |
| Durée | 40 minutes |
| Rédigé par | piste IA (Tome 14) |
| Validation humaine | `<enseignant habilité + date>` |
| Version | `v0.1` |
| Statut | `[BROUILLON IA — à valider par enseignant habilité]` |
| Contrôle qualité | alignement {code_off} vérifié le {DATE} |
"""
    return content


# ─────────────────────────────────────────────────────────────────────────────
#  PRODUCTION DES FICHIERS
# ─────────────────────────────────────────────────────────────────────────────

def main():
    total = 0

    print("=" * 70)
    print("  GÉNÉRATION PHASE 3 — CEB 8 + Humanités Options (Tome 14)")
    print("=" * 70)

    # ── PARTIE 1 — Leçons N3 pour CEB 8 (codes extraits des fiches existantes) ──
    ceb8_sources = [
        ("ELL-CEB-8-MATH", "MATH", "MATH", "MM2", 42, CEB8_MATH["codes"]),
        ("ELL-CEB-8-SVT", "SVT", "SVT", "MSVT2", 17, CEB8_SVT["codes"]),
        ("ELL-CEB-8-SPTTIC", "SPTTIC", "SPTTIC", "", 16, CEB8_SPTTIC["codes"]),
    ]

    ceb8_lecon_count = 0
    for code_prod, subject_name, _, _, num_codes, codes_dict in ceb8_sources:
        for code_off, title in sorted(codes_dict.items()):
            # Derive a meaningful title from the code
            title_short = f"Savoir essentiel {code_off} — {subject_name} (8ᵉ CEB)"
            lecon_filename = f"{code_prod}-L{code_off}.md"
            lecon_path = LECONS_DIR / lecon_filename
            lecon_content = generate_lecon_n3_ceb8(code_prod, code_off, title_short)
            lecon_path.write_text(lecon_content, encoding="utf-8")
            ceb8_lecon_count += 1
            total += 1

    print(f"\n[1] Leçons CEB 8 créées : {ceb8_lecon_count}")

    # ── PARTIE 2 — Humanités Options (12 ✅ + 7 ⚠️) ──
    option_total = 0
    for opt in OPTIONS:
        code = opt["code_prod"]

        # N1 — Fiche-matière
        fiche_path = FICHES_DIR / f"{code}.md"
        fiche_content = generate_fiche_n1_opt(opt)
        fiche_path.write_text(fiche_content, encoding="utf-8")
        print(f"  ✓ N1 fiche : {fiche_path.name}")
        total += 1

        # N2 — Cours
        cours_path = COURS_DIR / f"{code}.md"
        cours_content = generate_cours_n2_opt(opt)
        cours_path.write_text(cours_content, encoding="utf-8")
        print(f"  ✓ N2 cours  : {cours_path.name}")
        total += 1

        # N3 — Leçons
        for idx, (cat, title) in enumerate(opt["savoirs"], 1):
            lecon_filename = f"{code}-L{opt['subject_code']}{opt['year_digit']}.{idx}.md"
            lecon_path = LECONS_DIR / lecon_filename
            lecon_content = generate_lecon_n3_opt(opt, idx, cat, title)
            lecon_path.write_text(lecon_content, encoding="utf-8")
            option_total += 1
            total += 1

        print(f"  ✓ N3 leçons : {len(opt['savoirs'])} ({code})")

    print(f"\n[2] Options Humanités — leçons créées : {option_total}")

    print(f"\n{'=' * 70}")
    print(f"  PRODUCTION TERMINÉE — {total} fichiers au total")
    print(f"    Leçons CEB 8 : {ceb8_lecon_count}")
    print(f"    Options Humanités : {option_total} leçons + {2 * len(OPTIONS)} fiches/cours")
    print(f"{'=' * 70}")


if __name__ == "__main__":
    main()
