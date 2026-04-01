import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mundial Shop — Playeras del Mundial 2026',
  description: '48 selecciones. Envío express a México. Playeras fan del Mundial 2026.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={GeistSans.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
