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
**Action:** add Dejanire Text to the Adobe Fonts kit `qza3lbn` and confirm its CSS family name in Theme settings > Typography. Until then body falls back to Georgia.

## Buy box rules (Supr owns it)

- `sections/pdp-main.liquid` posts a plain HTML form to `/cart/add`. No JS add-to-cart, no hand-built payload, no `selling_plan` input, no quantity input, no dynamic checkout.
- Sticky bar is a scroll-to-buy-box link ("Choose your plan"), never an add-to-cart.
- Cards (home, collection, search, cross-sell) link to the product page and have no add-to-cart.
- Staging-only: Theme settings > Product pages > "basic Supply selector". Leave OFF in production.
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

- Products currently have a single "Default Title" variant. The brief calls for "Single Supply" / "3-Month Supply" (option "Supply") before Supr offers are configured.
- Navigation is built from the fixed product handles, so no menu needs creating. Footer and legal links point at `/pages/terms`, `/pages/privacy`, `/pages/refund`, `/pages/shipping`, `/pages/subscription-terms`, `/pages/sms-terms`. Create those pages with the `page.legal` template once content exists.
- No 301 redirects needed: the site has never been live.
- Customer account templates are not included (new customer accounts assumed). A branded password page is included (`layout/password.liquid`, `templates/password.json`).

## Copy check (docs/check-banned.sh)

Run `docs/check-banned.sh . ~/.alchemia-private-banned.txt` before handoff. The private manufacturer-name list lives outside the repo; `docs/private-banned.TEMPLATE.txt` shows the format.
BLOCK hits that remain by design are code identifiers and editor-only labels for the hidden offer (`show_guarantee`, `guarantee-badge`, `guarantee_*` settings). They never render while the switch is off. Add them to `ALLOW` in the script if a clean exit code is wanted.
REVIEW hits to keep checking by hand: the label-verified melanoma line, the founder story, "board-certified".

## Finish layer (ported from the original theme)

Rebuilt on brand tokens, not copied: scroll fade-up reveal (off for reduced motion and in the editor), header blur/shadow and hide-on-scroll-down, underline-grow nav links, framed product cards with hover zoom and role badges, bundle panel, trust strip, overlay-label lifestyle tiles, full-bleed founder split, black-to-Emerald bands with gold hairlines, gold newsletter band in the footer, numbered bundle steps.
Home flow: hero, trust strip, product system + bundle panel, statement, problem, solution, 16:9 reel, lifestyle, founder, science, mission band, closing CTA.
Media comes from the store's own Files via `shopify://shop_images/...` and `shopify://files/videos/...` (golf, tennis, sailing and beach photos; the `hf_20260503_005659...mp4` reel). Bundled theme assets are the fallback if a file reference does not resolve.
Not carried over on purpose: "Natural" and "Gluten-free" (unverified), outcome wording such as "Protection for every round", the percentage-of-proceeds line and the "save up to 20%" cart note (figures), the sunscreen Q&As that tripped the block list, the cart drawer and quick add (Supr owns the buy box).
`headline_weight` (Theme settings > Typography) switches headlines between Regular and Semibold/Bold.
