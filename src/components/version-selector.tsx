'use client'

import { VERSIONS } from '@/lib/constants'

type Props = {
  selected: string
  onChange: (version: string) => void
}

export function VersionSelector({ selected, onChange }: Props) {
  return (
    <div>
      <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
        Versión
      </p>
      <div className="flex gap-2">
        {VERSIONS.map((version) => (
          <button
            key={version}
            onClick={() => onChange(version)}
            className={`flex-1 py-2.5 text-xs font-medium tracking-wider uppercase border transition-colors ${
              selected === version
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-foreground hover:border-foreground'
            }`}
          >
            {version}
          </button>
        ))}
      </div>
    </div>
  )
}
