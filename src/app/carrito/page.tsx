import Link from 'next/link'
import { cookies } from 'next/headers'
import { getCart } from '@/lib/shopify/queries/cart'
import { CART_COOKIE } from '@/lib/constants'
import { formatPrice } from '@/lib/shopify/utils'
import { CartLineItem } from '@/components/cart-line-item'

export const metadata = { title: 'Carrito — Mundial Shop' }

export default async function CartPage() {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  const cart = cartId ? await getCart(cartId) : null
  const lines = cart?.lines.edges.map((e) => e.node) ?? []

  if (lines.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-6">
          Tu carrito está vacío
        </p>
        <Link
          href="/selecciones"
          className="text-xs tracking-wider uppercase border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors"
        >
          Ver selecciones →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">
        Carrito · {cart?.totalQuantity} artículo{(cart?.totalQuantity ?? 0) > 1 ? 's' : ''}
      </h1>

      <div className="mb-8">
        {lines.map((line) => (
          <CartLineItem key={line.id} line={line} />
        ))}
      </div>

      <div className="border-t border-foreground pt-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-xs tracking-wider uppercase">Total</span>
          <span className="text-lg font-semibold">
            {cart && formatPrice(
              cart.cost.totalAmount.amount,
              cart.cost.totalAmount.currencyCode
            )}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Envío calculado al finalizar la compra.
        </p>
        {cart && (
          <a
            href={cart.checkoutUrl}
            className="w-full py-3.5 bg-foreground text-background text-xs font-semibold tracking-[0.2em] uppercase text-center hover:bg-foreground/80 transition-colors block"
          >
            Ir al checkout →
          </a>
        )}
      </div>
    </div>
  )
}
