import type { Metadata } from 'next'
import { Suspense } from 'react'
import { GeistSans } from 'geist/font/sans'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { OrganizationSchema } from '@/components/structured-data/organization-schema'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://mundialshop.com'),
  title: {
    default: 'Mundial Shop — Playeras Oficiales del Mundial 2026',
    template: '%s | Mundial Shop',
  },
  description:
    '48 selecciones del Mundial 2026. Envío express a México. Playeras originales de tu selección favorita. Calidad premium garantizada.',
  keywords: [
    'playeras mundial 2026',
    'camisetas futbol',
    'jersey selección nacional',
    'mundial fifa 2026',
    'playeras oficiales',
    'envío méxico',
  ],
  authors: [{ name: 'Mundial Shop' }],
  creator: 'Mundial Shop',
  publisher: 'Mundial Shop',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://mundialshop.com',
    siteName: 'Mundial Shop',
    title: 'Mundial Shop — Playeras Oficiales del Mundial 2026',
    description: '48 selecciones. Envío express a México. Playeras fan del Mundial 2026.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mundial Shop - Playeras del Mundial 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mundial Shop — Playeras del Mundial 2026',
    description: '48 selecciones. Envío express a México.',
    images: ['/og-image.jpg'],
    creator: '@mundialshop',
  },
  verification: {
    google: 'google-site-verification-code', // TODO: Reemplazar con código real
  },
  alternates: {
    canonical: 'https://mundialshop.com',
  },
}

function NavbarFallback() {
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
        </Link>
      </nav>
    </header>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <OrganizationSchema />
      </head>
      <body className={GeistSans.className}>
        <Suspense fallback={<NavbarFallback />}>
          <Navbar />
        </Suspense>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
