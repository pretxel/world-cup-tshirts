export const metadata = { title: 'Contacto — Mundial Shop' }

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">
        Contacto
      </h1>
      <div className="space-y-6 text-sm">
        <p className="text-muted-foreground leading-relaxed">
          ¿Tienes preguntas sobre tu pedido, tallas o envíos? Escríbenos y te respondemos en menos de 24 horas.
        </p>
        <div className="space-y-2">
          <p className="text-xs tracking-wider uppercase text-muted-foreground">Email</p>
          <a
            href="mailto:hola@mundialshop.mx"
            className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            hola@mundialshop.mx
          </a>
        </div>
        <div className="space-y-2">
          <p className="text-xs tracking-wider uppercase text-muted-foreground">WhatsApp</p>
          <a
            href="https://wa.me/521XXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            +52 1 (XX) XXXX-XXXX
          </a>
        </div>
      </div>
    </div>
  )
}
