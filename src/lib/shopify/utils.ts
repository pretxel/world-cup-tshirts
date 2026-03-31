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
