'use client'

import { useState, useTransition } from 'react'
import { addItemToCart } from '@/app/actions/cart'

type Props = {
  variantId: string | undefined
  disabled?: boolean
}

export function AddToCartButton({ variantId, disabled }: Props) {
  const [isPending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)

  function handleClick() {
    if (!variantId) return

    startTransition(async () => {
      await addItemToCart(variantId)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    })
  }

  const isDisabled = disabled || !variantId || isPending

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`w-full py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors ${
        isDisabled
          ? 'bg-muted text-muted-foreground cursor-not-allowed'
          : 'bg-foreground text-background hover:bg-foreground/80'
      }`}
    >
      {isPending ? 'Agregando...' : added ? '¡Agregado!' : 'Agregar al carrito'}
    </button>
  )
}
