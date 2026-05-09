export function ProductCardSkeleton() {
  return (
    <div className="border border-border p-4 animate-pulse">
      <div className="h-3 w-16 bg-muted mb-1 rounded" />
      <div className="h-4 w-3/4 bg-muted mb-2 rounded" />
      <div className="h-3 w-20 bg-muted rounded" />
    </div>
  )
}

export function ProductCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
