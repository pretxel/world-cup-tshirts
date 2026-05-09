/** biome-ignore-all lint/suspicious/noArrayIndexKey: Using array index as key for skeleton loading elements is acceptable */
export function CartSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="h-4 w-48 bg-muted animate-pulse rounded mb-10" />

      <div className="mb-8 space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={`skeleton-cart-item-${i}`} className="flex gap-4 pb-4 border-b border-border">
            <div className="w-24 h-24 bg-secondary animate-pulse rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-foreground pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-muted animate-pulse rounded" />
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-3 w-64 bg-muted animate-pulse rounded" />
        <div className="h-14 w-full bg-muted animate-pulse rounded" />
      </div>
    </div>
  )
}
