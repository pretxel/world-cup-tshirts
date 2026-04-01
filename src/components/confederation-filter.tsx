'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CONFEDERATION_OPTIONS } from '@/lib/constants'

export function ConfederationFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get('confederacion') ?? 'all'

  function handleSelect(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('confederacion')
    } else {
      params.set('confederacion', value)
    }
    router.push(`/selecciones?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {CONFEDERATION_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSelect(option.value)}
          className={`text-xs tracking-wider uppercase px-4 py-2 border transition-colors ${
            active === option.value
              ? 'border-foreground bg-foreground text-background'
              : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
