import Link from 'next/link'
import { getProducts } from '@/lib/shopify/queries/products'
import { formatPrice, extractMetafield } from '@/lib/shopify/utils'

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
              {extractMetafield(product.metafields, 'confederacion') ?? ''}
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
