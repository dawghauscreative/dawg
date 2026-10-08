# Alchemia MD Shopify theme (clean Online Store 2.0 rebuild)

Build target Nov 1, 2026. Launch Jan 1, 2027. Store: alchemiamd. **Never publish from here. Reyshan publishes after sign-off.**

## Deploy to an unpublished theme

No theme was created in the store by this build. Either connect this branch with Shopify's GitHub integration or run
`shopify theme push --unpublished --store alchemiamd`. Then, in the theme editor:

1. App embeds: turn **Supr Bundles & Subscriptions** ON and save (it is off on the live theme).
2. Add the optional "Subscriptions + Bundles" app block inside the **Buy buttons** area of the product hero if exact placement is wanted. It renders inside the `/cart/add` form.
3. Upload the logo only if overriding the bundled white logotype (Theme settings > Brand & contact).

## Design tokens and type (Brand Guidelines V1 wins over the brief)

Colours: Black `#141414`, Charcoal `#212121`, Emerald `#132D22`, Evergreen `#2D3D2D`, Gold `#C18C31`, Beige `#DEBC8C`, Gray `#AFAFAF`, White. All are Theme settings.
Schemes per section: Black, Evergreen-family (uses Emerald for contrast with gold text), White, Beige. Body copy is Gray on dark, per the guide.
Type: headlines BC Novatica (kit serves 400/700, so semibold renders 700, never all caps), body **Dejanire Text**, callouts Roboto tracked caps.
**Fonts on hold** (see Known gaps). Current fonts stay as they are; body falls back to Georgia until the Adobe kit carries the body font.

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
| `show_renewal_timeline` | ON | Copy approved Oct 8, **FTC net-impression review pending: do not publish until it clears.** Expectation line and FAQ answer are empty until the approved wording is pasted in. |
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
- Fonts are on HOLD: keep the current setup. The brand guide says Dejanire Text for body; the locked decision was BC Novatica CYR plus Cormorant Garamond. Reyshan is confirming which is right. Do not change fonts until told.
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
1. Skinbiotic+ description states "30 billion CFU". The label Supplement Facts shows a 215 mg blend with no CFU line, so that figure is unverified. Remove it or confirm.
2. The Skinbiotic+, Skin Recovery and Complete System descriptions carry internal notes (open questions 8.2 and 8.5) about a physician-guidance caution for people on immunosuppressant medication. Still unresolved. Use the `custom.compliance_slot` metafield once wording is approved; nothing was invented.
3. "Clinical evidence" is a card title on the home page (from the blueprint). Counsel to confirm wording.
4. Not built (no approved articles or images): home "Education" guide row, blog articles, Life-in-the-Sun tiles for running, cycling and travel, Tier 1 citations, FAQ categories for Subscriptions billing and Shipping.
5. Blueprint V2 lists a different palette (Gold #C9A96E, Evergreen #1A2E1F, Beige #F5F0E8) and fonts (Cormorant Garamond display, BC Novatica body) than Brand Guidelines V1. Theme still uses V1 and current fonts; fonts are on hold per Reyshan.
