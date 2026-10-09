# Source images (reference only, not synced to Shopify)

Everything in `source-images/` is outside the theme folders, so the Shopify GitHub sync ignores it. Nothing here is live on the site.

Uploaded Oct 8, 2026 to the wrong branch (`claude/refactor-shopify-hero-section-Qq2kK`, as "Add files via upload"). Copied here, de-duplicated (the `DAY n/` sub-folders were exact copies of the root files), and renamed. The originals remain on that branch. **Upload new images to `claude/alchemia-md-shopify-build-rqmk4u`.**

## Product renders and systems (clean: label art only)

- `product-renders/` UV Shield+, Skinbiotic+, Dermaboost+ front renders (PNG).
- `systems/` Sun Safe, Skin Recovery (file name says "sun recovery"), Sun Resilience and Complete systems (1920x1080, white background) plus `systems.psd`.

## Ingredient slides: 22 "days" x 4 slides, 1122x1402

`ingredient-slides/day-NN-<ingredient>/slide-1..4.png`. Slide 1 introduces the ingredient, 2 is "how it works", 3 is "what the science shows", 4 is "find it in <product>".

| Day | Ingredient |
|---|---|
| 1 | polypodium-leucotomos |
| 2 | niacinamide |
| 3 | egcg |
| 4 | trans-resveratrol |
| 5 | spirulina |
| 6 | akkermansia |
| 7 | l-plantarum |
| 8 | l-rhamnosus |
| 9 | lactobacillus |
| 10 | b-bifidum |
| 11 | agave-inulin |
| 12 | niacinamide |
| 13 | agave-inulin |
| 14 | vitamin |
| 15 | vitamin-c |
| 16 | zinc |
| 17 | quercetin |
| 18 | trans-resveratrol |
| 19 | egcg |
| 20 | spirulina |
| 21 | longvida-curcumin |
| 22 | lactobacillus-rhamnosus |
| 23 | b-lactis (added Oct 9, WebP; the artwork is stamped "DAY 22 / 4" in error) |

### Status: APPROVED for use by the owner (Oct 8, 2026)

The owner confirmed all ingredient slides are usable and approved, so they are wired into the site (see below). The review notes that follow are kept as a record of what the slides contain.

### Review notes (recorded before approval)

Reviewed by eye on Days 1, 6, 7 and 12 only (no OCR available); the same template is used on all days, so assume the issues repeat until each slide is checked. Findings against the build brief:

- **Header on every slide: "90 DAYS TO HEALTHIER, HAPPIER SKIN".** Reads as a 90-day results promise (the brief bans 90-day transformation wording and ties 90-day language to the FTC review).
- **Day 1, Polypodium "How it works"**: "before and during UV exposure" timing, "reduces photodamage formation", cyclobutane pyrimidine dimer wording. The brief says no before/during/after-sun graphics and no DNA-damage or repair claims.
- **Day 1, "What the science shows"**: lists "Adjunctive support in photosensitive and pigmentary concerns" with vitiligo and melasma, minimal erythema dose, "COX-2 and PGE2 signaling", and credits "research supplied by Alchemia MD". Disease claims and sunburn-threshold claims are not allowed; research must be Tier 1 public citations only.
- **Day 7 and Day 12**: product-style outcome claims ("helps strengthen the skin barrier", "supports ceramide production", "balances microbial ecology", "supports calmer-looking skin") that need counsel sign-off before use.
- Day 6 (Akkermansia) is the mildest but still makes ecology and "healthy gut barrier" statements.

Usable once reviewed: the title slide (1) and "find it in <product>" slide (4) of each day, if the 90-day header is removed and the product line matches the label. Wired into the theme: see "Slides in the theme" below.

### Slides in the theme

All 88 slides are optimized (WebP, 1122x1402) as theme assets named `slide-dNN-K.webp` (NN = day, K = slide 1 to 4). The PNG originals stay in this folder.

- **Science page:** each ingredient research card shows its slide set as a 4-slide gallery (`slide_set`, e.g. `d02`). Sets used: UV Shield+ d01 to d05; Skinbiotic+ d11, d07, d08, d06; Dermaboost+ d21, d15, d16, d14, d17. Astaxanthin has no slides yet (placeholder frame).
- **Product pages and the Science ingredient library:** each ingredient card uses its title slide automatically (`snippets/ingredient-slide-asset.liquid` maps ingredient to day). An image set on the Ingredient entry in Shopify overrides it.
- **Not yet used (no card for them):** B. lactis, olive leaf, astaxanthin and the probiotic blend have no slides; days 9, 13, 18, 19, 20 and 22 are alternates of days 8, 11, 4, 3, 5 and 8 and are available as swaps.
