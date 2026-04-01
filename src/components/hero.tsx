import Link from 'next/link'

export function Hero() {
  return (
    <section className="bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-32">
        <p className="text-xs tracking-[0.3em] uppercase text-background/50 mb-4">
          Mundial 2026 · 48 Selecciones
        </p>
        <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight mb-2">
          Viste a tu
        </h1>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-10">
          selección
        </h1>
        <Link
          href="/selecciones"
          className="inline-block border border-background text-background text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-background hover:text-foreground transition-colors"
        >
          Ver colección →
        </Link>
      </div>
    </section>
  )
}
