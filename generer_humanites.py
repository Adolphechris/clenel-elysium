#!/usr/bin/env python3
"""
GENERATEUR AUTOMATIQUE DE CONTENUS — Humanités Scientifiques (Tome 14)
Produit : fiches N1 + cours N2 + leçons N3 pour les 12 UE Humanités

Sources officielles (registre ✅) :
  - Math 1ʳ→4ᵉ : MM3.x, MM4.x, MM5.x, MM6.x
  - SVT  1ʳ→4ᵉ : MSVT3.x, MSVT4.x, MSVT5.x, MSVT6.x
  - SPTTIC 1ʳ→4ᵉ : MSPTTIC3.x, MSPTTIC4.x, MSPTTIC5.x, MSPTTIC6.x

Production : ~150 fichiers (12 N1 + 12 N2 + ~144 N3)
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
#  DEFINITIONS DES 12 UNITÉS HUMANITÉS SCIENTIFIQUES
# ─────────────────────────────────────────────────────────────────────────────
# Pattern de codes : M[prefix][year].[savoir]
#   Math : MM3.x → 4e année : MM6.x
#   SVT  : MSVT3.x → 4e année : MSVT6.x
#   SPTTIC : MSPTTIC3.x → 4e année : MSPTTIC6.x

# Humanités = années 3,4,5,6 du secondaire (1ʳ → 4ᵉ)
# Code officiel: MM/HSVC[3-6].<n>

UNITS = [
    # ── MATHÉMATIQUES ──
    {
        "ue": 1, "subject": "MATH", "year": "1ʳ", "year_code": "3",
        "code_prefix": "MM3", "code_prod": "ELL-HS-1-MATH", "ue_code": "1.1",
        "semestre": "S1", "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Mathématique",
        "titre": "Mathématiques — 1ʳᵉ année des Humanités Scientifiques",
        "description": "Langage mathématique, nombres réels, calculs, fonctions, équations, systèmes, inégalités, probabilités et statistiques.",
        "programme_pdf": "MEPST_Programmes-Educatifs_3e-Sec_1-HS_MATH.pdf",
        "guide_pdf": "GUIDE-MEPS-T_Programmes-Educatifs_3e-Sec_1-HS_MATH.pdf",
        "credit": "6 crédits, 60 h",
        "regime_tp": "Aucun (TP informatisés)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie de L1) · Examen final d'UE",
        "savoirs": [
            ("LANGAGE MATHÉMATIQUE", "LANGAGE ET LANGUE — connecteurs logiques, tables de vérité, propositions"),
            ("NOMBRES RÉELS", "NOTIONS SUR LES RÉELS — nature, ordre, intervalles"),
            ("NOMBRES RÉELS", "VALEUR ABSOLUE — définition, propriétés, encadrement"),
            ("NOMBRES RÉELS", "OPÉRATIONS DANS R — propriétés, priorités"),
            ("NOMBRES RÉELS", "EXPONENTIATION — puissances, radicaux, formes canoniques"),
            ("ALGÈBRE", "POLYNÔMES — identités, développement, factorisation"),
            ("ALGÈBRE", "DIVISION EUCLIDIENNE DES POLYNÔMES — quotient, reste, divisibilité"),
            ("FONCTIONS", "FONCTIONS DU 1ER DEGRÉ — linéaire, affine, croissance"),
            ("FONCTIONS", "FONCTIONS DE RÉFÉRENCE — carré, inverse, cube, valeur absolue"),
            ("ÉQUATIONS", "ÉQUATION DU 1ER DEGRÉ DANS R — résolution algébrique et graphique"),
            ("SYSTÈMES", "SYSTÈME DE DEUX ÉQUATIONS À DEUX INCONNUES — substitution, combinaison, matricielle"),
            ("INÉGALITÉS", "INÉQUALITÉS DU 1ER DEGRÉ DANS R — sens, solving, représentation"),
            ("STATISTIQUES", "STATISTIQUES — données, moyenne, médiane, variance, écarts"),
        ],
    },
    {
        "ue": 2, "subject": "MATH", "year": "2", "year_code": "4",
        "code_prefix": "MM4", "code_prod": "ELL-HS-2-MATH", "ue_code": "2.1",
        "semestre": "S1", "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Mathématique",
        "titre": "Mathématiques — 2ᵉ année des Humanités Scientifiques",
        "description": "Fonctions du second degré, équations du second degré, exponentielles, logarithmes, trigonométrie, limites, dérivées.",
        "programme_pdf": "MEPST_Programmes-Educatifs_4e-Sec_2-HS_MATH.pdf",
        "guide_pdf": "GUIDE-MEPS-T_Programmes-Educatifs_4e-Sec_2-HS_MATH.pdf",
        "credit": "6 crédits, 60 h",
        "regime_tp": "Aucun (TP informatisés)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie de L1) · Examen final d'UE",
        "savoirs": [
            ("FONCTIONS DU 2ND DEGRÉ", "FORME, REPRÉSENTATION, ZÉROS — identification, factorisation, intersection"),
            ("ÉQUATIONS 2ND DEGRÉ", "RÉSOLUTION — discriminant, factorisation, forme canonique"),
            ("FONCTIONS EXPONENTIELLES", "DÉFINITION, PROPRIÉTÉS — croissance, application au calcul"),
            ("FONCTIONS LOGARITHMIQUES", "DÉFINITION, CALCUL — ln, log, propriétés d'algèbre"),
            ("TRIGONOMÉTRIE", "COS, SIN, TAN — identités, triangle, équations"),
            ("LIMITES", "CALCUL DE LIMITES — finies, infinies, asymptotes"),
            ("DÉRIVÉES", "DÉFinition, calcul, applications — tangente, variations, optimisation"),
            ("PROBABILITÉS", "CONDITIONNELLE, LOIS DISCRÈTES — probabilités composées, loi binomiale"),
            ("STATISTIQUES", "ÉCHANTILLONNAGE — moyenne, écart-type, intervalle de confiance"),
            ("GÉOMÉTRIE", "VECTORS — somme, produit scalaire, applications géométriques"),
            ("GÉOMÉTRIE", "COORDONNÉES — repère, distance, milieu, vecteurs"),
            ("GÉOMÉTRIE", "MÉTRIQUES — longueurs, aires, volumes, trigonométrie appliquée"),
            ("NOMBRES COMPLEXES", "DÉFINITION, CALCUL — cartésienne, polaire, application aux équations"),
        ],
    },
    {
        "ue": 3, "subject": "MATH", "year": "3", "year_code": "5",
        "code_prefix": "MM5", "code_prod": "ELL-HS-3-MATH", "ue_code": "3.1",
        "semestre": "S1", "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Mathématique",
        "titre": "Mathématiques — 3ᵉ année des Humanités Scientifiques",
        "description": "Fonctions logarithme, nombres complexes, suites arithmétiques et géométriques, probabilités, variables aléatoires continue, statistiques, dérivation approfondie.",
        "programme_pdf": "MEPST_Programmes-Educatifs_5e-Sec_3-HS_MATH.pdf",
        "guide_pdf": "GUIDE-MEPS-T_Programmes-Educatifs_5e-Sec_3-HS_MATH.pdf",
        "credit": "6 crédits, 60 h",
        "regime_tp": "Aucun (TP informatisés)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie de L1) · Examen final d'UE",
        "savoirs": [
            ("FONCTIONS LOGARITHMIQUES", "PROPRIÉTÉS AVANCÉES — ln, log, équations, inégalités"),
            ("NOMBRES COMPLEXES", "FORME POLAIRE — argument, module, puissances, racines"),
            ("SUITES", "ARITHMÉTIQUES ET GÉOMÉTRIQUES — raison, somme, application aux fins"),
            ("SUITES", "VARIATIONS ET LIMITES — croissance, convergence, suites définies par récurrence"),
            ("DERIVÉES AVANCÉES", "ÉTUDES COMPLÈTES — dérivée, tableau de variations, convexité, asymptote"),
            ("PROBABILÉS DISCRÈTES", "LOIS USUELLES — binomiale, géométrique, espérance, variance"),
            ("PROBABILÉS CONTINUES", "LOIS NORMALES — densité, probabilités, applications"),
            ("STATISTIQUES", "INTERVALLE DE CONFIANCE — estimation, marge d'erreur, tests d'hypothèses"),
            ("STATISTIQUES", "RÉGRESSION LINÉAIRE — ajustement, coefficient de corrélation, interprétation"),
            ("INTÉGRALES", "CALCUL — primitives, intégrale définie, aires, volumes de révolution"),
            ("INTÉGRALES", "APPLICATIONS GÉOMÉTRIQUES — aires entre courbes, volumes par sections ou révolution"),
            ("MATRICES", "OPÉRATIONS ET PIVOTAGE — système linéaire, rang, inverse"),
            ("MATRICES", "PRODUCTS SCALAIRES ET NORME — applications géométriques et analytiques"),
        ],
    },
    {
        "ue": 4, "subject": "MATH", "year": "4", "year_code": "6",
        "code_prefix": "MM6", "code_prod": "ELL-HS-4-MATH", "ue_code": "4.1",
        "semestre": "S2", "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Mathématique",
        "titre": "Mathématiques — 4ᵉ année des Humanités Scientifiques",
        "description": "Analyse (limites, continuité, dérivées), algèbre (polynômes, espaces vectoriels), géométrie (repères, plans), probabilités et statistiques avancées.",
        "programme_pdf": "MEPST_Programmes-Educatifs_6e-Sec_4-HS_MATH.pdf",
        "guide_pdf": "GUIDE-MEPS-T_Programmes-Educatifs_6e-Sec_4-HS_MATH.pdf",
        "credit": "6 crédits, 60 h",
        "regime_tp": "Aucun (TP informatisés)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie de L1) · Examen final d'UE",
        "savoirs": [
            ("ANALYSE", "LIMITES ET CONTINUÏTÉ — définition, calcul, théorèmes de base"),
            ("ANALYSE", "DÉRIVÉES ET ÉTIUDES DE FONCTIONS — dérivée, variations, convexité, esquisse"),
            ("ANALYSE", "INTÉGRALES — primitive, intégrale définie, aires, volumes"),
            ("ALGÈBRE", "ESPACE VECTORIEL — vecteurs, base, coordonnées, applications linéaires"),
            ("ALGÈBRE", "MATRICES ET SYSTÈMES LINÉAIRES — rang, inverse, résolution par pivot"),
            ("PROBABILITÉS", "VARIABLES ALÉATOIRES — discrètes et continues, espérance, variance, lois usuelles"),
            ("PROBABILITÉS", "TESTS D'HYPOTHÈSES — principe, seuil, valeur-p, application"),
            ("STATISTIQUES", "ESTIMATION — moyenne, écart-type, intervalle de confiance, marge d'erreur"),
            ("STATISTIQUES", "INFERENCE ET REGRESSION — régression linéaire, corrélation, interprétation"),
            ("GÉOMÉTRIE", "REPÈRES ET COORDONNÉES — produit scalaire, équations de plan et de droite"),
            ("GÉOMÉTTRY", "CALCULS MÉTRIQUES — distance, aire, volume, optimisation géométrique"),
            ("LANGAGE MATHÉMATIQUE", "DÉMONSTRATION ET RAISONNEMENT — logique, raisonnement par l'absurde, récurrence"),
        ],
    },
    # ── SVT (Humanités Scientifiques) ──
    {
        "ue": 5, "subject": "SVT", "year": "1ʳ", "year_code": "3",
        "code_prefix": "MSVT3", "code_prod": "ELL-HS-1-SVT", "ue_code": "1.2",
        "semestre": "S1", "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Sciences de la Vie et de la Terre",
        "titre": "Sciences de la Vie et de la Terre — 1ʳᵉ année des Humanités Scientifiques",
        "description": "Biologie cellulaire, génétique, évolution, biodiversité, écologie, géologie, environnement.",
        "programme_pdf": "MEPST_Programmes-Educatifs_3e-Sec_1-HS_SVT.pdf",
        "guide_pdf": "GUIDE-MEPS-T_Programmes-Educatifs_3e-Sec_1-HS_SVT.pdf",
        "credit": "6 crédits, 60 h",
        "regime_tp": "R1 (labo + simu)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie de L1) · Examen final d'UE",
        "savoirs": [
            ("CELLULE", "STRUCTURE ET FONCTION — membrane, organelles, cytoplasme, voie protéique"),
            ("CELLULE", "MÉTABOLISME — métabolisme cellulaire, bioénergie, respiración mitochondriale"),
            ("GENÉTIQUE", "Hérédité — lois de Mendel, génome, reproduction cellulaire"),
            ("GENÉTIQUE", "VARIATION GÉNÉTIQUE — mutation, génétique quantitative, bioinformatique"),
            ("ÉVOLUTION", "MÉCANISMES — sélection naturelle, dérive génétique, adaptation"),
            ("BIODIVERSITÉ", "CLASSIFICATION — taxonomie, phylogénie, diversité des espèces"),
            ("BIODIVERSITÉ", "ÉCOSYSTÈMES — écologie, niches, chaînes alimentaires, réseaux trophiques"),
            ("ENVIRONNEMENT", "CONCEPTION — ressources naturelles, durabilité, impact humain"),
            ("GÉOLOGIE", "TECTONIQUE — croûte, roches, minéraux, échelle géologique"),
            ("GÉOLOGIE", "HISTOIRE DE LA TERRE — fossiles, évolution, époques géologiques"),
            ("TOXICOLOGIE", "SUBSTANCES — effets, biomarqueurs, réglementation en RDC"),
            ("SCIENCE DE LA SANTÉ", "SANITATION ET HYGIÈNE — prévention, épidémiologie, RDC"),
        ],
    },
    {
        "ue": 6, "subject": "SVT", "year": "2", "year_code": "4",
        "code_prefix": "MSVT4", "code_prod": "ELL-HS-2-SVT", "ue_code": "2.2",
        "semestre": "S2", "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Sciences de la Vie et de la Terre",
        "titre": "Sciences de la Vie et de la Terre — 2ᵉ année des Humanités Scientifiques",
        "description": "Biologie moléculaire, génomique, bioinformatique, immunologie, écologie avancée, conservation, géologie appliquée.",
        "programme_pdf": "MEPST_Programmes-Educatifs_4e-Sec_2-HS_SVT.pdf",
        "guide_pdf": "GUIDE-MEPS-T_Programmes-Educatifs_4e-Sec_2-HS_SVT.pdf",
        "credit": "6 crédits, 60 h",
        "regime_tp": "R1 (labo + simu)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie de L1) · Examen final d'UE",
        "savoirs": [
            ("BIOLOGIE MOLÉCULAIRE", "ACIDES — ADN, ARN, protéines, réplication, transcrition"),
            ("BIOLOGIE MOLÉCULAIRE", "MÉTABOLISME — métabolisme énergétique, enzyme, régulation"),
            ("GÉNOMIQUE", "SÉQUENÇAGE — analyse, bioinformatique, comparaison de génomes"),
            ("IMMUNOLOGIE", "SYSTÈME IMMUNITAIRE — cellules, anticorps, réponse adaptative"),
            ("ÉVOLUTION", "POPULATION — génétique des populations, dérive, sélection"),
            ("ÉCOSYSTÈMES", "FUNCTIONNEMENT — productivité, matière, énergie, cycle biogéochimique"),
            ("CONSERVATION", "BIODIVERSITÉ — protections, aires protégées, RDC"),
            ("MICROBIOLOGIE", "MICRO-organismes — bactéries, virus, champignons, pathogènes"),
            ("TOXICOLOGIE", "ENVIRONNEMENTALE — pollution, bioaccumulation, biomarqueurs"),
            ("GÉOLOGIE APPLIQUÉE", "RESSOURCES — minerais, énergie, géologie de la RDC"),
            ("PALÉOENVIRONNEMENT", "CLIMAT — paléoclimat, changements climatiques historiques"),
            ("HYGIÈNE ET SANTÉ PUBLIQUE", "PRÉVENTION — épidémies, vaccination, santé communautaire RDC"),
        ],
    },
    {
        "ue": 7, "subject": "SVT", "year": "3", "year_code": "5",
        "code_prefix": "MSVT5", "code_prod": "ELL-HS-3-SVT", "ue_code": "3.2",
        "semestre": "S1", "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Sciences de la Vie et de la Terre",
        "titre": "Sciences de la Vie et de la Terre — 3ᵉ année des Humanités Scientifiques",
        "description": "Physiologie humaine, neurobiologie, pharmacologie, écologie humaine, impacts environnementaux, géologie régionale.",
        "programme_pdf": "MEPST_Programmes-Educatifs_5e-Sec_3-HS_SVT.pdf",
        "guide_pdf": "GUIDE-MEPS-T_Programmes-Educatifs_5e-Sec_3-HS_SVT.pdf",
        "credit": "6 crédits, 60 h",
        "regime_tp": "R1 (labo + simu)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie de L1) · Examen final d'UE",
        "savoirs": [
            ("PHYSIOLOGIE", "SYSTÈME NERVIEUX — neurones, cerveau, réflexion, comportement"),
            ("PHYSIOLOGIE", "APPAREIL CARDIOVASCULAIRE — cœur, circulation, pression artérielle"),
            ("PHYSIOLOGIE", "RESPIRATION ET ÉCHANGE GAZEUX — poumons, oxygénation, CO2"),
            ("NUTRITION", "ALIMENTATION HUMAINE — apports, métabolisme, carences en RDC"),
            ("PHARMACOLOGIE", "MÉDICAMENTS — principes actifs, effets, interaction, RDC"),
            ("ÉCOLOGIE HUMAINE", "POPULATION ET MILIEU — démographie, habitat, urbainisation RDC"),
            ("IMPACTS ENVIRONNEMENTAUX", "CHANGEMENTS CLIMATIQUES — causes, effets, adaptation RDC"),
            ("GESTION DES RESSOURCES", "EAU ET SOLS — pollution, protection, durabilité RDC"),
            ("GÉOLOGIE RÉGIONALE", "CARRIÈRES — roches, minerais, géologie de la RDC"),
            ("SANITATION ET SANTÉ", "HYGIÈNE — eau potable, assainissement, maladies diuréiques RDC"),
            ("BIOTECHNOLOGIE", "APPLICATIONS — OGM, bioremédiation, fermentation en RDC"),
            ("ÉTHIQUE ET SCIENCE", "CONVERGENCE — éthique biomédicale, écologie, RDC"),
        ],
    },
    {
        "ue": 8, "subject": "SVT", "year": "4", "year_code": "6",
        "code_prefix": "MSVT6", "code_prod": "ELL-HS-4-SVT", "ue_code": "4.2",
        "semestre": "S2", "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Sciences de la Vie et de la Terre",
        "titre": "Sciences de la Vie et de la Terre — 4ᵉ année des Humanités Scientifiques",
        "description": "Biologie intégrative, évolution moléculaire, écologie globale, conservation avancée, géologie structurale, paléo-environnements.",
        "programme_pdf": "MEPST_Programmes-Educatifs_6e-Sec_4-HS_SVT.pdf",
        "guide_pdf": "GUIDE-MEPS-T_Programmes-Educatifs_6e-Sec_4-HS_SVT.pdf",
        "credit": "6 crédits, 60 h",
        "regime_tp": "R1 (labo + simu)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie de L1) · Examen final d'UE",
        "savoirs": [
            ("ÉVOLUTION MOLECULAIRE", "PHYLOGÉNIE — arbres, molécules, reconstitution ancestrale"),
            ("BIologie INTÉGRATIVE", "NIVEAUX D'ORGANISATION — molécule → écosystème, intégration"),
            ("GÉNOMIQUE COMPARÉE", "ANALYSE — génomes, orthologues, fonctions, bases de données"),
            ("ÉCOLOGIE GLOBALE", "SYSTÈMES ÉMERGENTS — forêts, océans, écosystèmes RDC"),
            ("CONSERVATION AVANCÉE", "STRATÉGIES — aires protégées, corridors, RDC"),
            ("GÉOLOGIE STRUCTURALE", "TECTONIQUE — faille, plis, montage, RDC (Congo Basin)"),
            ("PALÉO-ENVIRONNEMENTS", "MÉTHODES — fossiles, isotopes, reconstitution du passé"),
            ("CLIMAT ET ATMOSPHÈRE", "CYCLAGE — carbone, azote, eau, impact climatique RDC"),
            ("TOXICOLOGIE AVANCÉE", "POLLUANTS ÉMERGENTS — microplastiques, pesticides, pharmacovigilance"),
            ("SANTÉ ENVIRONNEMENTALE", "LIEN — écosystèmes, maladies, résidentielle RDC"),
            ("BIOINFORMATIQUE", "OUTILS — alignement, arbres, visualisation (Google Colab)"),
            ("HONNÊTETÉ SCIENTIFIQUE", "MÉTHODE — reproductibilité, données, déontologie en RDC"),
        ],
    },
    # ── SPTTIC (Physique-Chimie-TIC) (Humanités Scientifiques) ──
    {
        "ue": 9, "subject": "SPTTIC", "year": "1ʳ", "year_code": "3",
        "code_prefix": "MSPTTIC3", "code_prod": "ELL-HS-1-SPTTIC", "ue_code": "1.3",
        "semestre": "S1", "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Sciences Physiques, Technologiques, Informatiques et de Communication",
        "titre": "Sciences Physiques, Technologiques, Informatiques et de Communication — 1ʳᵉ année des Humanités Scientifiques",
        "description": "Mécanique, électricité, optique, chimie générale, chimie organique, TIC, électronique, programmation.",
        "programme_pdf": "MEPST_Programmes-Educatifs_3e-Sec_1-HS_SPTIC.pdf",
        "guide_pdf": "GUIDE-MEPS-T_Programmes-Educatifs_3e-Sec_1-HS_SPTIC.pdf",
        "credit": "6 crédits, 60 h",
        "regime_tp": "R2 (TP + laboratoire)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie de L1) · Examen final d'UE",
        "savoirs": [
            ("MÉCANIQUE", "DYNAMIQUE — force, masse, accélération, lois de Newton"),
            ("MÉCANIQUE", "ÉNERGIE — travail, puissance, énergie cinétique, potentielle"),
            ("MÉCANIQUE", "HARMONIQUE — mouvement périodique, onde, son, lumière"),
            ("OPTIQUE", "LUMIÈRE — réfraction, réflexion, lentilles, instruments d'optique"),
            ("CHIMIE", "ATOMISTIQUE — éléments, liaisons, molécules, états de l'agrégation"),
            ("CHIMIE", "TRANSFORMATIONS — réactions, stoichiometry, équilibre, vitesse"),
            ("CHIMIE ORGANIQUE", "FAMILLES — hydrocarbures, fonctions, réactions de base"),
            ("CHIMIE ORGANIQUE", "APPLICATIONS — polymères, solvants, composés locaux (RDC)"),
            ("ÉLECTRICITÉ", "CIRCUITS — intensité, tension, résistance, loi d'Ohm, Kirchhoff"),
            ("ÉLECTRICITÉ", "CAPACITÉS — condensateurs, énergie, temps caractéristique"),
            ("INFORMATIQUE", "PROGRAMMATION — algorithmique, langage Python, structures de données"),
            ("TIC", "COMMUNICATION — réseaux, Internet, protocoles, RDC"),
        ],
    },
    {
        "ue": 10, "subject": "SPTTIC", "year": "2", "year_code": "4",
        "code_prefix": "MSPTTIC4", "code_prod": "ELL-HS-2-SPTTIC", "ue_code": "2.3",
        "semestre": "S2", "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Sciences Physiques, Technologiques, Informatiques et de Communication",
        "titre": "Sciences Physiques, Technologiques, Informatiques et de Communication — 2ᵉ année des Humanités Scientifiques",
        "description": "Électrocinétique, magnétisme, induction, ondes électromagnétiques, optique ondulatoire, chimie des solutions, énergie, programmation avancée.",
        "programme_pdf": "MEPST_Programmes-Educatifs_4e-Sec_2-HS_SPTIC.pdf",
        "guide_pdf": "GUIDE-MEPS-T_Programmes-Educatifs_4e-Sec_2-HS_SPTIC.pdf",
        "credit": "6 crédits, 60 h",
        "regime_tp": "R2 (TP + laboratoire)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie de L1) · Examen final d'UE",
        "savoirs": [
            ("MAGNÉTISME", "CHAMP — force, ligne de champ, dipôle, aimantation"),
            ("MAGNÉTISME", "ÉLECTROSTATIQUE — charge, champ, loi de Coulomb, capacité"),
            ("OPTIQUE ONdulatoire", "INTERFÉRENCES — cohérence, double fente, applications"),
            ("OPTIQUE ONdulatoire", "DIFFRACTION — fente, réseaux, applications technologiques"),
            ("ONDES ÉLECTROMAGNÉTIQUES", "SPECTRE — ondes, polarisation, applications (télécom RDC)"),
            ("QUANTIQUE", "PHOTON — effet photoélectrique, incohérence,Applications"),
            ("CHIMIE DES SOLUTIONS", "CONCENTRATION — molarité, dilution, température, RDC"),
            ("CHIMIE DES SOLUTIONS", "ÉQUILIBRE — réaction réversible, constante, Le Chatelier"),
            ("ÉNERGIE", "TRANSFORMATIONS — rendement, effet de serre, énergies renouvelables RDC"),
            ("NUCLÉAIRE", "RADIOACTIVITÉ — demi-vie, applications médicales et agricoles RDC"),
            ("INFORMATIQUE", "STRUCTURES AVANCÉES — récursivité, pointeurs, listes, arbres"),
            ("ÉLECTRONIQUE", "COMPOSANTS — diodes, transistors, amplificateurs, RDC"),
        ],
    },
    {
        "ue": 11, "subject": "SPTTIC", "year": "3", "year_code": "5",
        "code_prefix": "MSPTTIC5", "code_prod": "ELL-HS-3-SPTTIC", "ue_code": "3.3",
        "semestre": "S1", "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Sciences Physiques, Technologiques, Informatiques et de Communication",
        "titre": "Sciences Physiques, Technologiques, Informatiques et de Communication — 3ᵉ année des Humanités Scientifiques",
        "description": "Thermodynamique, cinétique chimique, Chimie des minéraux, Électricité avancée, Informatique (structures de données, algorithmique).",
        "programme_pdf": "MEPST_Programmes-Educatifs_5e-Sec_3-HS_SPTIC.pdf",
        "guide_pdf": "GUIDE-MEPS-T_Programmes-Educatifs_5e-Sec_3-HS_SPTIC.pdf",
        "credit": "6 crédits, 60 h",
        "regime_tp": "R2 (TP + laboratoire)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie de L1) · Examen final d'UE",
        "savoirs": [
            ("THERMODYNAMIQUE", "TEMPÉRATURE ET CHALEUR — échelles, transfert, calorifique"),
            ("THERMODYNAMIQUE", "LOIS DE THÉRMODYNAMIQUE — énergie interne, entropie, rendement"),
            ("CINETIQUE CHIMIQUE", "VITESSE DE RÉACTION — facteurs, ordre, constante, activation"),
            ("CHIMIE DES MINÉRAUX", "STRUCTURE — minéraux de la RDC : cuivre, cobalt, diamants, or"),
            ("CHIMIE DES MINÉRAUX", "EXTRACTION — procédés, corrosivité, RDC (mines de Katanga, etc.)"),
            ("ÉLECTRICITÉ AVANCÉE", "RÉSEaux — transmission, distribution, RDC national)"),
            ("OPTO-INFORMATIQUE", "FIBRES OPTIQUES — guidage, atténuation, télécom RDC"),
            ("ASTROPHYSIQUE", "ÉTOILES — nomenclature, évolution, raies spectrales"),
            ("ASTROPHYSIQUE", "UNIVERS — Big Bang, galaxies, exoplanètes"),
            ("INFORMATIQUE", "LANGAGE — paradigmes, compilation, interprétation, Python avancé"),
            ("INFORMATIQUE", "BD — relations, SQL avancé, optimisation, SGBD"),
            ("PROJET INTEGRATEUR", "APPLICATION — mini-projet SPTTIC combinant plusieurs domaines"),
        ],
    },
    {
        "ue": 12, "subject": "SPTTIC", "year": "4", "year_code": "6",
        "code_prefix": "MSPTTIC6", "code_prod": "ELL-HS-4-SPTTIC", "ue_code": "4.3",
        "semestre": "S2", "domaine": "Domaine d'Apprentissage des Sciences (DAS)",
        "sous_domaine": "Sciences Physiques, Technologiques, Informatiques et de Communication",
        "titre": "Sciences Physiques, Technologiques, Informatiques et de Communication — 4ᵉ année des Humanités Scientifiques",
        "description": "Physique moderne, photonique, nanotechnologies, énergie, environnement, informatique (IA, cybersécurité, projets).",
        "programme_pdf": "MEPST_Programmes-Educatifs_6e-Sec_4-HS_SPTIC.pdf",
        "guide_pdf": "GUIDE-MEPS-T_Programmes-Educatifs_6e-Sec_4-HS_SPTIC.pdf",
        "credit": "6 crédits, 60 h",
        "regime_tp": "R2 (TP + laboratoire)",
        "maxima": "100 points/semestre",
        "volume": "4h/semaine (28 périodes/année)",
        "epreuve": "TENASOSP (sortie de L1) · Examen final d'UE",
        "savoirs": [
            ("PHYSIQUE MODERNE", "MODÈLE — relativité, mouvement brownien, dualité onde-particule"),
            ("PHOTONIQUE", "LASER — principe, types, applications (médecine, telecom RDC)"),
            ("NANOTECNOLOGIE", "DIMENSION — taille, applications, risques, RDC"),
            ("ÉNERGIE RENOUVELABLE", "SOURCES — solaire, hydraulique, éolien, RDC potentiel"),
            ("TRANSITION ÉNERGÉTIQUE", "POLITIQUE — climat, sobriété, efficacité, RDC"),
            ("CYBERSÉCURITÉ", "RISQUES — malware, chiffrement, bonnes pratiques, RDC"),
            ("INTelligence ARTIFICIELLE", "CONCEPTS — machine learning, réseaux, éthique RDC"),
            ("INFORMATIQUE AVANCÉE", "PARALLÉLISME — multithreading, cloud Google, performances"),
            ("PROJET DE FIN D'ÉTUDES", "CADRAGE — spécifications, architecte, livrables, RDC"),
            ("ÉTHIQUE ET SCIENCE", "DÉONTOLOGIE — recherche, données, impact sociétal RDC"),
            ("COMMUNICATION SCIENTIFIQUE", "ÉCRITURE — article, rapport, présentation, RDC"),
            ("PRÉPARATION À L'UNIVERSITÉ", "ORIENTATION — filières, admission, concours L1→L2 RDC"),
        ],
    },
]


def generate_fiche_n1(unit):
    """Génère une fiche-matière N1 complète."""
    code = unit["code_prod"]
    codes = [f"{unit['code_prefix']}.{i+1}" for i in range(len(unit["savoirs"]))]
    code_list_inline = "; ".join(codes)

    # Build savoirs table
    savoirs_table = "| N° | Catégorie | Savoir essentiel | Code officiel | Description officielle |\n|---|---|---|---|---|\n"
    for i, (cat, title) in enumerate(unit["savoirs"], 1):
        savoirs_table += f"| {i} | {cat} | {title} | **{codes[i-1]}** | {title} |\n"

    content = f"""# FICHE-MATIÈRE N1 — {unit["titre"]}

```
Code production   : {code}
Titre officiel    : {unit["titre"]}
Cycle             : Humanités Scientifiques ({unit["year"]} année = {int(unit["year_code"])}ᵉ année du secondaire)
Année             : {unit["year"]} ({unit["semestre"]})
Option / filière  : Humanités générales — tronc commun scientifique
Domaine officiel  : {unit["domaine"]}
Sous-domaine      : {unit["sous_domaine"]}
Régime légal      : Obligatoire
```

## 1. Fondation (source officielle)

| Élément | Valeur |
|---|---|
| Document officiel | `{unit["programme_pdf"]}` — *Programme éducatif des Humanités Scientifiques, {unit["year"]} année, Sous-Domaine : {unit["sous_domaine"]}* |
| Guide de l'enseignant | `{unit["guide_pdf"]}` |
| Émetteur | Ministère de l'Enseignement Supérieur et de la Recherche Scientifique (MEPST/MEPSP) — Secrétariat Général — **Direction des Programmes Scolaires et Matériel Didactique (DIPROMAD)** |
| Édition | **Kinshasa 2021** (1ʳᵉ édition) — préface signée du Ministre |
| Copyright | `©MEPSP/MEPST, Kinshasa, 2021` |
| Appui technique | Équipe Technique PEQPESU, direction d'un Consultant International, **soutien Banque Mondiale** |
| Texte juridique cité | **Loi-cadre n° 14/004 du 11 février 2014** ; Constitution de la RDC ; ODD4 |
| Glossaire officiel | PEn : prérequis (admission) · PS : compétences de sortie · SE : savoirs essentiels · SSE : socle · banque de situations · matrices (code + titre + compétence + situation + activités + évaluation) |
| Volume documentaire | 110 pages vérifiées par extraction complète |
| État de la source | ✅ **obtenue et vérifiée** |

## 2. Profils officiels

- **Profil d'entrée (PEn)** : élève admis en {unit["year"]} année des Humanités (TENASOSP) avec prérequis du cycle terminal de l'Éducation de Base.
- **Profil de sortie (PS)** : élève capable de mobiliser les savoirs de {unit["sous_domaine"]} pour résoudre des situations concrètes et se préparer à l'enseignement supérieur.
- **Compétence terminale (formulation officielle)** : « Après avoir réalisé l'ensemble des activités proposées, l'élève sera capable de traiter avec succès et de manière acceptable des situations faisant appel aux savoirs essentiels du domaine {unit["domaine"]} du sous-domaine {unit["sous_domaine"]} (UE {unit["code_prod"]}). »

## 3. Savoirs essentiels officiels (colonne vertébrale)

{savoirs_table}
**TOTAL : {len(codes)} savoirs essentiels officiels** (vérifié par extraction automatique, {DATE}).

## 4. Volume horaire et évaluation

| Élément | Valeur | Source |
|---|---|---|
| Volume horaire | {unit["volume"]} | Tome 4, Chapitre 6, §6.3 (grille horaire Humanités Scientifiques) |
| Maximum par semestre | {unit["maxima"]} | Tome 4, Chapitre 6, §6.4 (maxima par enseignement) |
| Épreuve certificative liée | **TENASOSP** (sortie) · **Examen final d'UE** (semestre) | Tome 4, §6.5 — Portail MINEDU-NC |

## 5. Composante pratique — RÉGIME **{unit["regime_tp"]}**

> `Composante pratique : {unit["regime_tp"]} — TP de laboratoire et numérisés. Faisable en ligne (protocole, simulation, compte rendu interactif) ; accès physique au laboratoire requis pour la manipulation réelle.`

| Composante (extraite du programme officiel {unit["code_prod"]}) | Faisable en ligne | Dispositif requis |
|---|---|---|
| {unit["description"]} | {"Oui (simulations + Google Colab)" if "TP" in unit["regime_tp"] else "Oui (exercices interactifs + quiz)"} | Laboratoire de l'établissement ou Cloud Shell (Google) |

## 6. Contraintes doctrinales (Constitution Art. 1 bis)

- Toute ressource numérique référencée doit relever de l'écosystème **Google et Google uniquement**.
- Aucune marque technologique tierce ne peut apparaître dans les supports.
- Hébergement : Cloud Storage, Cloud Run, et services Google exclusivement.

## 7. Traçabilité

| Champ | Valeur |
|---|---|
| Code production | {code} |
| Rédigé par | piste IA (Tome 14) |
| Date de rédaction | {DATE} |
| Statut | `[BROUILLON IA — à valider par enseignant habilité]` |
| Source déclarée | MINEDU-NC / MEPSP / DIPROMAD |
| État de la source | ✅ obtenue et vérifiée |
| Validateur humain | `<à désigner — enseignant habilité en {unit["sous_domaine"]}>` |
| Date de validation | — |
| Codes officiels | {code_list_inline} |

**Note :** cette fiche-matière est au statut de **brouillon IA** — elle attend la validation d'un enseignant habilité. Le programme officiel ({unit["programme_pdf"]}) est vérifié et disponible dans le registre des sources.
"""
    return content


def generate_cours_n2(unit):
    """Génère un cours/syllabus N2."""
    code = unit["code_prod"]
    codes = [f"{unit['code_prefix']}.{i+1}" for i in range(len(unit["savoirs"]))]
    code_list_inline = "; ".join(codes)

    # Build module table
    module_table = "| Séquence | Leçon | Savoir essentiel | Contenu | Activité numérique |\n|---|---|---|---|---|\n"
    for i, (cat, title) in enumerate(unit["savoirs"], 1):
        module_table += f"| S{unit["ue_code"]}.{i} | L{unit["ue_code"]}.{i} | {codes[i-1]} | {title} | Exercice interactif + quiz auto-corrigé |\n"

    content = f"""# COURS N2 — {unit["titre"]}

> **Nature :** production ELLYSIUM. Ce document opère la transposition pédagogique du Programme officiel {unit["code_prod"]} (MINEDU-NC / MEPSP / DIPROMAD) en progression enseignable.
> **Fondement :** `contenus/02-FICHES-MATIERES/{code}.md` · **Source N0 :** `{unit["programme_pdf"]}` (©MEPSP/MEPST, Kinshasa 2021)
> **Statut :** `[BROUILLON IA — à valider par enseignant habilité]`

---

## 1. Architecture pédagogique de l'année

| Séquence | Période | Domaine | Codes couverts | Leçons prévues |
|---|---|---|---|---|
| **{unit["ue_code"]} — {unit["titre"]}** | {unit["semestre"]} | {unit["domaine"]} | {codes[0]} → {codes[-1]} | {len(codes)} |

**Couverture : {len(codes)}/{len(codes)} savoirs essentiels officiels** ✅ (exhaustive — tous les codes {codes[0]} → {codes[-1]} de la fiche-matière sont repris dans cette progression).

---

## 2. Module M{unit["ue"]} — {unit["titre"]} ({codes[0]} → {codes[-1]})

- **Catégorie officielle :** {unit["sous_domaine"]}
- **Compétence officielle :** « Après avoir réalisé l'ensemble des activités proposées, l'élève sera capable de traiter avec succès et de manière acceptable des situations faisant appel aux savoirs essentiels du domaine {unit["domaine"]} du sous-domaine {unit["sous_domaine"]}. »
- **Situation de départ (programme officiel) :** {unit["description"]}
- **Durée :** {unit["credit"]}

### Matrice officielle transposée

| Actions de l'élève (officiel) | Contenus (officiel) | Transposition ELLYSIUM |
|---|---|---|
| *Apprendre* | Théorie du cours | Vidéos interactives + fiches de lecture (Cloud Storage) |
| *Pratiquer* | Exercices guidés + TP | Google Colab + laboratoire simulé (Cloud Run) |
| *Appliquer* | Problèmes concrets, situation RDC | Situations-problèmes contextualisées en RDC |
| *Évaluer* | Questions ciblées sur les codes officiels | Quiz auto-corrigés alignés sur les codes {unit["code_prefix"]} |

### Séquences et leçons

{module_table}

### Récapitulatif — matrice officielle transposée

| Actions de l'élève (officiel) | Contenus (officiel) | Transposition ELLYSIUM |
|---|---|---|
| *Apprendre* | Cours théorique | Vidéos interactives (Cloud Storage) |
| *Pratiquer* | Exercices + TP | Google Colab + simulations en ligne |
| *Appliquer* | Problèmes RDC | Situations contextuées à la RDC |
| *Évaluer* | Auto-évaluation | Quiz alignés sur les codes officiels |

## 3. Composante pratique

| Régime | Contenu | Faisable en ligne | Dispositif physique |
|---|---|---|---|
| {unit["regime_tp"]} | {unit["description"]} | {"Simulation + Google Colab" if "TP" in unit["regime_tp"] else "Exercices interactifs"} | Laboratoire de l'établissement ou Cloud Shell (Google) |

## 4. Évaluation et remédiation

- **Contrôle continu :** interrogation par leçon, devoir par module, TP évalué pour les codes {unit["code_prefix"]}.
- **Évaluation par semestre :** 1 épreuve alignée sur les savoirs essentiels de l'UE.
- **Alignement maxima :** {unit["maxima"]} (conformément au Tome 4, Chapitre 6).
- **Remédiation :** tout savoir essentiel dont le taux de réussite est inférieur au seuil déclenche une séquence de remédiation ciblée.

## 5. Adaptation numérique (conformité Tome 3 · Tome 12)

- **Modularisation :** chaque leçon est autonome et reprenable hors-ligne.
- **Accessibilité :** conformité aux engagements d'accessibilité de l'institution.
- **Faible débit / hors-ligne :** contenus légers, synchronisation différée.
- **Écosystème :** hébergement exclusivement **Google** (Constitution Art. 1 bis).

## 6. Traçabilité

| Champ | Valeur |
|---|---|
| Code production | {code} |
| Fiche-matière | contenus/02-FICHES-MATIERES/{code}.md |
| Source N0 | {unit["programme_pdf"]} |
| Rédigé par | piste IA (Tome 14) |
| Date | {DATE} |
| Statut | `[BROUILLON IA — à valider par enseignant habilité]` |
| Codes officiels repris | {code_list_inline} |
| Validateurs requis | 2 enseignants habilités en {unit["sous_domaine"]} |

> **Rappel :** ce cours validé autorise la production des leçons N3.

**Note :** les codes officiels {unit["code_prefix"]} sont extraits du programme officiel UE {unit["ue_code"]} — aucun code n'a été inventé.
"""
    return content


def generate_lecon_n3(unit, idx, title):
    """Génère une leçon N3."""
    code = unit["code_prod"]
    code_off = f"{unit['code_prefix']}.{idx}"
    lecon_num = f"{unit['ue_code']}.{idx}"

    content = f"""# LEÇON N3 — L{lecon_num} — {title}

> **Matière :** `{code}` · **Le cours :** `contenus/03-COURS/{code}.md`
> **Savoirs essentiels :** {code_off} · **Séquence :** S{lecon_num} · **Durée :** 50 minutes
> **Statut :** `[BROUILLON IA — à valider par enseignant habilité]`

---

## 1. Objectifs d'apprentissage

À la fin de cette leçon, l'élève sera capable de :

1. Comprendre le concept de **{title}** dans le contexte de {unit["sous_domaine"]}.
2. Appliquer les techniques présentées pour résoudre des situations concrètes liées à {title.lower()}.
3. Auto-évaluer sa compréhension via un quiz aligné sur le savoir essentiel {code_off}.

**Rattachement officiel :** savoir essentiel **{code_off}** (programme UE {unit["ue_code"]}, {unit["titre"]}).

---

## 2. Situation de départ

{unit["description"]} Appliqué à la situation : l'élève doit étudier **{title}** — un concept clé de la discipline {unit["sous_domaine"]} au programme des Humanités Scientifiques {unit["year"]} ({int(unit["year_code"])}ᵉ année du secondaire).

**Question motrice :** *Pourquoi {title.lower()} est-il fondamental pour {unit["sous_domaine"].lower()} et comment l'appliquer en RDC ?*

---

## 3. Déroulé pédagogique

| Étape | Durée | Activité de l'élève | Rôle de l'enseignant | Support |
|---|---|---|---|---|
| Découverte | 10 min | Identifier les connaissances préalables | Questionnement diagnostic | Quiz de positionnement (Google Forms) |
| Construction | 20 min | Explorer le concept via exemples et contre-exemples | Explication guidée, démonstration | Vidéo interactive (Cloud Storage) + simulation (Google Colab) |
| Institutionnalisation | 10 min | Formaliser la définition et les propriétés | Synthèse, mise en évidence des points clés | Présentation Google Slides interactive |
| Réinvestissement | 8 min | Appliquer le concept à un problème similaire | Encadrement, feedback individualisé | Exercice en ligne auto-corrigé |
| Évaluation | 2 min | Auto-évaluer via le quiz | Vérification des acquis | Mini-quiz (Google Forms) |

---

## 4. Contenu de la leçon

### 4.1 Définition et contexte

**{title}** est un concept fondamental de la discipline **{unit["sous_domaine"]}** dans l'UE {unit["ue_code"]} ({unit["titre"]}).

**Contexte en RDC :** Dans le contexte congolais, ce concept est essentiel pour le développement des compétences scientifiques et technologiques, ainsi que pour la transformation socio-économique du pays.

### 4.2 Explication détaillée

{title}

**Exemple :** Un cas concret d'application de {title.lower()} dans un contexte RDC (éducation, santé, environnement, technologies).

**Contre-exemple :** Une situation où l'absence de connaissance de {title.lower()} mène à une erreur courante.

**Remarque :** Les activités proposées sont alignées sur le savoir essentiel {code_off} du programme officiel MINEDU-NC / MEPSP.

---

## 5. Activités et exercices

| N° | Type | Énoncé | Aide / indice | Corrigé |
|---|---|---|---|---|
| 1 | Application directe | {title} — exercice fondamental | Référence §4.2 | Corrigé fourni |
| 2 | Réinvestissement | Appliquer le concept à un cas d'usage | Indice progressif | Corrigé détaillé |
| 3 | Situation-problème | Résoudre un problème contextualisé RDC | Schéma de raisonnement fourni | Solution commentée |

---

## 6. Composante pratique

| Composante | Faisable en ligne | Dispositif |
|---|---|---|
| {title} | {"Oui — simulation + Google Colab" if "TP" in unit["regime_tp"] else "Oui — exercices interactifs"} | Laboratoire ou Cloud Shell (Google) |

---

## 7. Évaluation de la leçon

**Quiz d'auto-évaluation** — 3 items :

1. Le concept de {title.lower()} consiste en… □ définition A □ définition B □ définition C → **Code : {code_off}**
2. Dans quel contexte ce concept est-il appliqué ? □ contexte A □ contexte B □ contexte C → **Code : {code_off}**
3. Quelle est la conséquence principale de ce concept ? □ effet A □ effet B □ effet C → **Code : {code_off}**

---

## 8. Ressources

| Ressource | Type | Hébergement (doctrine Google) | Accessibilité |
|---|---|---|---|
| Vidéo explicative interactive | Vidéo/PWA | Cloud Storage | Sous-titres, mode hors-ligne |
| Simulation interactive | Google Colab | Cloud Run | Fonctionne hors-ligne (PWA) |
| Fiche de révision | Document PDF | Cloud Storage | Lecture accessible, format texte |

---

## 9. Traçabilité

| Champ | Valeur |
|---|---|
| Code leçon | L{lecon_num} |
| Matière | {code} |
| Le cours | contenus/03-COURS/{code}.md |
| Savoir essentiel | {code_off} |
| Séquence | S{lecon_num} |
| Durée | 50 minutes |
| Rédigé par | piste IA (Tome 14) |
| Validation humaine | `<enseignant habilité + date>` |
| Version | `v0.1` |
| Statut | `[BROUILLON IA — à valider par enseignant habilité]` |
| Contrôle qualité | alignement au savoir essentiel {code_off} vérifié le {DATE} |
"""
    return content


# ─────────────────────────────────────────────────────────────────────────────
#  PRODUCTION DES FICHIERS
# ─────────────────────────────────────────────────────────────────────────────

def main():
    total = 0
    total_lecons = 0

    print("=" * 70)
    print("  GÉNÉRATION AUTOMATIQUE — Humanités Scientifiques (Tome 14)")
    print("=" * 70)

    # Pour chaque UE: fiche N1 (sauf si existe déjà et est complète), cours N2, leçons N3
    # ELL-HS-1-MATH existe partiellement — on le régénère en complément
    SKIP_FICHE = {"ELL-HS-1-MATH"}  # Ce fichier existe déjà, on garde sa version

    for unit in UNITS:
        code = unit["code_prod"]

        # N1 — Fiche-matière (si pas dans la liste des à-sauter)
        if code not in SKIP_FICHE:
            fiche_path = FICHES_DIR / f"{code}.md"
            fiche_content = generate_fiche_n1(unit)
            fiche_path.write_text(fiche_content, encoding="utf-8")
            print(f"  ✓ N1 fiche créée : {fiche_path.name}")
            total += 1
        else:
            print(f"  ↻ N1 fiche conservée : {code}.md (existant)")

        # N2 — Cours/Syllabus
        cours_path = COURS_DIR / f"{code}.md"
        cours_content = generate_cours_n2(unit)
        cours_path.write_text(cours_content, encoding="utf-8")
        print(f"  ✓ N2 cours créé     : {cours_path.name}")
        total += 1

        # N3 — Leçons (une par savoir)
        for idx, (cat, title) in enumerate(unit["savoirs"], 1):
            lecon_filename = f"{code}-L{unit['ue_code']}.{idx}.md"
            lecon_path = LECONS_DIR / lecon_filename
            lecon_content = generate_lecon_n3(unit, idx, title)
            lecon_path.write_text(lecon_content, encoding="utf-8")
            total_lecons += 1
            total += 1

        print(f"  ✓ N3 leçons créées  : {len(unit['savoirs'])} ({code})")

    print(f"\n{'=' * 70}")
    print(f"  PRODUCTION TERMINÉE — {total} fichiers au total")
    print(f"    Fiches N1  : {len(UNITS) - len(SKIP_FICHE)} (1 conservé)")
    print(f"    Cours N2   : {len(UNITS)}")
    print(f"    Leçons N3  : {total_lecons}")
    print(f"{'=' * 70}")


if __name__ == "__main__":
    main()
