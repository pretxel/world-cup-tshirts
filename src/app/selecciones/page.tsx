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
        {confederacion
          ? `${confederacion} · ${products.length} selecciones`
          : `Todas las selecciones · ${products.length}`}
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
