# Mundial Shop 2026 — Design Spec

**Date:** 2026-04-01
**Status:** Approved

---

## Overview

An e-commerce store selling replica/fan soccer jerseys for the 2026 FIFA World Cup (48 teams). Uses a dropshipping model — no inventory held. Target market: Mexico and LATAM. Launches in 3–4 weeks.

---

## Business Model

- **Product:** Replica/fan jerseys sourced via dropshipping (DHgate, SoccerDeal.store)
- **Supplier fulfillment:** Orders placed by customer → DSers forwards to supplier → supplier ships directly to customer
- **Shipping time to Mexico:** 10–15 days (DHL/FedEx express from China)
- **Cost per jersey:** ~$10–16 USD wholesale
- **Retail price:** ~$599–$899 MXN (~$30–$45 USD)
- **Gross margin:** ~50–60%
- **Legal note:** Replica jerseys with team marks are legally gray in Mexico. Risk is accepted as part of the business model. Do not display Nike/Adidas branding in product listings.

---

## Architecture

```
Browser
  └── Next.js 16 (Vercel)
        └── Shopify Storefront GraphQL API
              ├── Products / Variants / Inventory
              ├── Cart & Checkout (Shopify hosted)
              └── Orders

Shopify Admin
  └── DSers app → auto-forward orders to DHgate / SoccerDeal

Payments (via Shopify)
  ├── Mercado Pago (official Shopify app, MX market)
  └── Stripe
```

The Next.js frontend is fully custom and deployed on Vercel. Shopify acts as an invisible backend: product catalog, cart, checkout, orders, and fulfillment tracking. The Shopify hosted checkout handles payment — no custom payment integration needed in the Next.js layer.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Typography | Geist Sans |
| Images | next/image (automatic optimization) |
| Backend / data | Shopify Storefront API (GraphQL) |
| Payments | Mercado Pago + Stripe (via Shopify) |
| Dropshipping | DSers (free Shopify app) |
| Hosting | Vercel |
| Domain | Custom (e.g. mundialshop.mx) |

**Environment variables:**
```
SHOPIFY_STORE_DOMAIN=tu-tienda.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
```

---

## Visual Design

- **Style:** Minimalist & Premium — white/light grey backgrounds, black typography, clean borders
- **Typography:** Geist Sans for UI text; uppercase letter-spacing for labels/categories
- **Accent:** Black as primary action color; no loud gradients or heavy color fills
- **Components:** shadcn/ui Card, Badge, Button, Select, Sheet (mobile nav)

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Homepage: hero banner + popular teams grid |
| `/selecciones` | Catalog: filterable by confederation and version (local/away) |
| `/selecciones/[slug]` | Product page: variant thumbnails, size selector, shipping info |
| `/carrito` | Cart summary + checkout CTA |
| `/paginas/guia-de-tallas` | Static size guide |
| `/paginas/envios-y-devoluciones` | Shipping & returns policy |
| `/paginas/contacto` | Contact form |

---

## Homepage (`/`)

1. **Navbar:** Logo (left) · Selecciones · Carrito icon (right)
2. **Hero:** Dark background, headline "Viste a tu selección", subhead "48 selecciones · Mundial 2026", CTA button "Ver colección"
3. **Popular teams grid:** 2×2 or 2×3 grid of the top-demand countries (Mexico, Argentina, Brazil, Spain, France, Germany). Each card: flag emoji + country name + price. Click → product page.
4. **Minimal footer:** links to static pages + social icons

---

## Product Page (`/selecciones/[slug]`)

Layout: 2-column on desktop, stacked on mobile.

**Left column:**
- Main jersey photo (large)
- Thumbnail row for Local / Away versions (clicking switches main photo and updates variant selection)

**Right column:**
- Confederation badge (e.g. "CONMEBOL")
- Product name: "Playera Fan [País] 2026"
- Price in MXN
- Version selector: `LOCAL` | `VISITANTE` (pill toggle)
- Size selector: S / M / L / XL / XXL (bordered squares, selected = black fill)
- Size guide link (opens modal or links to `/paginas/guia-de-tallas`)
- Shipping info badge: "📦 Envío: 10–15 días a México"
- "Agregar al carrito" button (primary, full width)
- "Comprar ahora" button (secondary, full width)
- "También te puede interesar" — 4 jerseys from the same confederation

---

## Catalog Page (`/selecciones`)

- **Filter bar:** Confederation tabs (Todos / CONCACAF / CONMEBOL / UEFA / CAF / AFC)
- **Version filter:** Todos / Local / Visitante
- **Product grid:** 3 columns desktop, 2 columns mobile
- Each card: jersey photo, flag emoji, country name, price, "Agregar" button on hover

---

## Product Catalog Structure (Shopify)

Each jersey = one Shopify product with two option axes:
- **Option 1 — Versión:** Local, Visitante
- **Option 2 — Talla:** S, M, L, XL, XXL

Each combination = one variant (e.g. Local / M).

**Product metafields:**
- `confederacion`: CONMEBOL | CONCACAF | UEFA | CAF | AFC
- `pais_emoji`: 🇲🇽
- `tiempo_envio`: "10–15 días"

**Launch catalog (15–20 teams):**
México, Argentina, Brasil, España, Francia, Alemania, Portugal, Inglaterra, Colombia, Uruguay, USMNT, Japón, Marruecos, Croacia, Senegal.

Additional teams added post-launch as the tournament approaches.

---

## Order Flow (Dropshipping)

1. Customer places order → Shopify records it + charges via Mercado Pago or Stripe
2. DSers detects new order → forwards to supplier on DHgate or SoccerDeal
3. Supplier ships directly to customer via DHL/FedEx
4. Tracking number syncs back to Shopify → automatic email to customer
5. Manual step (setup only): map each Shopify variant to the correct supplier SKU in DSers

**Recommended suppliers:**
- Primary: SoccerDeal.store (Trustpilot 4.3/5, formal dropship program, 12% discount after 3 orders)
- Secondary: DHgate (sellers: Isoccer, Amy10031, EffectSports — use express shipping only)

---

## Out of Scope (MVP)

- Wishlist / favorites
- Customer reviews
- Blog / content section
- Referral program
- Interactive size comparison tool
- Multi-currency (launch in MXN only)
- Loyalty points

---

## Recommended Suppliers

| Supplier | Cost/jersey | Shipping to MX | Integration |
|---|---|---|---|
| SoccerDeal.store | $10–15 USD | 7–12 days (DHL) | Manual / DSers |
| DHgate (express) | $10–16 USD | 7–12 days (DHL/FedEx) | DSers / AutoDS |
| CJ Dropshipping | $12–18 USD | 15–25 days (standard) | Native Shopify app |

Order samples before going live to verify quality and shipping times.

---

## Launch Checklist (Pre-launch)

- [ ] Shopify store created + Storefront API token generated
- [ ] DSers installed + supplier accounts linked
- [ ] Sample orders placed and received (quality check)
- [ ] Mercado Pago app installed in Shopify (MX)
- [ ] Stripe connected
- [ ] 15–20 products uploaded with photos, variants, and metafields
- [ ] Shipping policy and size guide pages written
- [ ] Domain connected in Vercel
- [ ] Next.js app deployed to Vercel
