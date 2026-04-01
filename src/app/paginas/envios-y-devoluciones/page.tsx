export const metadata = { title: 'Envíos y devoluciones — Mundial Shop' }

export default function ShippingPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">
        Envíos y devoluciones
      </h1>
      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase font-semibold mb-3">Envíos a México</h2>
          <p className="text-muted-foreground">
            Todos los pedidos se envían directamente desde nuestro proveedor vía DHL o FedEx Express. El tiempo estimado de entrega es de <strong className="text-foreground">10 a 15 días hábiles</strong> a partir de la confirmación del pago.
          </p>
        </section>
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase font-semibold mb-3">Seguimiento</h2>
          <p className="text-muted-foreground">
            Recibirás un email con tu número de rastreo en cuanto tu pedido sea despachado. Puedes rastrear tu envío directamente en el sitio de DHL o FedEx.
          </p>
        </section>
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase font-semibold mb-3">Devoluciones</h2>
          <p className="text-muted-foreground">
            Aceptamos cambios por talla incorrecta dentro de los 15 días de recibido el pedido, siempre que la playera esté en condiciones originales (sin usar, sin lavado, con etiquetas). El costo de envío de regreso corre por cuenta del comprador.
          </p>
        </section>
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase font-semibold mb-3">Envíos internacionales</h2>
          <p className="text-muted-foreground">
            También enviamos a otros países de LATAM. Los tiempos de entrega y costos pueden variar. Contáctanos antes de hacer tu pedido si estás fuera de México.
          </p>
        </section>
      </div>
    </div>
  )
}
