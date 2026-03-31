import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  extractMetafield,
  getVariantByOptions,
  getProductImages,
  getProductVariants,
} from '@/lib/shopify/utils'
import type { ShopifyProduct, ShopifyVariant } from '@/lib/shopify/types'

describe('formatPrice', () => {
  it('formats MXN price without decimals when zero cents', () => {
    expect(formatPrice('599.00', 'MXN')).toBe('$599 MXN')
  })

  it('keeps decimals when non-zero cents', () => {
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

describe('getProductVariants', () => {
  const product = {
    variants: {
      edges: [
        { node: { id: 'v1', title: 'Local / M' } },
        { node: { id: 'v2', title: 'Visitante / L' } },
      ],
    },
  } as unknown as ShopifyProduct

  it('returns variants array from edges', () => {
    const variants = getProductVariants(product)
    expect(variants).toHaveLength(2)
    expect(variants[0].id).toBe('v1')
  })
})
