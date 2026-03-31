export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  revalidate,
}: {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  revalidate?: number
}): Promise<T> {
  const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token':
        process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    ...(revalidate !== undefined
      ? { next: { revalidate } }
      : { cache }),
  })

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`)
  }

  const json = await response.json()

  if (json.errors) {
    throw new Error(json.errors[0].message)
  }

  return json.data as T
}
