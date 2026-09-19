# -*- coding: utf-8 -*-
import os

DIST_DIR = "/home/adolphe/CNEL -ELYSIUM/clenel-elysium/apps/web-portal/dist"
os.makedirs(DIST_DIR, exist_ok=True)

def render_page(meta):
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0B2545">
    <title>{meta['title']} — ELLYSIUM (RDC)</title>
    <meta name="description" content="{meta['lead'][:160]}">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="top-regal-bar">
        <span>🇨🇩 RÉPUBLIQUE DÉMOCRATIQUE DU CONGO · SOUVERAINETÉ PÉDAGOGIQUE NATIONALE</span>
        <span>PLATEFORME NATIONALE ELLYSIUM · GOOGLE CLOUD AFRICA-SOUTH1 · SCELLÉ KMS HSM</span>
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
                <li><a href="index.html" {'class="active"' if meta['fn']=='index.html' else ''}>Accueil</a></li>
                <li><a href="etablissements.html" {'class="active"' if meta['fn']=='etablissements.html' else ''}>Écoles & PGI</a></li>
                <li><a href="bulletin-securise.html" {'class="active"' if meta['fn']=='bulletin-securise.html' else ''}>Bulletins Scellés</a></li>
                <li><a href="parents.html" {'class="active"' if meta['fn']=='parents.html' else ''}>Parents</a></li>
                <li><a href="ead-universite.html" {'class="active"' if meta['fn']=='ead-universite.html' else ''}>Université LMD</a></li>
                <li><a href="souverainete-cloud.html" {'class="active"' if meta['fn']=='souverainete-cloud.html' else ''}>Souveraineté</a></li>
                <li><a href="verification-diplomes.html" class="nav-cta">🔍 Vérifier un Diplôme</a></li>
            </ul>
        </div>
    </header>

    <section class="hero-page">
        <div class="hero-content">
            <div class="page-badge">{meta['badge']}</div>
            <h1>{meta['h1']}</h1>
            <p class="hero-lead">{meta['lead']}</p>
            <div class="hero-actions">
                <a href="{meta['btn_p_url']}" class="btn btn-gold">{meta['btn_p_text']}</a>
                <a href="{meta['btn_s_url']}" class="btn btn-outline">{meta['btn_s_text']}</a>
            </div>
            <div class="trust-badges">
                <span class="trust-badge-item">🛡️ Conforme EPST & ESU</span>
                <span class="trust-badge-item">🔒 Verrou Constitutionnel Art. 5</span>
                <span class="trust-badge-item">⚡ 240k Opérations / Seconde</span>
                <span class="trust-badge-item">📴 72h Autonomie Hors-Ligne</span>
            </div>
        </div>
    </section>

    <main class="section-wrap">
        <!-- 1. Synthèse Institutionnelle -->
        <div class="section-head">
            <span class="section-tag">{meta['tag']}</span>
            <h2>{meta['section2_title']}</h2>
            <p>{meta['section2_desc']}</p>
        </div>

        <!-- 2. Cartes de Fonctionnalités Approfondies -->
        <div class="grid-3">
            {meta['cards_html']}
        </div>

        <!-- 3. Workflow Opérationnel Étape par Étape -->
        <div style="margin-top: 60px;">
            <div class="section-head">
                <span class="section-tag">Processus & Déroulement</span>
                <h2>Comment le dispositif fonctionne pas-à-pas</h2>
            </div>
            <div class="step-flow">
                {meta['steps_html']}
            </div>
        </div>

        <!-- 4. Tableau Comparatif (Avant vs ELLYSIUM) -->
        <div style="margin-top: 60px;">
            <div class="section-head">
                <span class="section-tag">Comparatif Méthodologique</span>
                <h2>L'Ancien Système Manuel face à la Révolution ELLYSIUM</h2>
            </div>
            <div class="table-wrap">
                <table class="data-table">
                    <thead>
                        <tr><th>Aspect Analysé</th><th>Système Traditionnel (Manuel / Papier)</th><th>Système ELLYSIUM (Souverain & Scellé)</th></tr>
                    </thead>
                    <tbody>
                        {meta['compare_rows_html']}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 5. Étude de Cas / Terrain RDC -->
        <div class="case-study-box">
            <h3>🏛️ Cas d'Usage Terrain : {meta['case_title']}</h3>
            <p>{meta['case_text']}</p>
            <p><strong>Impact mesuré :</strong> {meta['case_impact']}</p>
        </div>

        <!-- 6. Verrous Fonctionnels Associés -->
        <div style="margin: 40px 0; padding: 24px; background: #fff; border-radius: var(--radius-md); border: 1px solid var(--border);">
            <h4 style="color:var(--primary); margin-bottom: 12px;">🛡️ Verrous Fonctionnels Constitutionnels Impliqués</h4>
            <div>{meta['vf_html']}</div>
        </div>

        <!-- 7. FAQ Détaillée -->
        <div class="faq-container">
            <div class="section-head">
                <span class="section-tag">Foire Aux Questions</span>
                <h2>Questions Fréquentes & Éclaircissements</h2>
            </div>
            {meta['faq_html']}
        </div>

        <!-- 8. Bannière Citation Régalien -->
        <div class="regal-quote">
            « {meta['quote']} »
        </div>

        <!-- 9. Appel à l'Action de Fin de Page -->
        <div style="text-align: center; margin-top: 50px;">
            <a href="{meta['btn_p_url']}" class="btn btn-gold" style="font-size: 1.15rem; padding: 16px 36px;">{meta['btn_p_text']}</a>
            <span style="display:block; margin-top:10px; font-size:0.9rem; color:var(--text-muted);">Assistance officielle assurée par la Délégation ELLYSIUM de Kinshasa.</span>
        </div>
    </main>

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

print("Générateur prêt.")
