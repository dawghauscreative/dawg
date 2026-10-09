# Alchemia MD Shopify theme (clean Online Store 2.0 rebuild)

Build target Nov 1, 2026. Launch Jan 1, 2027. Store: alchemiamd. **Never publish from here. Reyshan publishes after sign-off.**

## Deploy to an unpublished theme

No theme was created in the store by this build. Either connect this branch with Shopify's GitHub integration or run
`shopify theme push --unpublished --store alchemiamd`. Then, in the theme editor:

1. App embeds: turn **Supr Bundles & Subscriptions** ON and save (it is off on the live theme).
2. Add the optional "Subscriptions + Bundles" app block inside the **Buy buttons** area of the product hero if exact placement is wanted. It renders inside the `/cart/add` form.
3. Upload the logo only if overriding the bundled white logotype (Theme settings > Brand & contact).

## Design tokens and type (Brand Guidelines V1 wins over the brief)

Colours (Blueprint V2, Oct 2026): Black `#141414`, Gold `#C9A96E`, Evergreen `#1A2E1F`, Beige `#F5F0E8` (primary light surface and text on dark), plus Charcoal `#212121` for cards and a warm secondary beige `#EDE3D2`. All are Theme settings. Brand Guidelines V1 colours are retired.
Schemes per section: Black, Evergreen, Beige (light), warm Beige. Body copy on dark is Beige at 80%.
Type (Blueprint V2): headlines **Cormorant Garamond** (Google Fonts, weight setting default 500), body and callouts **BC Novatica CYR** (Adobe kit `qza3lbn`, 400/700). Dejanire Text and Roboto are retired.
Fonts follow Blueprint V2 (see Colours and type above).

## Buy box rules (Supr owns it)

- `sections/pdp-main.liquid` posts a plain HTML form to `/cart/add`. No JS add-to-cart, no hand-built payload, no `selling_plan` input, no quantity input, no dynamic checkout.
- Sticky bar is a scroll-to-buy-box link ("Choose your plan"), never an add-to-cart.
- Cards (home, collection, search, cross-sell) link to the product page and have no add-to-cart.
- **One default variant per product. No "Supply" variants** (Shopify stock is tracked per variant, so a 3-Month variant would not deduct real bottle counts).
- The four purchase options are configured by Reyshan in the Supr dashboard, not in the theme: Monthly Subscription (default, qty 1, selling plan), 3-Month Subscription (Supr 90-day plan, "+5% 3-Month Bonus" badge, pending Supr confirmation), One-Time 3-Month Supply (same variant, qty 3, no selling plan, price from an automatic Shopify quantity discount to be created after final pricing), One-Time Single Supply (qty 1, no selling plan). The theme only keeps the widget inside the `/cart/add` form with the app embed ON.
- Until the quantity discount exists, `show_three_month_placeholder` (Theme settings > Product pages, default ON) shows a clearly marked placeholder under the buy box. Turn it OFF when the discount is live. Prices are provisional; none are hard-coded.
- Prices are read from Shopify data. Nothing is hard-coded: no prices, percentages, savings or variant IDs.
- The base price block (`show_base_price`) is OFF by default because Supr's widget shows pricing.

## Switches (Theme settings)

| Setting | Default | Notes |
|---|---|---|
| `show_guarantee` | OFF | All guarantee output goes through `snippets/guarantee-badge.liquid`. No guarantee wording exists. |
| `show_renewal_timeline` | ON | Copy approved by the owner. Expectation line and FAQ answer are empty until the approved wording is pasted in. |
| `compliance_slots_enabled` | ON | Slots render only when they have content. Bundle 2 notice and Skinbiotic+ caution are empty and undecided. |
| `fda_disclaimer_text` | label wording | Taken from the printed labels. Reyshan/counsel to confirm. |
| `melanoma_line_text` | label wording | Verified on all three product labels. No amounts shown. |
| Video `show_placeholder` (aspect 16:9 default, 9:16 optional) | ON | Neutral frame on home and all 7 product pages. Add a video or switch off before launch. |

## Copy and image sources

Copy that is filled in comes only from Brand Guidelines V1 (founder story, mission, purpose, value proposition, transparency/integrity values, sunscreen and dermatologist FAQ answers) and the printed labels (taglines, directions, FDA statement, "Dermatologist developed", melanoma line). **Counsel review pending** on all of it, especially the founder story's melanoma reference. Benefits, definitions, ingredients, gluten-free and system-vs-single answers stay empty: the internal benefits guide says consumer claims need legal clearance first.
Images: theme assets provide defaults (hero banner, lifestyle strip, founder portrait, and a lifestyle render per product used only when a product has no media). The editor's image pickers override all of them. Logo: bundled transparent white logotype and Gray favicon per the guide.

## Product data (created through the Shopify connector)

Metafields `custom.tagline, definition, benefits, ingredients, how_it_works, bundle_components, crosssell_products, compliance_slot, tier1_citations` and the `ingredient` metaobject exist.
Filled from printed labels / brief: taglines and directions on the 3 singles, bundle components, cross-sell. Everything else is empty until approved copy exists.
Not in the brief's metafield list: `custom.tier1_citations` (the brief refers to it in section 5). Added.

## Known gaps (see the build notes for owners)

- Products keep their single "Default Title" variant by decision (see Buy box rules). Do not add Supply variants.
- Navigation is built from the fixed product handles, so no menu needs creating. Footer legal links point at the store policies (`/policies/terms-of-service`, `privacy-policy`, `refund-policy`) plus draft pages `/pages/shipping`, `/pages/subscription-terms`, `/pages/sms-terms` (unpublished, empty, `page.legal` template: publish once counsel supplies text) and `/pages/data-sharing-opt-out`.
- Reviews: Judge.me is skipped for now (no reviews yet; post-launch). The Reviews section renders nothing until an app block is added.
- Old HOME, SYSTEM, ABOUT and "Copy of HOME" pages are left untouched. Reyshan removes them after the new theme is live and nothing links to them.
- No 301 redirects needed: the site has never been live.
- Customer account templates are not included (new customer accounts assumed). A branded password page is included (`layout/password.liquid`, `templates/password.json`).

## Copy check (docs/check-banned.sh)

Run `docs/check-banned.sh . ~/.alchemia-private-banned.txt` before handoff. Reyshan creates the private manufacturer-name list herself, outside the repo; the manufacturer name never goes in the repo; `docs/private-banned.TEMPLATE.txt` shows the format.
BLOCK hits that remain by design are code identifiers and editor-only labels for the hidden offer (`show_guarantee`, `guarantee-badge`, `guarantee_*` settings). They never render while the switch is off. Add them to `ALLOW` in the script if a clean exit code is wanted.
REVIEW hits to keep checking by hand: the label-verified melanoma line, the founder story, "board-certified".

## Finish layer (ported from the original theme)

Rebuilt on brand tokens, not copied: scroll fade-up reveal (off for reduced motion and in the editor), header blur/shadow and hide-on-scroll-down, underline-grow nav links, framed product cards with hover zoom and role badges, bundle panel, trust strip, overlay-label lifestyle tiles, full-bleed founder split, black-to-Emerald bands with gold hairlines, gold newsletter band in the footer, numbered bundle steps.
Home flow: hero, trust strip, product system + bundle panel, statement, problem, solution, 16:9 reel, lifestyle, founder, science, mission band, closing CTA.
Media comes from the store's own Files via `shopify://shop_images/...` and `shopify://files/videos/...` (golf, tennis, sailing and beach photos; the `hf_20260503_005659...mp4` reel). Bundled theme assets are the fallback if a file reference does not resolve.
Not carried over on purpose: "Natural" and "Gluten-free" (unverified), outcome wording such as "Protection for every round", the percentage-of-proceeds line and the "save up to 20%" cart note (figures), the sunscreen Q&As that tripped the block list, the cart drawer and quick add (Supr owns the buy box).
`headline_weight` (Theme settings > Typography) switches headlines between Regular and Semibold/Bold.

## Content layer (all copy needs counsel review before publishing)

Sources: Blueprint V2 (home, systems, FAQ, science, founder structure), printed labels (Supplement Facts amounts, taglines, directions, caution), the products' own Shopify descriptions. The internal research PDF was NOT used for consumer copy (it carries disease-specific and outcome language). No figures, no Tier 2 links, no manufacturer name.

Store data written through the connector (editable in Shopify admin, not in the theme):
- 20 `ingredient` metaobjects (name, amount per label, role, short descriptive line) attached to UV Shield+, Skinbiotic+ and Dermaboost+ via `custom.ingredients`. The definition gained an `amount` field.
- `custom.definition` and `custom.benefits` on all 7 products; new `custom.summary` (card line) on all 7; SEO title/description on all 7; Systems / Individual Products / All Products collection descriptions (the "Bundles" collection is now titled "Systems", handle unchanged).

Theme: new `pdp-description` section renders each product's Shopify description (intro text plus a Supplement Facts panel; internal HTML comments are stripped so notes never reach page source), `ingredient-library` section for the Science page, ingredient amounts on cards, card summary line, 4-up "Systems" row on the home page, product FAQs on all 7 PDPs, FAQ page grouped by topic, Science page sections 1-7, founder path.

Open items found while writing content (decide before launch):
1. Skinbiotic+ description states "30 billion CFU". Decision (Oct 2026): leave it as is. Note the printed label Supplement Facts shows a 215 mg blend with no CFU line.
2. The immunosuppressant physician-guidance caution (internal notes 8.2 and 8.5 in some product descriptions) is deliberately LEFT OFF by decision (Oct 2026). The notes themselves are stripped from page source by the theme.
3. "Clinical evidence" is a card title on the home page (from the blueprint). Counsel to confirm wording.
4. Not built (no approved articles or images): home "Education" guide row, blog articles, Life-in-the-Sun tiles for running, cycling and travel, Tier 1 citations, FAQ categories for Subscriptions billing and Shipping.
5. Palette and fonts now follow Blueprint V2 by decision.

## Placeholders (Oct 2026)

- Image slots with no image show a hatched placeholder frame (no text). Home lifestyle strip has Running, Cycling and Travel placeholders awaiting images; Education cards have image placeholders.
- Education: blog renamed "Education" (handle `news`). One published article (What Is Internal Skin Defense?) plus four UNPUBLISHED draft placeholders (gut-skin connection, daily sun exposure, skin renewal, antioxidants). Home Education row shows "Coming soon" for any card without a link; paste the article URL into the card once published.
- Product gallery images already in Shopify include infographics (UV-stress timeline, layered protection, before/during/after the sun, "what the science supports"). Blueprint V2 says do not use the before/during/after infographic and UV Shield+ infographics only after clearance. Counsel to review before launch; remove from product media if not cleared.
- Founder story: source draft in `docs/source/` (docx and md). The founder page uses adapted wording; the md file lists what was changed and why.

## Science page (Oct 2026, from the Science Page Blueprint)

15 sections: hero (built-in SVG cell graphic, optional image), evidence standard, four foundations, UV Shield+/Skinbiotic+/Dermaboost+ science, system map (SVG diagram), research spotlight, evidence table, "good science has boundaries", sunscreen statement, searchable research library, formulation philosophy, Dr. Mia, final CTA, compliance notice. SEO title and meta description are set on the page (`global.title_tag`, `global.description_tag`).

Research lives in the `research_study` metaobject (Content > Metaobjects). Only entries ticked **Approved for public display** appear anywhere (cards, spotlight, library). Fields: title, authors, journal, year, study type, topic, formula, filter categories, evidence level, summary, PubMed URL, DOI, featured, approved, **citation checked**.

Decisions and flags:
- The blueprint's PubMed links carried `?utm_source=chatgpt.com` tracking; stripped. PubMed was unreachable from the build environment, so only 5 of 17 IDs were confirmed against their titles (`citation checked` ticked: 15583582, 41838346, 41182568, 41488277, 34578794). The rest, including every author name, must be checked by a person before launch. Authors/journals that could not be confirmed were left blank rather than guessed (the blueprint's "Chiu AE" for 19469799 looked wrong, so no author is shown).
- Held back (Approved = OFF): the two studies whose titles name DNA damage (41838346, 41182568), because the brief says no DNA-repair claims until cleared; and three entries whose titles were not supplied (41516240, 40487425, 26482244). Flip the checkbox to publish. The 2026 spotlight card disappears while its study is held.
- Reworded to pass the copy rules: "Alchemia MD replaces sunscreen" and "oral sunscreen" (banned phrases) became "A supplement can stand in for sunscreen" and "A supplement is not sun protection"; "clinically tested" and "treatment" were reworded; UV-response study descriptions drop minimal-erythema figures and doses; the Dr. Mia line is presented as brand copy, not a quotation, until she approves it as authored.
- Ingredient slide images are pre-wired to Shopify Files (uv-shield-2-five-actives, sk09, sk10, dermaboost-2-inside). They were not visible to the build, so each must be reviewed for claims before launch. Empty image slots show a placeholder frame.
- The "ingredient slides" mentioned as added to the repo were not found on the build branch; if they live elsewhere, point to the path or branch.

## Uploaded images (Oct 8, evening)

153 files were uploaded to branch `claude/refactor-shopify-hero-section-Qq2kK`. They are copied (de-duplicated, renamed) to `source-images/` on this branch with a compliance note in `source-images/README.md`. They are NOT in the theme and NOT synced to Shopify. The 22 ingredient-slide sets carry claims that conflicted with the brief (90-day header, before/during-sun timing, DNA-damage and condition wording); the owner then confirmed them as approved and they are wired into the Science page and ingredient cards (see `source-images/README.md`).

## Why product descriptions were missing (fixed)

Shopify rejects a whole JSON template if any `richtext` setting is plain text. The FAQ answers were plain text, so 8 templates silently failed to sync and the draft theme kept the old versions. Always wrap richtext values in `<p>`. Also: Sun Resilience, Skin Recovery and Complete Skin Defense had no template suffix, so they used the generic product template; fixed in the product settings.

## Homepage rebuilt from the Full Homepage Blueprint (Oct 2026)

17 sections in blueprint order: Home hero (Sun Safe System), category statement, problem cards, Protect/Balance/Restore columns, featured Sun Safe System, system finder (four cards using the four system renders), lifestyle (6 tiles), layered protection, science preview, research strip (approved studies only), Dr. Mia, "Balance is a practice" with salt symbol, trust pillars, education (3 guides), email capture, final CTA. Announcement bar and 4-column footer (Shop All added) updated; mobile header is hamburger left, logo centred, cart right.

Decisions to confirm:
- The 16:9 video slot you asked for earlier is kept between the featured system and the finder (not in the blueprint). Delete the "video" section on the home template if unwanted.
- Trust strip (under the hero) and the "Every purchase supports a larger mission" band (before the email sign-up) were restored at the owner's request even though the blueprint omits them.
- Protect/Balance/Restore columns use the label taglines ("Daily support for active, sun-ready skin", "Daily probiotic for gut and skin health", "Daily immune support for calm, balanced skin") by owner decision, not the blueprint's positioning lines.
- Hero image: uses the Sun Safe System product's first media in Shopify (pick another in the section if needed). System finder, featured and final CTA use the clean system renders (`system-*.webp` assets).
- Education cards 2 and 3 show "Coming soon" until their articles are published (drafts exist: "What Is the Gut-Skin Axis?" and "Why Consistency Matters in Skin Health"). Paste the article URL into each card when live.
- Lifestyle: "Running + Cycling" and "Outdoor living" are placeholder frames awaiting photos.
- The blueprint's blog URL `/blogs/education/...` was mapped to the real handle `/blogs/news/...`.

## UV Shield+ product page (blueprint, Oct 9 2026)

`templates/product.uv-shield.json` rebuilt to the UV Shield+ blueprint flow (hero + Supr buy box, definition, why sun-exposed skin needs support, five-active cards, ingredient web, oxidative stress, skin barrier, how to use + routine, renewal timeline, who it is for, sunscreen companion, research preview, what it does not claim, system cross-sell, founder, reviews, FAQ, compliance, final CTA). New reusable sections: `product-actives`, `ingredient-web`, `flow-steps`; extended `pdp-main` (eyebrow, short-description override, benefit bullets, small note, extra gallery graphics), `rich-text` (pull quote), `layer-stack` (intro), `system-finder` (label), `compliance-notice` (extra line).

Notes:
- Tagline stays the label wording ("Daily support for active, sun-ready skin"), not the blueprint's "Outdoor Support for Resilient Skin", per the earlier decision.
- The renewal expectation line and timeline supporting copy are defaults in Theme settings > Your Renewal Timeline.
- The 16:9 video slot stays after the definition (earlier request); the blueprint does not list it.
- Gallery: the five existing product images come first, then the five ingredient title slides (theme assets) are appended via `gallery_assets`. The existing UV Shield+ media includes the "UV-stress timeline" image; the blueprint bars any before/during/after-sun or DNA-repair graphic, so check that image and remove it from the product media in Shopify if it is one.
- The required negation phrases (e.g. "does not replace sunscreen", "not intended to prevent sunburn") are allowlisted in `docs/check-banned.sh`.
- Research links on this page go to `/pages/science#uv-shield` only (no Tier 2 links).

## "How long until I see results?" (Oct 9, 2026)

The answer now lives in Theme settings > Your Renewal Timeline > FAQ answer and appears first in the FAQ on every product page. It explains a full renewal cycle of about 12 weeks (roughly 90 days) matching the Weeks 1-4 / 4-8 / 8-12 timeline, and why: the formulas are multi-ingredient and act through several complementary pathways that build with steady use. It states experiences vary, results are not guaranteed, and the products do not replace sunscreen.

Note: the Synergy Assessment does not state a 90-day figure or any timeline; the 12-week / 90-day framing comes from the approved Renewal Timeline. The Benefits guide mentions 6 to 12 weeks only for UV-induced redness endpoints (and a null 3-month green tea study), which are deliberately not cited.

## Skinbiotic+ product page (blueprint, Oct 9 2026)

`templates/product.skinbiotic.json` rebuilt to the Skinbiotic+ blueprint (23 sections): hero + Supr buy box, definition, video slot, gut-skin axis, synbiotic design, six-component formula cards, formulation logic, microbiome 101, short-chain fatty acids, barrier connection, how to use (label directions word for word), renewal timeline, who it is for (5 cards), what it supports (4), research preview, what the science does not say, system cross-sell, founder, reviews, FAQ (8 + the centralized results answer), compliance, final CTA. SEO set in Shopify (title and description from the blueprint).

New/extended pieces: `split-compare` section (prebiotic + probiotic), `product-actives` (optional `badge`, empty amount hidden), `pdp-main` expectation block (text override), `renewal-timeline` (intro override), `system-finder` (optional per-card compliance line, empty = hidden). The Science page Skinbiotic+ section now has anchor `skinbiotic` (the research CTA and final CTA link to `/pages/science#skinbiotic`).

Decisions and notes:
- Tagline stays the label wording ("Daily probiotic for gut and skin health"), not the blueprint's "Essential Gut Care for Skin Health".
- Amounts are label amounts only: inulin 500 mg; strains show "Part of the 215 mg probiotic blend". No CFU number is printed.
- Bifidobacterium lactis now uses the four slides you added (theme assets `slide-d23-1..4.webp`, originals in `source-images/ingredient-slides/day-23-b-lactis/`). The artwork is stamped "DAY 22 / 4" on all four, which duplicates the L. rhamnosus day; regenerate with the right day number when convenient. Akkermansia carries an "Emerging research" badge.
- The product compliance slot is left empty and hidden. The Skin Recovery System card has an optional compliance line (blank) for when that wording is approved.
- Hero gallery uses the product media already in Shopify (sk01 to sk13). Check the order against the blueprint (jar photos, what's inside, gut-skin axis, barrier, science) and that none of the infographics shows disease imagery.
- Research cards cite only approved studies (Gao 2023, Szanto 2019, Lee HY7714 2015). The audience cards, benefit cards and FAQ answers were written to the label and the approved Skinbiotic+ language; review the wording.
- "Does Skinbiotic+ replace sunscreen?" is allowlisted in `docs/check-banned.sh` (answer is No).

## Dermaboost+ product page (blueprint, Oct 9 2026)

`templates/product.dermaboost.json` rebuilt to the Dermaboost+ blueprint (23 sections): hero + Supr buy box, definition, video slot, what "Restore" means (Protect / Balance / Restore), antioxidant biology, eight-ingredient formula cards, formulation-logic network, immune biology, barrier + nutrition, collagen, how to use (label directions word for word + caution), renewal timeline (centralized), who it is for (5), what it supports (4), research preview (4), what the science does not say, system cross-sell (Skin Recovery, Sun Resilience), founder, reviews, FAQ (7 + the centralized results answer), compliance, final CTA. SEO set in Shopify from the blueprint. The Science page Dermaboost+ section has anchor `dermaboost`; every research link and CTA goes there.

New/extended pieces: `ingredient-network` section (up to 8 nodes on a ring, pairings join node numbers; used here), `product-actives` (columns 3 or 4). Fixed a bug in `rich-text`: the heading was always centred even when the section was set to left alignment (affects the UV, Skinbiotic+, Dermaboost+ and Founder pages; home sections are set to centre and are unchanged).

Decisions and notes:
- Tagline stays the label wording ("Daily immune support for calm, balanced skin"), not the blueprint's "Immune Support for Calm, Balanced Skin".
- Amounts are the labeled amounts ("250 mg NE", "25 mcg (1,000 IU)", etc.). The blueprint's "250 mg per 2-capsule serving" is shown as "per serving" (the label serving is two capsules).
- Curcumin is named "Optimized curcumin" on this page. The branded name is not used in page copy, filenames or alt text. It still appears in three places you should decide on: the Shopify ingredient record's name field ("Longvida® optimized curcumin extract", used by other product pages), the curcumin ingredient slide (day 21 artwork prints the brand in its title, so it is NOT used on this page; the curcumin card shows the placeholder frame), and the Science page Dermaboost+ curcumin card, which still uses that slide. The repo's source-images folder for day 21 was renamed to `day-21-curcumin`. The snippet `ingredient-slide-asset.liquid` still maps the Shopify record handle (`longvida-curcumin`); that handle is the Shopify record's own handle.
- Slides used on the formula cards: niacinamide (d12), vitamin D3 (d14), vitamin C (d15), zinc (d16), quercetin (d17). Curcumin, olive leaf and astaxanthin have no usable slide, so they show placeholder frames.
- Gallery: the five existing Shopify product images come first, then five theme assets are appended (Skin Recovery and Sun Resilience system renders, niacinamide, vitamin D3, vitamin C slides). Check the existing Shopify images for before/after or disease-style imagery ("three defense compartments" and "barrier and comfort support" are unreviewed).
- Research cards cite approved studies only (astaxanthin x2, curcumin pharmacokinetic review). The quercetin and independent curcumin studies are held (`public_approved` off), so those links do not show.
- The negation list on "What the science does not say" and the "Does Dermaboost+ treat inflammation?" FAQ are allowlisted in `docs/check-banned.sh`.
- The product compliance slot is empty and hidden. The Skin Recovery card has a blank optional compliance line for when that wording is approved.
- The old "How long does one bottle last?" FAQ and the old Longvida mention in the FAQ were dropped (not in the blueprint).

## Individual Products landing page (blueprint, Oct 9 2026)

`templates/collection.individual-products.json` is assigned to the existing collection `individual-products` (the header's "Individual" link already points to it; collection template suffix and SEO were set in Shopify). Sections: hero (three formulas, equal weight, H1), Protect/Balance/Restore strip, product selector with plan area and trust strip, comparison table (no prices), three education blocks, "Not sure where to start?", four-system upsell, science strip, founder, FAQ (renewal entry switched off), compliance (plural FDA wording and the UV sunscreen line), final CTA.

**Purchase flow, the one decision to confirm:** I could not verify that Supr can bind to a different product on a collection/page template, and the rules forbid rebuilding its payload, so I shipped the blueprint's fallback. Choosing a formula highlights its card and reveals one plan area (heading, copy, expectation line, trust strip); the plan button opens that product's page at `#buy-box`, where the native form and Supr widget live. Without JavaScript the Choose buttons go straight to `#buy-box`. Nothing on this page adds to cart, writes a selling plan, or shows a price. If Supr confirms an on-page binding works, the plan area in `sections/product-selector.liquid` is where a native product form would go.

New/extended: `product-selector`, `compare-table`, `start-paths` sections; `feature-split` (heading level), `system-finder` (section button), `pdp-faq` (renewal entry toggle), `compliance-notice` (FDA wording override); asset `individual-three-formulas.webp` (the three clean renders on white, composed from `source-images/product-renders`).

Notes:
- Selector cards use the label taglines from each product's `custom.tagline`, not the blueprint's "Outdoor Support for Resilient Skin" / "Essential Gut Care for Skin Health" / "Immune Support for Calm, Balanced Skin".
- The blueprint question "Do I need all three?" is worded "Do I need every formula?" (the banned list blocks the original phrasing).
- Format row says "Capsules" for all three (Skinbiotic+ is also capsules).
- Education blocks use the lifestyle renders as images; swap in the editor if you prefer product photos.

## Systems landing page (blueprint, Oct 9 2026)

`templates/page.systems.json` on a new Shopify page `/pages/systems` (page created, published, template suffix `systems`, SEO title and description set from the blueprint). It is a guided funnel, not a collection grid: hero (Sun Safe strongest in the composed `systems-hero.webp`), Protect/Balance/Restore framework, four-system selector with plan area and trust strip, comparison table, four system education blocks (Sun Safe, Skin Recovery, Sun Resilience, Complete with the "not the universal starting point" note), four-path finder, why systems exist, label directions, renewal timeline (centralized), science preview, founder, FAQ (centralized results answer first), compliance, final CTA.

Purchase flow: identical to the Individual Products page (see that section). Choose a system, see its plan area, then the plan button opens that system's product page at `#buy-box` where the native form and Supr widget live. Nothing here adds to cart, writes a selling plan, or shows a price. The plan area also renders the chosen system's own `custom.compliance_slot` (empty and hidden today), so the Skin Recovery compliance wording goes into that metafield on the Skin Recovery System product when approved.

New/extended: `system-directions` (reads each product's `custom.how_it_works` word for word), `product-selector` (two-per-row layout, wide card images, "Includes" line, theme-asset images, tagline toggle, product compliance slot in the plan area, up to four cards), `start-paths` (two-per-row). Links that pointed at `/collections/bundles` (home, Science, Individual Products, footer) now point to `/pages/systems`; the header "Systems" link uses the page when it exists.

Notes:
- The sunscreen line names the three systems ("Sun Safe, Sun Resilience, and Complete Skin Defense do not replace sunscreen...") so Skin Recovery is excluded; the phrase is allowlisted in `docs/check-banned.sh`.
- The "How long until I see results?" entry and the Renewal Timeline come from Theme settings, not page text.
- The existing `bundles` collection (and the main-menu entries "THE SYSTEM" etc. in Shopify navigation) are untouched; the theme header does not use the menu for these.
- Copy for the three "Why combine them?" blocks paraphrases the synergy assessment without the internal "inflammatory" wording.

## Sun Safe System product page (blueprint, Oct 9 2026)

`templates/product.sun-safe-system.json` rebuilt to the blueprint (24 sections incl. the video slot): hero + Supr buy box, definition (Protect / Balance), why these two (four-step rationale flow with the "not clinically tested as a combined regimen" caption), Step 1 UV Shield+, Step 2 Skinbiotic+, four layers of skin support, outdoor biology, gut-skin, formula overview, how to use (label directions pulled live from each product), renewal timeline (centralized), six lifestyle cards, four support areas, research preview, what the science does not say, "Keep the sunscreen", system comparison, upgrade path (Sun Resilience, Skin Recovery, Complete, none presented as better), founder, reviews, FAQ (9 + centralized results answer), compliance, final CTA. The existing sticky "Choose your plan" bar (scroll to buy box, never add to cart) is unchanged. Shopify: SEO title/description set, `custom.tagline` set to "Daily internal skin support for life in the sun" (it was empty).

New/extended: `split-compare` (list and primary-focus lines; used for the definition and the split-screen formula overview), `compare-table` (optional button), `system-directions` grid now auto-fits two products. Bug fix: `science-cards` only handled a single study handle; a comma-separated list showed no link at all (this affected the Skinbiotic+, Dermaboost+ research cards). It now renders one link per handle.

Notes:
- Product-page tagline for UV Shield+ and Skinbiotic+ inside the step blocks stays the label wording.
- Gallery: the five existing Shopify images come first, then four theme assets (system render, UV and inulin title slides, sailboat lifestyle). Check that the existing Sun Safe media ("pairing supports", "inside and out") carries no sunburn or UV-protection wording.
- The skinbiotic-specific compliance wording goes in `custom.compliance_slot` on this product when approved; it is empty and hidden now.
- The "UV blocking / sunburn / cancer prevention" guidance in the blueprint is not on the page except inside the "does not claim" list; the phrases are allowlisted in `docs/check-banned.sh` ("oral sunscreen" appears only in the required callout).
- The existing UV Shield+ biology intro (layer-stack) still mentions inflammatory signaling; consider rewording it for consistency with the newer pages.

## Sun Resilience System product page (blueprint, Oct 9 2026)

`templates/product.sun-resilience-system.json` rebuilt to the blueprint (27 sections incl. the video slot): hero + Supr buy box, definition (Protect / Restore, "intentionally more overlapping than Sun Safe"), why these two (with three complementarity cards and the "not a clinically tested finished-product regimen" caption), Step 1 UV Shield+, Step 2 Dermaboost+, antioxidant biology, "not all antioxidants work the same way", immune biology, resilience, formula overview, intentional overlap, how to use (label directions live from each product), renewal timeline (centralized), six lifestyle cards (skiing is a placeholder frame), four support areas, research preview, what the science does not say, "Keep the sunscreen", comparison, alternative routes, founder, reviews, FAQ (10 + centralized results answer), compliance, final CTA. Existing sticky "Choose your plan" bar unchanged. Shopify: SEO set; `custom.tagline` set to "Comprehensive internal support for skin that lives outdoors" (it was empty). No new sections were needed.

Notes:
- The existing Shopify media for this product includes an image alt-named "before, during and after the sun" and an "antioxidant support" graphic: the blueprint bars before/after sun imagery, so check those and remove or reorder in Shopify. The page appends the system render, the UV and niacinamide title slides and the tennis lifestyle image after the existing five.
- Step blocks keep the label taglines for UV Shield+ and Dermaboost+.
- "Higher niacinamide emphasis" under UV Shield+ contributions is from the blueprint (UV Shield+ 500 mg vs Dermaboost+ 250 mg NE on the labels).
- Allowlist additions in `docs/check-banned.sh`: "Does Sun Resilience replace sunscreen" and the "clinically tested finished-product regimen" caption.

## Skin Recovery System product page (blueprint, Oct 9 2026)

`templates/product.skin-recovery-system.json` rebuilt to the blueprint (26 sections incl. the video slot): hero + Supr buy box, definition (Balance / Restore), why these two (five rationale cards with the "not a clinically tested finished-product regimen" caption), Step 1 Skinbiotic+, Step 2 Dermaboost+, gut-skin connection, gut-to-systemic, microbiome + immune, antioxidant biology, formula overview, "not the same as Sun Safe", how to use (label directions live from each product), renewal timeline (centralized), five audience cards, four support areas, research preview, what the science does not say, comparison, alternative routes, founder, reviews, FAQ (9 + centralized results answer), compliance, final CTA. Existing sticky "Choose your plan" bar unchanged. Shopify: SEO set; `custom.tagline` set to "Gut-skin balance meets daily resilience" (it was empty).

Compliance slot for the Skinbiotic+ + Dermaboost+ pairing: the single product metafield `custom.compliance_slot` on the Skin Recovery System product (empty and hidden today). New `compliance_slot` block in `pdp-main` (hero) and a "show slot" checkbox on `system-directions` (how to use) place it in three spots (hero, how to use, compliance area) as the blueprint asks; once text is entered it appears in all three, so remove the block / untick the box where you only want it once. The Systems and Individual Products pages also show it in their plan area for the chosen product.

Notes:
- Skinbiotic+ and Dermaboost+ taglines inside the step blocks stay the label wording.
- Allowlist additions in `docs/check-banned.sh` for the required negations ("Treat acne ..." list, "not the same as treating an immune-mediated skin condition", "The goal is not to treat a condition", "Is this a treatment for inflammatory skin conditions").
- Skipped on purpose: the blueprint's "eliminate inflammation" negation as a sentence in the antioxidant section (the banned list blocks it outside the "does not claim" list).
- Existing Shopify media for this product (spa-setting hero, "inside-out support") has not been reviewed visually; check for disease imagery or inflammation wording.
