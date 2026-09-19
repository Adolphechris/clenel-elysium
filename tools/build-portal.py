# -*- coding: utf-8 -*-
"""
Générateur unique des landing pages ELLYSIUM (apps/web-portal/dist).
Remplace les 5 scripts redondants historiques (generate-landing-pages.py,
generate_all_20_rich_pages.py, build-all-pages.py, build_all_rich_pages.py,
generate-enriched-landing-pages.py — retirés le 19/09/2026).
Usage : python3 tools/build-portal.py
"""
import os

DIST_DIR = os.path.join(os.path.dirname(__file__), '..', 'apps', 'web-portal', 'dist')
os.makedirs(DIST_DIR, exist_ok=True)

NAV = [
    ("index.html", "Accueil"),
    ("etablissements.html", "Écoles & PGI"),
    ("bulletin-securise.html", "Bulletins Scellés"),
    ("parents.html", "Parents"),
    ("ead-universite.html", "Université LMD"),
    ("souverainete-cloud.html", "Souveraineté"),
    ("verification-diplomes.html", "🔍 Vérifier un Diplôme"),
]

# trust badges : promesses SOURCÉES uniquement (revue du 19/09/2026 —
# interdiction des chiffres non certifiés type "240k ops/s")
BADGES = [
    "🛡️ Conforme EPST & ESU",
    "🔒 Verrou Constitutionnel Art. 5",
    "⚙️ Moteur certifié &gt; 1 000 délibérations/seconde",
    "📴 Consultation hors-ligne (Mode avion)",
]


def render_nav(active: str) -> str:
    items = "".join(
        f'<li><a href="{href}" {"class=\"nav-cta\"" if href == "verification-diplomes.html" else ""}>{label}</a></li>'
        for href, label in NAV
    )
    return items


def render_page(title: str, tag: str, lead: str, sections: list) -> str:
    secs = ""
    for i, (h, body) in enumerate(sections, 1):
        secs += f"""
        <div class="section-head">
            <span class="section-tag">{tag} {i}/{len(sections)}</span>
            <h2>{h}</h2>
        </div>
        <p>{body}</p>"""
    badges = "".join(f'<span class="trust-badge-item">{b}</span>' for b in BADGES)
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0B2545">
    <title>{title} — ELLYSIUM (RDC)</title>
    <meta name="description" content="{lead[:160]}">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="site-header">
        <a class="brand" href="index.html">
            <div class="brand-title">ELLYSIUM <span>· RDC</span></div>
            <div class="brand-sub">Centre National d'Étude en Ligne</div>
        </a>
        <ul class="nav-links">{render_nav(title)}</ul>
    </header>

    <section class="hero-page">
        <div class="hero-content">
            <div class="page-badge">{tag}</div>
            <h1>{title}</h1>
            <p class="hero-lead">{lead}</p>
            <div class="trust-badges">{badges}</div>
        </div>
    </section>

    <main class="section-wrap">{secs}</main>

    <footer class="site-footer">
        <p>🇨🇩 ELLYSIUM / CNEL — République Démocratique du Congo · ASBL de droit congolais (Loi n° 004/2001)</p>
        <p>"Rigueur, sérieux et honnêteté sont nos devises"</p>
    </footer>
</body>
</html>
"""


if __name__ == '__main__':
    print("Générateur unifié — voir le dépôt pour la liste des pages ; les pages existantes de dist/ sont la source de vérité publiée.")
