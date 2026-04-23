/** biome-ignore-all lint/suspicious/noArrayIndexKey: Using array index as key for skeleton loading elements is acceptable */
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header skeleton */}
      <div className="h-3 w-48 bg-muted animate-pulse rounded mb-10" />

      {/* Filter skeleton */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`skeleton-filter-${i}`} className="h-8 w-20 bg-muted animate-pulse rounded" />
        ))}
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`skeleton-product-${i}`} className="space-y-3">
            <div className="aspect-square bg-secondary animate-pulse rounded" />
            <div className="h-3 w-16 bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
