# RELIK — storefront prototype

Angular 20 (standalone components, strict TypeScript, OnPush, signals, zoneless) demo storefront for RELIK, with the fixed-camera skull hero as its signature visual.

> **Demo only.** Products, prices, stock and policies are placeholders. Checkout does not take payment or place orders. Newsletter and contact forms validate input but send and store nothing.

## Run

```bash
npm install
npm start            # dev server → http://localhost:4200
npm run build        # production build → dist/store/browser
npm test -- --watch=false --browsers=ChromeHeadless
```

To preview the production build, serve `dist/store/browser` with any static server that falls back to `index.html` for unknown routes (SPA routing).

## Structure

```
src/app/
  core/        models.ts (typed domain), money.ts (STORE_CURRENCY token + money pipe), storage.ts
  catalog/     catalog.data.ts (single typed demo source), catalog.logic.ts (filter/sort/URL), catalog.service.ts
  cart/        cart.logic.ts (pure, tested), cart.store.ts (signals + persistence)
  wishlist/    wishlist.store.ts
  hero/        hero-renderer.ts (WebGL), hero-visual.ts (lifecycle, pause, fallback)
  shell/       header (glass nav), mobile menu, search dialog, footer, toast
  shared/      product card, option picker, qty stepper, purchase panel, focus trap, reveal, icons
  pages/       home, shop (+ collections), product, wishlist, bag, checkout demo, content, not-found
scripts/gen-product-art.mjs   regenerates placeholder product illustrations
public/hero/                  hero plate + chain/skull/star masks
public/products/              product imagery
```

## Hero animation

- The plate (`public/hero/base.webp`) is drawn 1:1 every frame. Nothing scales, pans or rotates it.
- Chains couldn't be cut out cleanly (they wrap around and behind the skull), so they stay still and only their **reflections** move, through a specular mask. Stars twinkle through a per-star phase map. 26 faint dust motes drift.
- Every term repeats on an 8 s period, so the last frame matches the first.
- The skull area is masked out of all lighting effects.
- It pauses when offscreen or when the tab is hidden. Under `prefers-reduced-motion` it shows a static frame. If WebGL fails, the static `<img>` stays.
- On mobile it uses a static portrait crop (`--hero-focus`) and never zooms.
- Masks were generated from the source image by `../build_assets.py`. A standalone 8 s WebM export is at `../relik-hero-loop.webm`.

## Demo content and missing integrations

| Area | Status |
| --- | --- |
| Catalog (12 products) | Placeholder names, prices, options, stock in `catalog.data.ts` |
| Product images | 1 real photo (Vertebra Link Chain). The other 11 are generated SVG illustrations labelled "Illustration · photo to come" |
| Currency | USD, set once in `STORE_CURRENCY` |
| Cart / wishlist | Stored in localStorage on this device only |
| Checkout | Order summary only. No payment, no order submission, no personal data collected |
| Newsletter / contact | Validation only. Nothing is sent or saved |
| Shipping, returns, privacy, terms | Clearly marked drafts awaiting owner/legal approval |
| Contact details, brand history, materials | Not provided. Nothing has been invented |

## Next steps

1. **Product data.** Replace `fetchProducts()` in `catalog.service.ts` with a call to a commerce backend (Shopify Storefront API, commercetools, Medusa, etc.) that returns the same `Product` shape. Swap the SVGs for photography (same file names, or update `images`).
2. **Orders and payments.** Use a hosted, PCI-compliant checkout (e.g. Stripe Checkout or the platform's own). Send cart lines (`productId` + `options` + `quantity`) to the server, and re-price and validate stock there. Never trust client prices.
3. **Forms.** Connect the newsletter to an email provider and contact to a ticketing/email service. Then update the copy that currently says nothing is sent.
4. **Policies.** Write and approve shipping, returns, privacy and terms. Remove the draft banners.
5. **Deploy.** `npm run build`, then host `dist/store/browser` on any static host with SPA fallback (Netlify, Vercel, Cloudflare Pages, Firebase Hosting). Consider Angular SSR/prerendering for SEO once real content exists.
