'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  endCursor: string | null
  startCursor: string | null
}

export function ProductPagination({ hasNextPage, hasPreviousPage, endCursor }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleNext = () => {
    if (!endCursor) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('after', endCursor)
    router.push(`?${params.toString()}`)
  }

  const handlePrevious = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('after')
    router.push(`?${params.toString()}`)
  }

  if (!hasNextPage && !hasPreviousPage) {
    return null
  }

  return (
    <div className="flex justify-center gap-4 mt-12">
      <button
      type='button'
        onClick={handlePrevious}
        disabled={!hasPreviousPage}
        className="px-6 py-3 border border-border disabled:opacity-30 disabled:cursor-not-allowed hover:border-foreground transition-colors text-xs tracking-wider uppercase"
      >
        ← Anterior
      </button>
      <button
      type='button'
        onClick={handleNext}
        disabled={!hasNextPage}
        className="px-6 py-3 border border-border disabled:opacity-30 disabled:cursor-not-allowed hover:border-foreground transition-colors text-xs tracking-wider uppercase"
      >
        Siguiente →
      </button>
    </div>
  )
}
