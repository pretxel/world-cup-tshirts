export const metadata = { title: 'Guía de tallas — Mundial Shop' }

const SIZE_CHART = [
  { talla: 'S', pecho: '86–91 cm', cintura: '71–76 cm', cadera: '86–91 cm' },
  { talla: 'M', pecho: '91–97 cm', cintura: '76–81 cm', cadera: '91–97 cm' },
  { talla: 'L', pecho: '97–102 cm', cintura: '81–86 cm', cadera: '97–102 cm' },
  { talla: 'XL', pecho: '107–112 cm', cintura: '91–97 cm', cadera: '107–112 cm' },
  { talla: 'XXL', pecho: '117–122 cm', cintura: '102–107 cm', cadera: '117–122 cm' },
]

export default function GuidePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">
        Guía de tallas
      </h1>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        Todas las tallas son unisex. Para un ajuste regular, elige tu talla habitual. Para un ajuste más holgado, sube una talla.
      </p>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-foreground">
            <th className="text-left py-2 text-xs tracking-wider uppercase text-muted-foreground font-medium">Talla</th>
            <th className="text-left py-2 text-xs tracking-wider uppercase text-muted-foreground font-medium">Pecho</th>
            <th className="text-left py-2 text-xs tracking-wider uppercase text-muted-foreground font-medium">Cintura</th>
            <th className="text-left py-2 text-xs tracking-wider uppercase text-muted-foreground font-medium">Cadera</th>
          </tr>
        </thead>
        <tbody>
          {SIZE_CHART.map((row) => (
            <tr key={row.talla} className="border-b border-border">
              <td className="py-3 font-semibold">{row.talla}</td>
              <td className="py-3 text-muted-foreground">{row.pecho}</td>
              <td className="py-3 text-muted-foreground">{row.cintura}</td>
              <td className="py-3 text-muted-foreground">{row.cadera}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
