import { cacheLife, cacheTag } from 'next/cache'
import { shopifyFetch } from '../client'
import type { ShopifyProduct } from '../types'

// Fragmento ligero para listados (1 imagen, info básica)
const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCardFragment on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      edges {
        node {
          url
          altText
        }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "confederacion" }
      { namespace: "custom", key: "team" }
      { namespace: "custom", key: "pais_emoji" }
    ]) {
      key
      value
    }
  }
`


const PRODUCT_DETAIL_FRAGMENT = `
  fragment ProductDetailFragment on Product {
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
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 100) {
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
      { namespace: "custom", key: "team" }
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
    edges: { node: ShopifyProduct; cursor: string }[]
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      endCursor: string | null
      startCursor: string | null
    }
  }
}

export async function getProducts(options?: {
  first?: number
  after?: string
  query?: string
}): Promise<{
  products: ShopifyProduct[]
  pageInfo: GetProductsResponse['products']['pageInfo']
}> {
  'use cache'
  cacheTag('products')
  cacheLife('hours')

  const data = await shopifyFetch<GetProductsResponse>({
    query: `
      ${PRODUCT_CARD_FRAGMENT}
      query GetProducts($first: Int!, $after: String, $query: String) {
        products(first: $first, after: $after, query: $query) {
          edges {
            cursor
            node {
              ...ProductCardFragment
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
        }
      }
    `,
    variables: {
      first: options?.first ?? 50,
      after: options?.after,
      query: options?.query,
    },
    cache: 'force-cache',
  })

  return {
    products: data.products.edges.map((e) => e.node),
    pageInfo: data.products.pageInfo,
  }
}

type GetProductByHandleResponse = {
  productByHandle: ShopifyProduct | null
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  'use cache'
  cacheTag('products', `product-${handle}`)
  cacheLife({
    stale: 3600,      // 1 hour - serve stale while revalidating
    revalidate: 7200, // 2 hours - background revalidation
    expire: 86400,    // 1 day - hard expiration
  })

  const data = await shopifyFetch<GetProductByHandleResponse>({
    query: `
      ${PRODUCT_DETAIL_FRAGMENT}
      query GetProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          ...ProductDetailFragment
        }
      }
    `,
    variables: { handle },
    cache: 'force-cache',
  })

  return data.productByHandle
}
