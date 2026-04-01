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
  return {
    title: product ? `${product.title} — Mundial Shop` : 'Producto no encontrado',
  }
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
