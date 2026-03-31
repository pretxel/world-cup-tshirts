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
