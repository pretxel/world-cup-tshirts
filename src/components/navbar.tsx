import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { cookies } from 'next/headers'
import { getCart } from '@/lib/shopify/queries/cart'
import { CART_COOKIE } from '@/lib/constants'

async function getCartCount(): Promise<number> {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) return 0
  const cart = await getCart(cartId)
  return cart?.totalQuantity ?? 0
}

export async function Navbar() {
  const cartCount = await getCartCount()

  return (
    <header className="border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs font-semibold tracking-[0.25em] uppercase text-foreground hover:opacity-70 transition-opacity"
        >
          Mundial Shop
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/selecciones"
            className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Selecciones
          </Link>
          <Link
            href="/paginas/envios-y-devoluciones"
            className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Envíos
          </Link>
        </div>

        <Link
          href="/carrito"
          className="flex items-center gap-1.5 text-xs tracking-wider uppercase hover:opacity-70 transition-opacity"
        >
          <ShoppingBag className="h-4 w-4" />
          {cartCount > 0 && (
            <span className="text-xs font-semibold">{cartCount}</span>
          )}
        </Link>
      </nav>
    </header>
  )
}
