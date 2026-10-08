# Alchemia MD Shopify theme (clean Online Store 2.0 rebuild)

Build target Nov 1, 2026. Launch Jan 1, 2027. Store: alchemiamd. **Never publish from here. Reyshan publishes after sign-off.**

## Deploy to an unpublished theme

No theme was created in the store by this build. Either connect this branch with Shopify's GitHub integration or run
`shopify theme push --unpublished --store alchemiamd`. Then, in the theme editor:

1. App embeds: turn **Supr Bundles & Subscriptions** ON and save (it is off on the live theme).
2. Add the optional "Subscriptions + Bundles" app block inside the **Buy buttons** area of the product hero if exact placement is wanted. It renders inside the `/cart/add` form.
3. Upload the logo only if overriding the bundled white logotype (Theme settings > Brand & contact).

## Buy box rules (Supr owns it)

- `sections/pdp-main.liquid` posts a plain HTML form to `/cart/add`. No JS add-to-cart, no hand-built payload, no `selling_plan` input, no quantity input, no dynamic checkout.
- Sticky bar is a scroll-to-buy-box link ("Choose your plan"), never an add-to-cart.
- Cards (home, collection, search, cross-sell) link to the product page and have no add-to-cart.
- Staging-only: Theme settings > Product pages > "basic Supply selector". Leave OFF in production.
- Prices are read from Shopify data. Nothing is hard-coded: no prices, percentages, savings or variant IDs.

## Switches (Theme settings)

| Setting | Default | Notes |
|---|---|---|
| `show_guarantee` | OFF | All guarantee output goes through `snippets/guarantee-badge.liquid`. No guarantee wording exists. |
| `show_renewal_timeline` | ON | Copy approved Oct 8, **FTC net-impression review pending: do not publish until it clears.** Expectation line and FAQ answer are empty until the approved wording is pasted in. |
| `compliance_slots_enabled` | ON | Slots render only when they have content. Bundle 2 notice and Skinbiotic+ caution are empty and undecided. |
| `fda_disclaimer_text` | label wording | Taken from the printed labels. Reyshan/counsel to confirm. |
| `melanoma_line_text` | label wording | Verified on all three product labels. No amounts shown. |
| Video 9:16 `show_placeholder` | ON | Neutral frame on home and all 7 product pages. Add a video or switch off before launch. |

## Product data (created through the Shopify connector)

Metafields `custom.tagline, definition, benefits, ingredients, how_it_works, bundle_components, crosssell_products, compliance_slot, tier1_citations` and the `ingredient` metaobject exist.
Filled from printed labels / brief: taglines and directions on the 3 singles, bundle components, cross-sell. Everything else is empty until approved copy exists.
Not in the brief's metafield list: `custom.tier1_citations` (the brief refers to it in section 5). Added.

## Known gaps (see the build notes for owners)

- Products currently have a single "Default Title" variant. The brief calls for "Single Supply" / "3-Month Supply" (option "Supply") before Supr offers are configured.
- Navigation is built from the fixed product handles, so no menu needs creating. Footer and legal links point at `/pages/terms`, `/pages/privacy`, `/pages/refund`, `/pages/shipping`, `/pages/subscription-terms`, `/pages/sms-terms`. Create those pages with the `page.legal` template once content exists.
- 301 redirects from old handles are not created: the old-handle list is needed (the brief gives `dermaboost-1` only as an example).
- Customer account templates and password page are not included (new customer accounts / default password page assumed).
