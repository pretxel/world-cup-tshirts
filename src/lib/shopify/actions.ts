'use server'

import { revalidateTag } from 'next/cache'

/**
 * Revalidate all products in the background
 * Use after bulk product updates in Shopify
 */
export async function revalidateProducts() {
  revalidateTag('products', 'hours')
}

/**
 * Revalidate a specific product by handle
 * Use after updating a single product in Shopify
 */
export async function revalidateProduct(handle: string) {
  revalidateTag(`product-${handle}`, 'hours')
  revalidateTag('products', 'hours') // Also revalidate the list
}

/**
 * Force immediate cache update for a product
 * Use when you need the change visible in the same request
 */
export async function updateProductCache(handle: string) {
  const { updateTag } = await import('next/cache')
  updateTag(`product-${handle}`)
  updateTag('products')
}
