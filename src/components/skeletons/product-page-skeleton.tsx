/** biome-ignore-all lint/suspicious/noArrayIndexKey: Using array index as key for skeleton loading elements is acceptable */
export function ProductPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image skeleton */}
        <div>
          <div className="aspect-square bg-secondary animate-pulse mb-3" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`skeleton-image-${i}`} className="w-16 h-16 bg-secondary animate-pulse" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="flex flex-col gap-6">
          <div className="h-3 w-24 bg-muted animate-pulse rounded" />
          <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />

          {/* Color selector skeleton */}
          <div>
            <div className="h-3 w-16 bg-muted animate-pulse rounded mb-2" />
            <div className="flex gap-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={`skeleton-color-${i}`} className="w-20 h-10 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>

          {/* Size selector skeleton */}
          <div>
            <div className="h-3 w-16 bg-muted animate-pulse rounded mb-2" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-size-${i}`} className="w-12 h-10 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>

          <div className="h-12 bg-muted animate-pulse rounded" />
          <div className="h-14 w-full bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  )
}
