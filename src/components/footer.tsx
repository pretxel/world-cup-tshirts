import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between gap-6 text-xs text-muted-foreground">
        <p className="tracking-[0.2em] uppercase font-medium text-foreground">
          Mundial Shop
        </p>
        <div className="flex gap-8">
          <Link href="/selecciones" className="hover:text-foreground transition-colors uppercase tracking-wider">
            Selecciones
          </Link>
          <Link href="/paginas/guia-de-tallas" className="hover:text-foreground transition-colors uppercase tracking-wider">
            Guía de tallas
          </Link>
          <Link href="/paginas/envios-y-devoluciones" className="hover:text-foreground transition-colors uppercase tracking-wider">
            Envíos
          </Link>
          <Link href="/paginas/contacto" className="hover:text-foreground transition-colors uppercase tracking-wider">
            Contacto
          </Link>
        </div>
        <p className="tracking-wide">© 2026 Mundial Shop</p>
      </div>
    </footer>
  )
}
