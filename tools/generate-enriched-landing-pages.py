# -*- coding: utf-8 -*-
import os

OUTPUT_DIR = "/home/adolphe/CNEL -ELYSIUM/clenel-elysium/apps/web-portal/dist"
os.makedirs(OUTPUT_DIR, exist_ok=True)

COMMON_HEADER = """<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0B2545">
    <title>{title}</title>
    <meta name="description" content="{meta_desc}">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="top-regal-bar">
        <span>🇨🇩 RÉPUBLIQUE DÉMOCRATIQUE DU CONGO · SOUVERAINETÉ PÉDAGOGIQUE NATIONALE</span>
        <span>PLATEFORME NATIONALE ELLYSIUM · HÉBERGEMENT GOOGLE CLOUD · SCELLÉ KMS HSM</span>
    </div>

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
                <li><a href="bulletin-securise.html" {active_bulletin}>Bulletins Scellés</a></li>
                <li><a href="parents.html" {active_parents}>Parents</a></li>
                <li><a href="ead-universite.html" {active_univ}>Université LMD</a></li>
                <li><a href="souverainete-cloud.html" {active_cloud}>Souveraineté</a></li>
                <li><a href="verification-diplomes.html" class="nav-cta">🔍 Vérifier un Diplôme</a></li>
            </ul>
        </div>
    </header>
"""

COMMON_FOOTER = """
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-col">
                <div class="brand-title" style="color:#fff;margin-bottom:12px;">ELLYSIUM <span>· RDC</span></div>
                <p style="font-size:0.9rem;line-height:1.6;margin-bottom:16px;">
                    Système national intégré de gestion scolaire, registre souverain des titres académiques et université d'excellence en ligne pour la République Démocratique du Congo.
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
                    <li><a href="gouvernance-asbl.html">Gouvernance & Statuts ASBL</a></li>
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

# Importation ou écriture des 20 pages complètes enrichies
print("Début de la génération enrichie des 20 pages...")
