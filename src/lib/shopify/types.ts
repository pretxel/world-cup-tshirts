export type ShopifyImage = {
  url: string
  altText: string | null
}

export type ShopifySelectedOption = {
  name: string
  value: string
}

export type ShopifyVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: {
    amount: string
    currencyCode: string
  }
  selectedOptions: ShopifySelectedOption[]
}

export type ShopifyMetafield = {
  key: string
  value: string
} | null

export type ShopifyProduct = {
  id: string
  title: string
  handle: string
  description: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: { node: ShopifyImage }[]
  }
  variants: {
    edges: { node: ShopifyVariant }[]
  }
  metafields: (ShopifyMetafield)[]
}

export type ShopifyCartLine = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    selectedOptions: ShopifySelectedOption[]
    product: {
      title: string
      handle: string
      images: {
        edges: { node: ShopifyImage }[]
      }
    }
  }
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
}

export type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
  lines: {
    edges: { node: ShopifyCartLine }[]
  }
}
