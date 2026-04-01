import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, getProductImages, extractMetafield } from '@/lib/shopify/utils'
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
            {extractMetafield(product.metafields, 'pais_emoji') ?? '⚽'}
          </div>
        )}
      </div>
      <p className="text-xs tracking-wider uppercase text-muted-foreground mb-0.5">
        {extractMetafield(product.metafields, 'confederacion') ?? ''}
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
