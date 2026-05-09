import { ProductCardGridSkeleton } from '@/components/skeletons/product-card-skeleton'

export default function Loading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="relative h-[50vh] bg-secondary animate-pulse" />

      {/* Popular teams skeleton */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="h-3 w-32 bg-muted animate-pulse rounded mb-8" />
        <ProductCardGridSkeleton count={6} />
      </section>
    </>
  )
}
