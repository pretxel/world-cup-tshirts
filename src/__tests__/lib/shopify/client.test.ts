import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shopifyFetch } from '@/lib/shopify/client'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  vi.clearAllMocks()
  process.env.SHOPIFY_STORE_DOMAIN = 'test-store.myshopify.com'
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'test-token'
})

describe('shopifyFetch', () => {
  it('returns data on successful response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { products: [] } }),
    })

    const result = await shopifyFetch<{ products: unknown[] }>({
      query: '{ products(first: 1) { edges { node { id } } } }',
    })

    expect(result).toEqual({ products: [] })
  })

  it('throws on HTTP error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })

    await expect(
      shopifyFetch({ query: '{ products(first: 1) { edges { node { id } } } }' })
    ).rejects.toThrow('Shopify API error: 401')
  })

  it('throws on GraphQL errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ errors: [{ message: 'Field not found' }] }),
    })

    await expect(
      shopifyFetch({ query: '{ bad }' })
    ).rejects.toThrow('Field not found')
  })
})
