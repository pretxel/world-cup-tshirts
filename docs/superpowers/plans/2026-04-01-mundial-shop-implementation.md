# Mundial Shop 2026 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a headless e-commerce storefront for selling World Cup 2026 replica jerseys to the Mexico/LATAM market, using Next.js 16 on Vercel with Shopify as the backend.

**Architecture:** Next.js 16 App Router (Server Components by default) deployed on Vercel fetches products and manages cart state via Shopify Storefront GraphQL API. Cart ID is persisted in a cookie; add-to-cart and cart mutations run as Next.js Server Actions. Shopify hosted checkout handles payment (Mercado Pago + Stripe configured in Shopify admin).

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Geist font, Shopify Storefront API 2024-01, Vitest, @testing-library/react

---

## File Structure

```
world-cup-tshirts/
├── app/
│   ├── layout.tsx                         # Root layout: fonts, metadata, navbar, footer
│   ├── page.tsx                           # Homepage: hero + popular teams grid
│   ├── selecciones/
│   │   ├── page.tsx                       # Catalog: product grid + confederation filter
│   │   └── [slug]/
│   │       └── page.tsx                   # Product page: images, variant selectors, add-to-cart
│   ├── carrito/
│   │   └── page.tsx                       # Cart: line items + checkout redirect
│   ├── paginas/
│   │   ├── guia-de-tallas/page.tsx        # Static: size guide
│   │   ├── envios-y-devoluciones/page.tsx # Static: shipping policy
│   │   └── contacto/page.tsx             # Static: contact info
│   └── actions/
│       └── cart.ts                        # Server Actions: cartCreate, cartLinesAdd, cartLinesRemove
├── components/
│   ├── navbar.tsx                         # Site nav (Server): logo, links, cart count
│   ├── footer.tsx                         # Site footer (Server): links, copyright
│   ├── hero.tsx                           # Homepage hero (Server): headline, CTA
│   ├── popular-teams-grid.tsx             # Homepage grid (Server): top 6 teams
│   ├── product-card.tsx                   # Catalog card (Server): image, name, price
│   ├── product-grid.tsx                   # Catalog grid wrapper (Server)
│   ├── confederation-filter.tsx           # Filter tabs ('use client'): confederation toggle
│   ├── version-selector.tsx               # LOCAL/VISITANTE toggle ('use client')
│   ├── size-selector.tsx                  # S/M/L/XL/XXL buttons ('use client')
│   ├── add-to-cart-button.tsx             # Add to cart ('use client'): calls Server Action
│   └── cart-line-item.tsx                 # Cart row ('use client'): qty + remove
├── lib/
│   ├── shopify/
│   │   ├── client.ts                      # GraphQL fetch wrapper with caching
│   │   ├── types.ts                       # TypeScript types: ShopifyProduct, ShopifyCart, etc.
│   │   ├── queries/
│   │   │   ├── products.ts               # getProducts, getProductByHandle
│   │   │   └── cart.ts                   # cartCreate, cartLinesAdd, cartLinesRemove, getCart
│   │   └── utils.ts                      # formatPrice, getVariantId, extractMetafield
│   └── constants.ts                      # POPULAR_TEAMS list, CONFEDERATION_OPTIONS
├── __tests__/
│   ├── lib/shopify/utils.test.ts
│   ├── lib/shopify/client.test.ts
│   └── components/size-selector.test.tsx
├── next.config.ts
├── tailwind.config.ts
├── components.json
├── vitest.config.ts
├── vitest.setup.ts
└── .env.local.example
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json` (via npx)
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `components.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `.env.local.example`

- [ ] **Step 1: Scaffold Next.js 16 app**

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --no-eslint
```

When prompted for "Would you like to use Turbopack?", answer **Yes**.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install geist
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base color: **Zinc**
- CSS variables: **Yes**

Then install the components you'll need:

```bash
npx shadcn@latest add button badge card tabs sheet separator
```

- [ ] **Step 4: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 5: Create `vitest.setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Add test script to `package.json`**

Open `package.json` and add to `"scripts"`:

```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 7: Create `.env.local.example`**

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
```

Also create `.env.local` with your actual values (get these from Shopify Admin → Settings → Apps → Develop apps → Create app → Configure Storefront API).

- [ ] **Step 8: Update `next.config.ts`**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 9: Verify app starts**

```bash
npm run dev
```

Expected: Next.js dev server running at http://localhost:3000 with default page visible.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 + shadcn/ui + vitest"
```

---

## Task 2: Shopify Types + Client

**Files:**
- Create: `lib/shopify/types.ts`
- Create: `lib/shopify/client.ts`
- Create: `__tests__/lib/shopify/client.test.ts`

- [ ] **Step 1: Write the failing test for shopifyFetch**

Create `__tests__/lib/shopify/client.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shopifyFetch } from '@/lib/shopify/client'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  vi.clearAllMocks()
  process.env.SHOPIFY_STORE_DOMAIN = 'test-store.myshopify.com'
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'test-token'
})

describe('shopifyFetch', () => {
  it('returns data on successful response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { products: [] } }),
    })

    const result = await shopifyFetch<{ products: unknown[] }>({
      query: '{ products(first: 1) { edges { node { id } } } }',
    })

    expect(result).toEqual({ products: [] })
  })

  it('throws on HTTP error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })

    await expect(
      shopifyFetch({ query: '{ products(first: 1) { edges { node { id } } } }' })
    ).rejects.toThrow('Shopify API error: 401')
  })

  it('throws on GraphQL errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ errors: [{ message: 'Field not found' }] }),
    })

    await expect(
      shopifyFetch({ query: '{ bad }' })
    ).rejects.toThrow('Field not found')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- __tests__/lib/shopify/client.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/shopify/client'`

- [ ] **Step 3: Create `lib/shopify/types.ts`**

```typescript
export type ShopifyImage = {
  url: string
  altText: string | null
}

export type ShopifySelectedOption = {
  name: string
  value: string
}

export type ShopifyVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: {
    amount: string
    currencyCode: string
  }
  selectedOptions: ShopifySelectedOption[]
}

export type ShopifyMetafield = {
  key: string
  value: string
} | null

export type ShopifyProduct = {
  id: string
  title: string
  handle: string
  description: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: { node: ShopifyImage }[]
  }
  variants: {
    edges: { node: ShopifyVariant }[]
  }
  metafields: (ShopifyMetafield)[]
}

export type ShopifyCartLine = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    selectedOptions: ShopifySelectedOption[]
    product: {
      title: string
      handle: string
      images: {
        edges: { node: ShopifyImage }[]
      }
    }
  }
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
}

export type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
  lines: {
    edges: { node: ShopifyCartLine }[]
  }
}
```

- [ ] **Step 4: Create `lib/shopify/client.ts`**

```typescript
export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  revalidate,
}: {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  revalidate?: number
}): Promise<T> {
  const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token':
        process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    ...(revalidate !== undefined
      ? { next: { revalidate } }
      : { cache }),
  })

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`)
  }

  const json = await response.json()

  if (json.errors) {
    throw new Error(json.errors[0].message)
  }

  return json.data as T
}
```

- [ ] **Step 5: Run test to confirm it passes**

```bash
npm run test:run -- __tests__/lib/shopify/client.test.ts
```

Expected: 3 tests PASS

- [ ] **Step 6: Commit**

```bash
git add lib/shopify/types.ts lib/shopify/client.ts __tests__/lib/shopify/client.test.ts
git commit -m "feat: add Shopify GraphQL client and TypeScript types"
```

---

## Task 3: Shopify Utils

**Files:**
- Create: `lib/shopify/utils.ts`
- Create: `lib/constants.ts`
- Create: `__tests__/lib/shopify/utils.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lib/shopify/utils.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  extractMetafield,
  getVariantByOptions,
  getProductImages,
} from '@/lib/shopify/utils'
import type { ShopifyProduct, ShopifyVariant } from '@/lib/shopify/types'

describe('formatPrice', () => {
  it('formats MXN price', () => {
    expect(formatPrice('599.00', 'MXN')).toBe('$599 MXN')
  })

  it('rounds cents when zero', () => {
    expect(formatPrice('599.00', 'MXN')).not.toContain('.00')
  })

  it('keeps cents when non-zero', () => {
    expect(formatPrice('599.50', 'MXN')).toBe('$599.50 MXN')
  })
})

describe('extractMetafield', () => {
  const metafields = [
    { key: 'confederacion', value: 'CONMEBOL' },
    { key: 'pais_emoji', value: '🇲🇽' },
    null,
  ]

  it('returns value for existing key', () => {
    expect(extractMetafield(metafields, 'confederacion')).toBe('CONMEBOL')
  })

  it('returns null for missing key', () => {
    expect(extractMetafield(metafields, 'nonexistent')).toBeNull()
  })
})

describe('getVariantByOptions', () => {
  const variants: ShopifyVariant[] = [
    {
      id: 'v1',
      title: 'Local / M',
      availableForSale: true,
      price: { amount: '599.00', currencyCode: 'MXN' },
      selectedOptions: [
        { name: 'Versión', value: 'Local' },
        { name: 'Talla', value: 'M' },
      ],
    },
    {
      id: 'v2',
      title: 'Visitante / L',
      availableForSale: true,
      price: { amount: '599.00', currencyCode: 'MXN' },
      selectedOptions: [
        { name: 'Versión', value: 'Visitante' },
        { name: 'Talla', value: 'L' },
      ],
    },
  ]

  it('finds variant matching all options', () => {
    const result = getVariantByOptions(variants, { Versión: 'Local', Talla: 'M' })
    expect(result?.id).toBe('v1')
  })

  it('returns undefined when no match', () => {
    const result = getVariantByOptions(variants, { Versión: 'Local', Talla: 'XXL' })
    expect(result).toBeUndefined()
  })
})

describe('getProductImages', () => {
  const product = {
    images: {
      edges: [
        { node: { url: 'https://cdn.shopify.com/local.jpg', altText: 'Local' } },
        { node: { url: 'https://cdn.shopify.com/visitante.jpg', altText: 'Visitante' } },
      ],
    },
  } as unknown as ShopifyProduct

  it('returns image array from edges', () => {
    const images = getProductImages(product)
    expect(images).toHaveLength(2)
    expect(images[0].url).toBe('https://cdn.shopify.com/local.jpg')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- __tests__/lib/shopify/utils.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/shopify/utils'`

- [ ] **Step 3: Create `lib/shopify/utils.ts`**

```typescript
import type { ShopifyMetafield, ShopifyProduct, ShopifyVariant } from './types'

export function formatPrice(amount: string, currencyCode: string): string {
  const num = parseFloat(amount)
  const formatted = num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)
  return `$${formatted} ${currencyCode}`
}

export function extractMetafield(
  metafields: (ShopifyMetafield)[],
  key: string
): string | null {
  const field = metafields.find((m) => m !== null && m.key === key)
  return field ? field.value : null
}

export function getVariantByOptions(
  variants: ShopifyVariant[],
  options: Record<string, string>
): ShopifyVariant | undefined {
  return variants.find((variant) =>
    Object.entries(options).every(([name, value]) =>
      variant.selectedOptions.some(
        (opt) => opt.name === name && opt.value === value
      )
    )
  )
}

export function getProductImages(product: ShopifyProduct) {
  return product.images.edges.map((e) => e.node)
}

export function getProductVariants(product: ShopifyProduct): ShopifyVariant[] {
  return product.variants.edges.map((e) => e.node)
}
```

- [ ] **Step 4: Create `lib/constants.ts`**

```typescript
export const POPULAR_TEAMS = [
  { country: 'México', emoji: '🇲🇽', handle: 'playera-fan-mexico-2026', confederation: 'CONCACAF' },
  { country: 'Argentina', emoji: '🇦🇷', handle: 'playera-fan-argentina-2026', confederation: 'CONMEBOL' },
  { country: 'Brasil', emoji: '🇧🇷', handle: 'playera-fan-brasil-2026', confederation: 'CONMEBOL' },
  { country: 'España', emoji: '🇪🇸', handle: 'playera-fan-espana-2026', confederation: 'UEFA' },
  { country: 'Francia', emoji: '🇫🇷', handle: 'playera-fan-francia-2026', confederation: 'UEFA' },
  { country: 'Alemania', emoji: '🇩🇪', handle: 'playera-fan-alemania-2026', confederation: 'UEFA' },
] as const

export const CONFEDERATION_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'CONCACAF', label: 'CONCACAF' },
  { value: 'CONMEBOL', label: 'CONMEBOL' },
  { value: 'UEFA', label: 'UEFA' },
  { value: 'CAF', label: 'CAF' },
  { value: 'AFC', label: 'AFC' },
] as const

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const

export const VERSIONS = ['Local', 'Visitante'] as const

export const CART_COOKIE = 'shopify_cart_id'
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm run test:run -- __tests__/lib/shopify/utils.test.ts
```

Expected: all tests PASS

- [ ] **Step 6: Commit**

```bash
git add lib/shopify/utils.ts lib/constants.ts __tests__/lib/shopify/utils.test.ts
git commit -m "feat: add Shopify utils and app constants"
```

---

## Task 4: Shopify Product Queries

**Files:**
- Create: `lib/shopify/queries/products.ts`

- [ ] **Step 1: Create `lib/shopify/queries/products.ts`**

```typescript
import { shopifyFetch } from '../client'
import type { ShopifyProduct } from '../types'

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 4) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "confederacion" }
      { namespace: "custom", key: "pais_emoji" }
      { namespace: "custom", key: "tiempo_envio" }
    ]) {
      key
      value
    }
  }
`

type GetProductsResponse = {
  products: {
    edges: { node: ShopifyProduct }[]
  }
}

export async function getProducts(options?: {
  first?: number
  query?: string
}): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<GetProductsResponse>({
    query: `
      ${PRODUCT_FRAGMENT}
      query GetProducts($first: Int!, $query: String) {
        products(first: $first, query: $query) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    `,
    variables: {
      first: options?.first ?? 50,
      query: options?.query,
    },
    revalidate: 3600,
  })

  return data.products.edges.map((e) => e.node)
}

type GetProductByHandleResponse = {
  productByHandle: ShopifyProduct | null
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<GetProductByHandleResponse>({
    query: `
      ${PRODUCT_FRAGMENT}
      query GetProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          ...ProductFragment
        }
      }
    `,
    variables: { handle },
    revalidate: 3600,
  })

  return data.productByHandle
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/queries/products.ts
git commit -m "feat: add Shopify product queries"
```

---

## Task 5: Shopify Cart Mutations + Server Actions

**Files:**
- Create: `lib/shopify/queries/cart.ts`
- Create: `app/actions/cart.ts`

- [ ] **Step 1: Create `lib/shopify/queries/cart.ts`**

```typescript
import { shopifyFetch } from '../client'
import type { ShopifyCart } from '../types'

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                title
                handle
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`

export async function createCart(): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>({
    query: `
      ${CART_FRAGMENT}
      mutation CartCreate {
        cartCreate {
          cart { ...CartFragment }
        }
      }
    `,
    cache: 'no-store',
  })
  return data.cartCreate.cart
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>({
    query: `
      ${CART_FRAGMENT}
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ...CartFragment }
        }
      }
    `,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
    cache: 'no-store',
  })
  return data.cartLinesAdd.cart
}

export async function removeFromCart(
  cartId: string,
  lineId: string
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>({
    query: `
      ${CART_FRAGMENT}
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ...CartFragment }
        }
      }
    `,
    variables: { cartId, lineIds: [lineId] },
    cache: 'no-store',
  })
  return data.cartLinesRemove.cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: `
      ${CART_FRAGMENT}
      query GetCart($cartId: ID!) {
        cart(id: $cartId) { ...CartFragment }
      }
    `,
    variables: { cartId },
    cache: 'no-store',
  })
  return data.cart
}
```

- [ ] **Step 2: Create `app/actions/cart.ts`**

```typescript
'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  createCart,
  addToCart,
  removeFromCart,
} from '@/lib/shopify/queries/cart'
import { CART_COOKIE } from '@/lib/constants'

async function getOrCreateCartId(): Promise<string> {
  const cookieStore = await cookies()
  const existingId = cookieStore.get(CART_COOKIE)?.value

  if (existingId) return existingId

  const cart = await createCart()
  cookieStore.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
  return cart.id
}

export async function addItemToCart(variantId: string) {
  const cartId = await getOrCreateCartId()
  await addToCart(cartId, variantId)
  revalidatePath('/carrito')
}

export async function removeItemFromCart(lineId: string) {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) return
  await removeFromCart(cartId, lineId)
  revalidatePath('/carrito')
}
```

- [ ] **Step 3: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add lib/shopify/queries/cart.ts app/actions/cart.ts
git commit -m "feat: add cart mutations and Server Actions"
```

---

## Task 6: Root Layout + Navbar + Footer

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/globals.css` (already exists from scaffold, update)
- Create: `components/navbar.tsx`
- Create: `components/footer.tsx`

- [ ] **Step 1: Update `app/globals.css`**

Replace the entire file with:

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 7%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 7%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 7%;
    --primary: 0 0% 7%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96%;
    --secondary-foreground: 0 0% 7%;
    --muted: 0 0% 96%;
    --muted-foreground: 0 0% 45%;
    --accent: 0 0% 96%;
    --accent-foreground: 0 0% 7%;
    --destructive: 0 84% 60%;
    --border: 0 0% 89%;
    --input: 0 0% 89%;
    --ring: 0 0% 7%;
    --radius: 0.25rem;
  }
}

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 2: Create `components/navbar.tsx`**

```typescript
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { cookies } from 'next/headers'
import { getCart } from '@/lib/shopify/queries/cart'
import { CART_COOKIE } from '@/lib/constants'

async function getCartCount(): Promise<number> {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) return 0
  const cart = await getCart(cartId)
  return cart?.totalQuantity ?? 0
}

export async function Navbar() {
  const cartCount = await getCartCount()

  return (
    <header className="border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs font-semibold tracking-[0.25em] uppercase text-foreground hover:opacity-70 transition-opacity"
        >
          Mundial Shop
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/selecciones"
            className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Selecciones
          </Link>
          <Link
            href="/paginas/envios-y-devoluciones"
            className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Envíos
          </Link>
        </div>

        <Link
          href="/carrito"
          className="flex items-center gap-1.5 text-xs tracking-wider uppercase hover:opacity-70 transition-opacity"
        >
          <ShoppingBag className="h-4 w-4" />
          {cartCount > 0 && (
            <span className="text-xs font-semibold">{cartCount}</span>
          )}
        </Link>
      </nav>
    </header>
  )
}
```

- [ ] **Step 3: Create `components/footer.tsx`**

```typescript
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between gap-6 text-xs text-muted-foreground">
        <p className="tracking-[0.2em] uppercase font-medium text-foreground">
          Mundial Shop
        </p>
        <div className="flex gap-8">
          <Link href="/selecciones" className="hover:text-foreground transition-colors uppercase tracking-wider">
            Selecciones
          </Link>
          <Link href="/paginas/guia-de-tallas" className="hover:text-foreground transition-colors uppercase tracking-wider">
            Guía de tallas
          </Link>
          <Link href="/paginas/envios-y-devoluciones" className="hover:text-foreground transition-colors uppercase tracking-wider">
            Envíos
          </Link>
          <Link href="/paginas/contacto" className="hover:text-foreground transition-colors uppercase tracking-wider">
            Contacto
          </Link>
        </div>
        <p className="tracking-wide">© 2026 Mundial Shop</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Update `app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mundial Shop — Playeras del Mundial 2026',
  description: '48 selecciones. Envío express a México. Playeras fan del Mundial 2026.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={GeistSans.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Install lucide-react if not already installed**

```bash
npm install lucide-react
```

- [ ] **Step 6: Verify dev server runs without errors**

```bash
npm run dev
```

Open http://localhost:3000. Expected: page with black top nav "MUNDIAL SHOP" and footer visible.

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx app/globals.css components/navbar.tsx components/footer.tsx
git commit -m "feat: add root layout, navbar, and footer"
```

---

## Task 7: Homepage

**Files:**
- Create: `components/hero.tsx`
- Create: `components/popular-teams-grid.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/hero.tsx`**

```typescript
import Link from 'next/link'

export function Hero() {
  return (
    <section className="bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-32">
        <p className="text-xs tracking-[0.3em] uppercase text-background/50 mb-4">
          Mundial 2026 · 48 Selecciones
        </p>
        <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight mb-2">
          Viste a tu
        </h1>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-10">
          selección
        </h1>
        <Link
          href="/selecciones"
          className="inline-block border border-background text-background text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-background hover:text-foreground transition-colors"
        >
          Ver colección →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `components/popular-teams-grid.tsx`**

```typescript
import Link from 'next/link'
import { getProducts } from '@/lib/shopify/queries/products'
import { formatPrice } from '@/lib/shopify/utils'

export async function PopularTeamsGrid() {
  const products = await getProducts({ first: 6 })

  if (products.length === 0) {
    return null
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-8">
        Más populares
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.slice(0, 6).map((product) => (
          <Link
            key={product.id}
            href={`/selecciones/${product.handle}`}
            className="group border border-border p-4 hover:border-foreground transition-colors"
          >
            <p className="text-xs tracking-wider uppercase text-muted-foreground mb-1">
              {product.metafields.find((m) => m?.key === 'confederacion')?.value ?? ''}
            </p>
            <p className="font-medium text-sm mb-2 group-hover:underline underline-offset-2">
              {product.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatPrice(
                product.priceRange.minVariantPrice.amount,
                product.priceRange.minVariantPrice.currencyCode
              )}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Update `app/page.tsx`**

```typescript
import { Hero } from '@/components/hero'
import { PopularTeamsGrid } from '@/components/popular-teams-grid'

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularTeamsGrid />
    </>
  )
}
```

- [ ] **Step 4: Verify page renders**

```bash
npm run dev
```

Open http://localhost:3000. Expected: dark hero section with headline + popular teams grid below (will be empty until products are added in Shopify).

- [ ] **Step 5: Commit**

```bash
git add components/hero.tsx components/popular-teams-grid.tsx app/page.tsx
git commit -m "feat: add homepage with hero and popular teams grid"
```

---

## Task 8: Catalog Page

**Files:**
- Create: `components/product-card.tsx`
- Create: `components/product-grid.tsx`
- Create: `components/confederation-filter.tsx`
- Create: `app/selecciones/page.tsx`

- [ ] **Step 1: Create `components/product-card.tsx`**

```typescript
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, getProductImages } from '@/lib/shopify/utils'
import type { ShopifyProduct } from '@/lib/shopify/types'

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const images = getProductImages(product)
  const { amount, currencyCode } = product.priceRange.minVariantPrice

  return (
    <Link
      href={`/selecciones/${product.handle}`}
      className="group block"
    >
      <div className="aspect-square bg-secondary mb-3 overflow-hidden relative">
        {images[0] ? (
          <Image
            src={images[0].url}
            alt={images[0].altText ?? product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {product.metafields.find((m) => m?.key === 'pais_emoji')?.value ?? '⚽'}
          </div>
        )}
      </div>
      <p className="text-xs tracking-wider uppercase text-muted-foreground mb-0.5">
        {product.metafields.find((m) => m?.key === 'confederacion')?.value ?? ''}
      </p>
      <p className="text-sm font-medium group-hover:underline underline-offset-2 mb-0.5">
        {product.title}
      </p>
      <p className="text-xs text-muted-foreground">
        {formatPrice(amount, currencyCode)}
      </p>
    </Link>
  )
}
```

- [ ] **Step 2: Create `components/confederation-filter.tsx`**

```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CONFEDERATION_OPTIONS } from '@/lib/constants'

export function ConfederationFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get('confederacion') ?? 'all'

  function handleSelect(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('confederacion')
    } else {
      params.set('confederacion', value)
    }
    router.push(`/selecciones?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {CONFEDERATION_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSelect(option.value)}
          className={`text-xs tracking-wider uppercase px-4 py-2 border transition-colors ${
            active === option.value
              ? 'border-foreground bg-foreground text-background'
              : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create `app/selecciones/page.tsx`**

```typescript
import { Suspense } from 'react'
import { getProducts } from '@/lib/shopify/queries/products'
import { ProductCard } from '@/components/product-card'
import { ConfederationFilter } from '@/components/confederation-filter'

export const metadata = {
  title: 'Selecciones — Mundial Shop',
}

type SearchParams = Promise<{ confederacion?: string }>

export default async function SeleccionesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { confederacion } = await searchParams

  const query = confederacion
    ? `metafield:custom.confederacion:${confederacion}`
    : undefined

  const products = await getProducts({ first: 50, query })

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">
        {confederacion ? `${confederacion} · ${products.length} selecciones` : `Todas las selecciones · ${products.length}`}
      </h1>

      <Suspense>
        <ConfederationFilter />
      </Suspense>

      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay playeras disponibles en esta categoría todavía.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify catalog renders**

```bash
npm run dev
```

Open http://localhost:3000/selecciones. Expected: heading + filter tabs + empty grid (until Shopify products are added).

- [ ] **Step 5: Commit**

```bash
git add components/product-card.tsx components/confederation-filter.tsx app/selecciones/page.tsx
git commit -m "feat: add catalog page with confederation filter"
```

---

## Task 9: Product Page

**Files:**
- Create: `components/version-selector.tsx`
- Create: `components/size-selector.tsx`
- Create: `components/add-to-cart-button.tsx`
- Create: `app/selecciones/[slug]/page.tsx`
- Create: `__tests__/components/size-selector.test.tsx`

- [ ] **Step 1: Write failing test for SizeSelector**

Create `__tests__/components/size-selector.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SizeSelector } from '@/components/size-selector'

describe('SizeSelector', () => {
  it('renders all sizes', () => {
    const onChange = vi.fn()
    render(
      <SizeSelector
        sizes={['S', 'M', 'L', 'XL', 'XXL']}
        selected="M"
        onChange={onChange}
      />
    )
    expect(screen.getByText('S')).toBeInTheDocument()
    expect(screen.getByText('M')).toBeInTheDocument()
    expect(screen.getByText('XXL')).toBeInTheDocument()
  })

  it('marks selected size visually', () => {
    const onChange = vi.fn()
    render(
      <SizeSelector
        sizes={['S', 'M', 'L']}
        selected="M"
        onChange={onChange}
      />
    )
    const mButton = screen.getByText('M').closest('button')
    expect(mButton).toHaveClass('bg-foreground')
  })

  it('calls onChange when a size is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SizeSelector
        sizes={['S', 'M', 'L']}
        selected="M"
        onChange={onChange}
      />
    )
    await user.click(screen.getByText('L'))
    expect(onChange).toHaveBeenCalledWith('L')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- __tests__/components/size-selector.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/size-selector'`

- [ ] **Step 3: Create `components/size-selector.tsx`**

```typescript
'use client'

type Props = {
  sizes: string[]
  selected: string
  onChange: (size: string) => void
}

export function SizeSelector({ sizes, selected, onChange }: Props) {
  return (
    <div>
      <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
        Talla
      </p>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={`w-12 h-10 text-xs font-medium border transition-colors ${
              selected === size
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-foreground hover:border-foreground'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm run test:run -- __tests__/components/size-selector.test.tsx
```

Expected: 3 tests PASS

- [ ] **Step 5: Create `components/version-selector.tsx`**

```typescript
'use client'

import { VERSIONS } from '@/lib/constants'

type Props = {
  selected: string
  onChange: (version: string) => void
}

export function VersionSelector({ selected, onChange }: Props) {
  return (
    <div>
      <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
        Versión
      </p>
      <div className="flex gap-2">
        {VERSIONS.map((version) => (
          <button
            key={version}
            onClick={() => onChange(version)}
            className={`flex-1 py-2.5 text-xs font-medium tracking-wider uppercase border transition-colors ${
              selected === version
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-foreground hover:border-foreground'
            }`}
          >
            {version}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create `components/add-to-cart-button.tsx`**

```typescript
'use client'

import { useState, useTransition } from 'react'
import { addItemToCart } from '@/app/actions/cart'

type Props = {
  variantId: string | undefined
  disabled?: boolean
}

export function AddToCartButton({ variantId, disabled }: Props) {
  const [isPending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)

  function handleClick() {
    if (!variantId) return

    startTransition(async () => {
      await addItemToCart(variantId)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    })
  }

  const isDisabled = disabled || !variantId || isPending

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`w-full py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors ${
        isDisabled
          ? 'bg-muted text-muted-foreground cursor-not-allowed'
          : 'bg-foreground text-background hover:bg-foreground/80'
      }`}
    >
      {isPending ? 'Agregando...' : added ? '¡Agregado!' : 'Agregar al carrito'}
    </button>
  )
}
```

- [ ] **Step 7: Create `components/product-page-client.tsx`**

```typescript
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  formatPrice,
  getVariantByOptions,
} from '@/lib/shopify/utils'
import { VersionSelector } from '@/components/version-selector'
import { SizeSelector } from '@/components/size-selector'
import { AddToCartButton } from '@/components/add-to-cart-button'
import type { ShopifyProduct, ShopifyVariant } from '@/lib/shopify/types'

type Props = {
  product: ShopifyProduct
  images: { url: string; altText: string | null }[]
  variants: ShopifyVariant[]
  confederation: string | null
  emoji: string | null
  shippingTime: string
  availableVersions: string[]
  availableSizes: string[]
}

export function ProductPageClient({
  product,
  images,
  variants,
  confederation,
  emoji,
  shippingTime,
  availableVersions,
  availableSizes,
}: Props) {
  const [selectedVersion, setSelectedVersion] = useState(availableVersions[0] ?? 'Local')
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] ?? 'M')
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const selectedVariant = getVariantByOptions(variants, {
    Versión: selectedVersion,
    Talla: selectedSize,
  })

  const price = selectedVariant
    ? formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
    : formatPrice(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode
      )

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-secondary relative mb-3 overflow-hidden">
            {images[activeImageIndex] ? (
              <Image
                src={images[activeImageIndex].url}
                alt={images[activeImageIndex].altText ?? product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                {emoji ?? '⚽'}
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((image, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-16 h-16 relative bg-secondary overflow-hidden border-2 transition-colors ${
                    activeImageIndex === i ? 'border-foreground' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText ?? `Vista ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          {confederation && (
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              {confederation}
            </span>
          )}
          <h1 className="text-2xl font-medium">{product.title}</h1>
          <p className="text-xl font-semibold">{price}</p>

          <VersionSelector selected={selectedVersion} onChange={setSelectedVersion} />
          <SizeSelector sizes={availableSizes} selected={selectedSize} onChange={setSelectedSize} />

          <div className="bg-secondary px-4 py-3 text-xs text-muted-foreground tracking-wide">
            📦 Envío estimado: {shippingTime} a México
          </div>

          <AddToCartButton
            variantId={selectedVariant?.id}
            disabled={!selectedVariant?.availableForSale}
          />

          <Link
            href="/paginas/guia-de-tallas"
            className="text-xs text-muted-foreground underline underline-offset-4 text-center hover:text-foreground transition-colors"
          >
            Consultar guía de tallas
          </Link>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-6">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Create `app/selecciones/[slug]/page.tsx`**

```typescript
import { notFound } from 'next/navigation'
import { getProductByHandle } from '@/lib/shopify/queries/products'
import {
  getProductImages,
  getProductVariants,
  extractMetafield,
} from '@/lib/shopify/utils'
import { SIZES, VERSIONS } from '@/lib/constants'
import { ProductPageClient } from '@/components/product-page-client'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getProductByHandle(slug)
  return { title: product ? `${product.title} — Mundial Shop` : 'Producto no encontrado' }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getProductByHandle(slug)

  if (!product) notFound()

  const images = getProductImages(product)
  const variants = getProductVariants(product)
  const confederation = extractMetafield(product.metafields, 'confederacion')
  const emoji = extractMetafield(product.metafields, 'pais_emoji')
  const shippingTime = extractMetafield(product.metafields, 'tiempo_envio') ?? '10–15 días'

  const availableVersions = VERSIONS.filter((v) =>
    variants.some((variant) =>
      variant.selectedOptions.some((opt) => opt.name === 'Versión' && opt.value === v)
    )
  ) as string[]

  const availableSizes = SIZES.filter((s) =>
    variants.some((variant) =>
      variant.selectedOptions.some((opt) => opt.name === 'Talla' && opt.value === s)
    )
  ) as string[]

  return (
    <ProductPageClient
      product={product}
      images={images}
      variants={variants}
      confederation={confederation}
      emoji={emoji}
      shippingTime={shippingTime}
      availableVersions={availableVersions}
      availableSizes={availableSizes}
    />
  )
}

- [ ] **Step 8: Run all tests**

```bash
npm run test:run
```

Expected: all tests PASS

- [ ] **Step 9: Commit**

```bash
git add components/version-selector.tsx components/size-selector.tsx components/add-to-cart-button.tsx app/selecciones/ components/product-page-client.tsx __tests__/components/
git commit -m "feat: add product page with variant selectors and add-to-cart"
```

---

## Task 10: Cart Page

**Files:**
- Create: `components/cart-line-item.tsx`
- Create: `app/carrito/page.tsx`

- [ ] **Step 1: Create `components/cart-line-item.tsx`**

```typescript
'use client'

import Image from 'next/image'
import { useTransition } from 'react'
import { X } from 'lucide-react'
import { removeItemFromCart } from '@/app/actions/cart'
import { formatPrice } from '@/lib/shopify/utils'
import type { ShopifyCartLine } from '@/lib/shopify/types'

export function CartLineItem({ line }: { line: ShopifyCartLine }) {
  const [isPending, startTransition] = useTransition()
  const image = line.merchandise.product.images.edges[0]?.node

  function handleRemove() {
    startTransition(async () => {
      await removeItemFromCart(line.id)
    })
  }

  return (
    <div className={`flex gap-4 py-4 border-b border-border ${isPending ? 'opacity-50' : ''}`}>
      {image && (
        <div className="relative w-20 h-20 flex-shrink-0 bg-secondary overflow-hidden">
          <Image
            src={image.url}
            alt={image.altText ?? line.merchandise.product.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {line.merchandise.product.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {line.merchandise.selectedOptions.map((o) => o.value).join(' · ')}
        </p>
        <p className="text-xs font-semibold mt-1">
          {formatPrice(
            line.cost.totalAmount.amount,
            line.cost.totalAmount.currencyCode
          )}
          {line.quantity > 1 && (
            <span className="text-muted-foreground font-normal"> × {line.quantity}</span>
          )}
        </p>
      </div>
      <button
        onClick={handleRemove}
        disabled={isPending}
        className="self-start p-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Eliminar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/carrito/page.tsx`**

```typescript
import Link from 'next/link'
import { cookies } from 'next/headers'
import { getCart } from '@/lib/shopify/queries/cart'
import { CART_COOKIE } from '@/lib/constants'
import { formatPrice } from '@/lib/shopify/utils'
import { CartLineItem } from '@/components/cart-line-item'

export const metadata = { title: 'Carrito — Mundial Shop' }

export default async function CartPage() {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  const cart = cartId ? await getCart(cartId) : null
  const lines = cart?.lines.edges.map((e) => e.node) ?? []

  if (lines.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-6">
          Tu carrito está vacío
        </p>
        <Link
          href="/selecciones"
          className="text-xs tracking-wider uppercase border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors"
        >
          Ver selecciones →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">
        Carrito · {cart?.totalQuantity} artículo{(cart?.totalQuantity ?? 0) > 1 ? 's' : ''}
      </h1>

      <div className="mb-8">
        {lines.map((line) => (
          <CartLineItem key={line.id} line={line} />
        ))}
      </div>

      <div className="border-t border-foreground pt-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-xs tracking-wider uppercase">Total</span>
          <span className="text-lg font-semibold">
            {cart && formatPrice(
              cart.cost.totalAmount.amount,
              cart.cost.totalAmount.currencyCode
            )}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Envío calculado al finalizar la compra.
        </p>
        {cart && (
          <a
            href={cart.checkoutUrl}
            className="w-full py-3.5 bg-foreground text-background text-xs font-semibold tracking-[0.2em] uppercase text-center hover:bg-foreground/80 transition-colors"
          >
            Ir al checkout →
          </a>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify cart page renders**

```bash
npm run dev
```

Open http://localhost:3000/carrito. Expected: empty cart state with "Ver selecciones" link.

- [ ] **Step 4: Commit**

```bash
git add components/cart-line-item.tsx app/carrito/page.tsx
git commit -m "feat: add cart page with line items and Shopify checkout link"
```

---

## Task 11: Static Pages

**Files:**
- Create: `app/paginas/guia-de-tallas/page.tsx`
- Create: `app/paginas/envios-y-devoluciones/page.tsx`
- Create: `app/paginas/contacto/page.tsx`

- [ ] **Step 1: Create `app/paginas/guia-de-tallas/page.tsx`**

```typescript
export const metadata = { title: 'Guía de tallas — Mundial Shop' }

const SIZE_CHART = [
  { talla: 'S', pecho: '86–91 cm', cintura: '71–76 cm', cadera: '86–91 cm' },
  { talla: 'M', pecho: '91–97 cm', cintura: '76–81 cm', cadera: '91–97 cm' },
  { talla: 'L', pecho: '97–102 cm', cintura: '81–86 cm', cadera: '97–102 cm' },
  { talla: 'XL', pecho: '107–112 cm', cintura: '91–97 cm', cadera: '107–112 cm' },
  { talla: 'XXL', pecho: '117–122 cm', cintura: '102–107 cm', cadera: '117–122 cm' },
]

export default function GuidePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">
        Guía de tallas
      </h1>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        Todas las tallas son unisex. Para un ajuste regular, elige tu talla habitual. Para un ajuste más holgado, sube una talla.
      </p>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-foreground">
            <th className="text-left py-2 text-xs tracking-wider uppercase text-muted-foreground font-medium">Talla</th>
            <th className="text-left py-2 text-xs tracking-wider uppercase text-muted-foreground font-medium">Pecho</th>
            <th className="text-left py-2 text-xs tracking-wider uppercase text-muted-foreground font-medium">Cintura</th>
            <th className="text-left py-2 text-xs tracking-wider uppercase text-muted-foreground font-medium">Cadera</th>
          </tr>
        </thead>
        <tbody>
          {SIZE_CHART.map((row) => (
            <tr key={row.talla} className="border-b border-border">
              <td className="py-3 font-semibold">{row.talla}</td>
              <td className="py-3 text-muted-foreground">{row.pecho}</td>
              <td className="py-3 text-muted-foreground">{row.cintura}</td>
              <td className="py-3 text-muted-foreground">{row.cadera}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/paginas/envios-y-devoluciones/page.tsx`**

```typescript
export const metadata = { title: 'Envíos y devoluciones — Mundial Shop' }

export default function ShippingPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">
        Envíos y devoluciones
      </h1>
      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase font-semibold mb-3">Envíos a México</h2>
          <p className="text-muted-foreground">
            Todos los pedidos se envían directamente desde nuestro proveedor vía DHL o FedEx Express. El tiempo estimado de entrega es de <strong className="text-foreground">10 a 15 días hábiles</strong> a partir de la confirmación del pago.
          </p>
        </section>
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase font-semibold mb-3">Seguimiento</h2>
          <p className="text-muted-foreground">
            Recibirás un email con tu número de rastreo en cuanto tu pedido sea despachado. Puedes rastrear tu envío directamente en el sitio de DHL o FedEx.
          </p>
        </section>
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase font-semibold mb-3">Devoluciones</h2>
          <p className="text-muted-foreground">
            Aceptamos cambios por talla incorrecta dentro de los 15 días de recibido el pedido, siempre que la playera esté en condiciones originales (sin usar, sin lavado, con etiquetas). El costo de envío de regreso corre por cuenta del comprador.
          </p>
        </section>
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase font-semibold mb-3">Envíos internacionales</h2>
          <p className="text-muted-foreground">
            También enviamos a otros países de LATAM. Los tiempos de entrega y costos pueden variar. Contáctanos antes de hacer tu pedido si estás fuera de México.
          </p>
        </section>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `app/paginas/contacto/page.tsx`**

```typescript
export const metadata = { title: 'Contacto — Mundial Shop' }

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">
        Contacto
      </h1>
      <div className="space-y-6 text-sm">
        <p className="text-muted-foreground leading-relaxed">
          ¿Tienes preguntas sobre tu pedido, tallas o envíos? Escríbenos y te respondemos en menos de 24 horas.
        </p>
        <div className="space-y-2">
          <p className="text-xs tracking-wider uppercase text-muted-foreground">Email</p>
          <a
            href="mailto:hola@mundialshop.mx"
            className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            hola@mundialshop.mx
          </a>
        </div>
        <div className="space-y-2">
          <p className="text-xs tracking-wider uppercase text-muted-foreground">WhatsApp</p>
          <a
            href="https://wa.me/521XXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            +52 1 (XX) XXXX-XXXX
          </a>
        </div>
      </div>
    </div>
  )
}
```

**Note:** Replace `hola@mundialshop.mx` and the WhatsApp number with your real contact details before going live.

- [ ] **Step 4: Commit**

```bash
git add app/paginas/
git commit -m "feat: add static pages (size guide, shipping policy, contact)"
```

---

## Task 12: Vercel Deployment

**Files:**
- Create: `vercel.ts` (or use `vercel.json` if `@vercel/config` is not yet stable)

- [ ] **Step 1: Create `.gitignore` additions**

Make sure `.gitignore` includes:

```
.env.local
.env*.local
.superpowers/
```

- [ ] **Step 2: Push to GitHub**

Create a new GitHub repository and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/world-cup-tshirts.git
git push -u origin main
```

- [ ] **Step 3: Create Vercel project**

```bash
npx vercel link
```

When prompted, connect to your GitHub repo.

- [ ] **Step 4: Add environment variables in Vercel**

In Vercel Dashboard → Settings → Environment Variables, add:

```
SHOPIFY_STORE_DOMAIN       = your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN = your_token_here
```

Set both for Production, Preview, and Development environments.

- [ ] **Step 5: Deploy**

```bash
npx vercel --prod
```

Expected: deployment URL printed. Open it and verify the store loads.

- [ ] **Step 6: Connect custom domain (optional)**

In Vercel Dashboard → Domains, add `mundialshop.mx` (or your chosen domain) and follow DNS configuration instructions.

---

## Task 13: Shopify Setup Checklist

This task is done in the Shopify Admin, not in code.

- [ ] Create Shopify store at shopify.com (Basic plan, $39/mo)
- [ ] Settings → Apps → Develop apps → Create app → Enable Storefront API with scopes: `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`
- [ ] Copy Storefront Access Token to `.env.local` and Vercel env vars
- [ ] Install **DSers** app from Shopify App Store (free plan)
- [ ] Install **Mercado Pago** app from Shopify App Store
- [ ] Connect Stripe in Settings → Payments
- [ ] Create products for first 5 test jerseys with:
  - Title: "Playera Fan México 2026"
  - Handle: `playera-fan-mexico-2026`
  - Two options: "Versión" (Local, Visitante) and "Talla" (S, M, L, XL, XXL)
  - Metafields (add in Settings → Custom data → Products):
    - `custom.confederacion` (single line text)
    - `custom.pais_emoji` (single line text)
    - `custom.tiempo_envio` (single line text)
  - At least 2 product images (local jersey + away jersey)
  - Price in MXN
- [ ] In DSers: link your DHgate or SoccerDeal supplier account and map each product variant to the supplier SKU
- [ ] Place a test order end-to-end to verify: checkout → payment → DSers forwarding → tracking email

---

## Running All Tests

```bash
npm run test:run
```

Expected output:
```
✓ __tests__/lib/shopify/client.test.ts (3)
✓ __tests__/lib/shopify/utils.test.ts (7)
✓ __tests__/components/size-selector.test.tsx (3)

Test Files  3 passed (3)
Tests       13 passed (13)
```
