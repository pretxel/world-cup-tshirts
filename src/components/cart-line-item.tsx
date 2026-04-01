'use client'

import Image from 'next/image'
import { useTransition } from 'react'
import { X } from 'lucide-react'
import { removeItemFromCart } from '@/app/actions/cart'
import { formatPrice } from '@/lib/shopify/utils'
import type { ShopifyCartLine } from '@/lib/shopify/types'

export function CartLineItem({ line }: { line: ShopifyCartLine }) {
  const [isPending, startTransition] = useTransition()
  const image = line.merchandise.product.images.edges[0]?.node

  function handleRemove() {
    startTransition(async () => {
      await removeItemFromCart(line.id)
    })
  }

  return (
    <div className={`flex gap-4 py-4 border-b border-border ${isPending ? 'opacity-50' : ''}`}>
      {image && (
        <div className="relative w-20 h-20 flex-shrink-0 bg-secondary overflow-hidden">
          <Image
            src={image.url}
            alt={image.altText ?? line.merchandise.product.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {line.merchandise.product.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {line.merchandise.selectedOptions.map((o) => o.value).join(' · ')}
        </p>
        <p className="text-xs font-semibold mt-1">
          {formatPrice(
            line.cost.totalAmount.amount,
            line.cost.totalAmount.currencyCode
          )}
          {line.quantity > 1 && (
            <span className="text-muted-foreground font-normal"> × {line.quantity}</span>
          )}
        </p>
      </div>
      <button
        onClick={handleRemove}
        disabled={isPending}
        className="self-start p-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Eliminar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
