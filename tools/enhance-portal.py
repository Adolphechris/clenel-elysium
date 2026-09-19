# -*- coding: utf-8 -*-
"""
enhance-portal.py — Professionnalisation des landing pages ELLYSIUM (19/09/2026)
Applique aux 20 pages de apps/web-portal/dist :
  1. SEO/social : Open Graph + Twitter Card + canonical + meta description régénérée
  2. Favicon SVG (monogramme E) + police Inter (Google Fonts, Art. 1 bis)
  3. Accessibilité : skip-link, aria-label de navigation, focus visible (via portal-v2.css)
  4. Icônes : remplacement des emojis par des SVG vectoriels cohérents
  5. Navigation mobile : bouton menu + script minimal
  6. Footer : suppression des styles inline
  7. JSON-LD (index uniquement)
Idempotent : peut être relancé sans dupliquer les injections.
"""
import glob
import html as html_mod
import pathlib
import re

DIST = pathlib.Path('apps/web-portal/dist')
BASE = 'https://cnel-elysium-rdc.web.app'

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Crect width='64' height='64' rx='12' fill='%230B2545'/%3E"
           "%3Ctext x='32' y='45' font-family='Georgia,serif' font-size='38' font-weight='700' "
           "fill='%23D4AF37' text-anchor='middle'%3EE%3C/text%3E%3C/svg%3E")

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">')


def svg(body: str) -> str:
    return ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>')


ICONS = {
    '🔒': '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    '🏛️': '<path d="M3 21h18M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17M9 8h2m2 0h2M9 12h2m2 0h2M10 21v-4h4v4"/>',
    '🌍': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><ellipse cx="12" cy="12" rx="4" ry="9"/>',
    '📱': '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    '⚖️': '<path d="M12 3v18M8 21h8M4 7h16"/><path d="M6.5 7L4 13h5zM17.5 7L15 13h5z"/>',
    '🛡️': '<path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/>',
    '🛑': '<path d="M7 3h10l4 4v10l-4 4H7l-4-4V7z"/><path d="M9 9l6 6M15 9l-6 6"/>',
    '🚫': '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
    '🔄': '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>',
    '📴': '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/>',
    '📩': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    '📝': '<path d="M17 3a2.8 2.8 0 0 1 4 4L8 20l-5 1 1-5z"/>',
    '📋': '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6"/>',
    '📅': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4m8-4v4"/>',
    '💾': '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>',
    '💳': '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    '🎓': '<path d="M22 9L12 4 2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/>',
    '⚡': '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
    '🧮': '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 6h6M8 10h8M8 14h8M8 18h8"/>',
    '🧾': '<path d="M6 2h12v21l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
}

MENU_JS = """<script>
    (function () {
      var b = document.querySelector('.menu-toggle');
      var n = document.querySelector('.nav-links');
      if (b && n) {
        b.addEventListener('click', function () {
          var open = document.body.classList.toggle('nav-open');
          b.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      }
    })();
  </script>
"""

JSON_LD = """<script type="application/ld+json">
    {"@context":"https://schema.org","@type":"EducationalOrganization",
     "name":"ELLYSIUM — Centre National d'Étude en Ligne (CNEL)",
     "alternateName":"CNEL",
     "url":"https://cnel-elysium-rdc.web.app/",
     "areaServed":"République Démocratique du Congo",
     "slogan":"Rigueur, sérieux et honnêteté sont nos devises",
     "nonprofitStatus":"NonprofitType"}
  </script>
"""


def clean_text(s: str) -> str:
    s = re.sub(r'<[^>]+>', '', s)
    s = html_mod.unescape(s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s


def head_upgrade(t: str, name: str) -> str:
    if 'og:title' in t:
        return t  # idempotent
    title = re.search(r'<title>(.*?)</title>', t).group(1)
    m = re.search(r'<p class="hero-lead">(.*?)</p>', t, re.S)
    desc = clean_text(m.group(1))[:155] if m else title
    url = BASE + ('/' if name == 'index.html' else '/' + name)
    og = f'''    <link rel="canonical" href="{url}">
    <meta property="og:title" content="{html_mod.escape(title)}">
    <meta property="og:description" content="{html_mod.escape(desc)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{url}">
    <meta property="og:site_name" content="ELLYSIUM — CNEL">
    <meta property="og:locale" content="fr_CD">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="{html_mod.escape(title)}">
    <meta name="twitter:description" content="{html_mod.escape(desc)}">
'''
    t = re.sub(r'<meta name="description" content="[^"]*">',
               f'<meta name="description" content="{html_mod.escape(desc)}">', t, count=1)
    inject = f'    <link rel="icon" type="image/svg+xml" href="{FAVICON}">\n' \
             f'    {FONTS}\n{og}'
    if name == 'index.html':
        inject += '    ' + JSON_LD
    return t.replace('</head>', inject + '</head>', 1)


def body_upgrade(t: str) -> str:
    # Skip-link + cible du contenu
    t = t.replace('<body>', '<body>\n    <a class="skip-link" href="#main-content">Aller au contenu</a>', 1)
    t = t.replace('<main class="section-wrap">', '<main id="main-content" class="section-wrap">', 1)

    # Navigation : aria-label + bouton mobile
    t = t.replace('<ul class="nav-links">',
                  '<ul class="nav-links" aria-label="Navigation principale">', 1)
    t = re.sub(r'(</ul>\s*</div>\s*</header>)',
               '            <button class="menu-toggle" aria-expanded="false" '
               'aria-controls="primary-nav" aria-label="Ouvrir le menu">'
               + svg('<path d="M4 6h16M4 12h16M4 18h16"/>') + '</button>\n' + r'\1',
               t, count=1)
    t = t.replace('<ul class="nav-links" aria-label="Navigation principale">',
                  '<ul class="nav-links" id="primary-nav" aria-label="Navigation principale">', 1)

    # Icônes : emoji -> SVG vectoriel
    for emoji, body in ICONS.items():
        t = t.replace(f'<div class="card-icon">{emoji}</div>',
                      f'<div class="card-icon">{svg(body)}</div>')
        no_vs = emoji[:-1] if emoji.endswith('\ufe0f') else emoji
        if no_vs != emoji:
            t = t.replace(f'<div class="card-icon">{no_vs}</div>',
                          f'<div class="card-icon">{svg(body)}</div>')

    # Footer : suppression des styles inline, classes dédiées
    def clean_footer(m: 're.Match[str]') -> str:
        block = m.group(0)
        block = block.replace('<div style="display:flex;gap:20px;">', '<div class="footer-links">')
        block = re.sub(r' style="[^"]*"', '', block)
        block = block.replace('href="verification-diplomes.html"',
                              'class="footer-link-gold" href="verification-diplomes.html"', 1)
        return block
    t = re.sub(r'<footer class="site-footer">[\s\S]*?</footer>', clean_footer, t, count=1)

    # Script de menu (une seule fois)
    if 'menu-toggle' in t and 'nav-open' not in t:
        t = t.replace('</body>', MENU_JS + '</body>', 1)
    return t


def main() -> None:
    changed = 0
    for f in sorted(DIST.glob('*.html')):
        t = f.read_text(encoding='utf-8')
        t2 = head_upgrade(t, f.name)
        t2 = body_upgrade(t2)
        if t2 != t:
            f.write_text(t2, encoding='utf-8')
            changed += 1
    css = DIST / 'styles.css'
    css_text = css.read_text(encoding='utf-8')
    if 'ELLYSIUM — Couche design v2' not in css_text:
        css.write_text(css_text + '\n\n' +
                       pathlib.Path('tools/portal-v2.css').read_text(encoding='utf-8'),
                       encoding='utf-8')
    print(f'Pages ameliorees : {changed}')
    rest = sum(1 for f in DIST.glob('*.html')
               if re.search(r'class="card-icon">[^<]*[\U0001F300-\U0001FAFF]',
                            f.read_text(encoding='utf-8')))
    print(f'Pages avec emojis d_icones restants : {rest}')


if __name__ == '__main__':
    main()
