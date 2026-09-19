# -*- coding: utf-8 -*-
import os

OUTPUT_DIR = "/home/adolphe/CNEL -ELYSIUM/clenel-elysium/apps/web-portal/dist"
os.makedirs(OUTPUT_DIR, exist_ok=True)

from generate_enriched_pages_data import ALL_ENRICHED_PAGES

print(f"Chargement de {len(ALL_ENRICHED_PAGES)} pages enrichies...")

for p in ALL_ENRICHED_PAGES:
    fn = p["filename"]
    fp = os.path.join(OUTPUT_DIR, fn)
    with open(fp, "w", encoding="utf-8") as f:
        f.write(p["html"])
    print(f"✓ Généré avec succès : {fn} ({len(p['html'])} octets)")

print("\n🎉 Toutes les pages enrichies de niveau présidentiel/gouvernemental ont été compilées !")
