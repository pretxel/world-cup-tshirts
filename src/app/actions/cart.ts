'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  createCart,
  addToCart,
  removeFromCart,
} from '@/lib/shopify/queries/cart'
import { CART_COOKIE } from '@/lib/constants'

async function getOrCreateCartId(): Promise<string> {
  const cookieStore = await cookies()
  const existingId = cookieStore.get(CART_COOKIE)?.value

  if (existingId) return existingId

  const cart = await createCart()
  cookieStore.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return cart.id
}

export async function addItemToCart(variantId: string) {
  const cartId = await getOrCreateCartId()
  await addToCart(cartId, variantId)
  revalidatePath('/carrito')
}

export async function removeItemFromCart(lineId: string) {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) return
  await removeFromCart(cartId, lineId)
  revalidatePath('/carrito')
}
