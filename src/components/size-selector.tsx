'use client'

type Props = {
  sizes: string[]
  selected: string
  onChange: (size: string) => void
}

export function SizeSelector({ sizes, selected, onChange }: Props) {
  return (
    <div>
      <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
        Talla
      </p>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={`w-12 h-10 text-xs font-medium border transition-colors ${
              selected === size
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-foreground hover:border-foreground'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
