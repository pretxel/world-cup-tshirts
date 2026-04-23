import type { ShopifyProduct } from '@/lib/shopify/types'
import { extractMetafield } from '@/lib/shopify/utils'

type Props = {
  product: ShopifyProduct
  images: { url: string; altText: string | null }[]
}

export function ProductSchema({ product, images }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || `Playera oficial de ${product.title} para el Mundial 2026`,
    image: images.map((img) => img.url),
    brand: {
      '@type': 'Brand',
      name: 'Mundial Shop',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      availability: 'https://schema.org/InStock',
      url: `https://mundialshop.com/selecciones/${product.handle}`,
      seller: {
        '@type': 'Organization',
        name: 'Mundial Shop',
      },
    },
    category: 'Sporting Goods > Team Sports > Soccer > Clothing',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Confederación',
        value: extractMetafield(product.metafields, 'confederacion') || 'Mundial',
      },
      {
        '@type': 'PropertyValue',
        name: 'Evento',
        value: 'Copa Mundial FIFA 2026',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
