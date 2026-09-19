# CONTENUS — Guide de production des matières enseignées

> Point d'entrée de la production pédagogique d'ELLYSIUM.
> **Cadre obligatoire :** `00-CADRE-LEGAL-ET-SOURCES.md` · **Plan directeur :** `../docs/PLAN-REDACTION-MATIERES.md`

---

## 1. Ce que contient ce répertoire

| Dossier | Niveau | Contenu | Producteur |
|---|---|---|---|
| `01-REFERENTIELS/` | **N0** | Registre des documents officiels (117 recensés) | État + veille humaine |
| `02-FICHES-MATIERES/` | **N1** | Identité de chaque matière (source, savoirs essentiels, volumes, TP) | IA |
| `03-SYLLABUS/` | **N2** | Progression annuelle : modules → séquences → leçons | IA → validation humaine |
| `04-LECONS/` | **N3** | Leçons complètes | IA → validation enseignant |
| `05-EVALUATIONS/` | **N4** | Interrogations, devoirs, examens | IA → validation |
| `_templates/` | — | Les 4 modèles à copier | — |
| `_tableaux-de-bord/` | — | Avancement et alertes | — |

---

## 2. Comment produire un contenu (procédure)

1. **Vérifier la source (N0).** La matière doit être à l'état ✅ dans `01-REFERENTIELS/_registre-sources.md`. Sinon : `⚠️ SOURCE À OBTENIR` — **on ne produit pas.**
2. **Créer la fiche-matière (N1)** à partir de `_templates/TEMPLATE-N1-FICHE-MATIERE.md`, en extrayant les savoirs essentiels **avec leurs codes officiels**.
3. **Créer le syllabus (N2)** à partir de `_templates/TEMPLATE-N2-SYLLABUS.md` : tous les codes officiels de la fiche doivent être couverts.
4. **Faire valider (piste humaine).** 2 enseignants habilités par matière.
5. **Créer les leçons (N3)** — seulement après validation du syllabus.
6. **Contrôler** : `bash tools/verify-contenus.sh` doit être au vert.

---

## 3. Les règles qui protègent le projet

| Règle | Pourquoi |
|---|---|
| **Aucune donnée officielle inventée** | L'intitulé, le volume horaire et le maximum viennent du ministère, jamais d'une estimation. En cas d'absence : `⚠️ À CERTIFIER`. |
| **Aucun contenu sans source** | Un contenu non adossé est indéfendable devant l'État et devant les familles. |
| **Traçabilité totale** | Chaque document cite son PDF source, son émetteur, son édition et son copyright. |
| **Marquage `[BROUILLON IA]`** | Un contenu généré n'est jamais présenté comme validé. |
| **Composante pratique déclarée** | Un TP, un atelier ou un stage ne s'enseignent pas derrière un écran : on le dit explicitement (régimes R1/R2/R3). |
| **Google uniquement** | Constitution Art. 1 bis : aucune ressource tierce. |

---

## 4. Codes de production

Format : `ELL-<cycle>-<année>-<discipline>`

| Segment | Valeurs |
|---|---|
| cycle | `CEB` (cycle terminal ÉB, 7-8) · `HS` (humanités scientifiques) · `HT` (techniques) · `HG` (générales/pédagogiques) · `HP` (professionnelles) |
| année | `7` · `8` · `1` … `4` |
| discipline | `MATH` · `SVT` · `SPTTIC` · `FR` · `ANG` · `HIST` · `GEO` · `ECM` · `INFO` · etc. |

**Exemple :** `ELL-CEB-7-MATH` = cycle terminal ÉB, 7ᵉ année, Mathématiques.

---

## 5. Contrôle automatique

```bash
bash tools/verify-contenus.sh
```

Vérifie : chaîne N0→N1→N2, couverture des codes officiels, champs non sourcés, conformité Google, absence de leçon sans syllabus.

---

## 6. Note de transparence

Ce répertoire est construit selon une règle unique : **ce qui est su est écrit, ce qui n'est pas su est signalé**. Les mentions `⚠️` n'y sont pas des défauts — elles sont la preuve que rien n'a été inventé.

Le syllabus et les leçons **n'existent pas dans le système éducatif congolais** : ce sont des créations ELLYSIUM, rendues possibles parce qu'elles sont strictement contraintes par les programmes officiels de l'État.
