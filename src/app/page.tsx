import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Hero } from '@/components/hero'
import { FeaturedTeamsCarousel } from '@/components/featured-teams-carousel'
import { BreadcrumbSchema } from '@/components/structured-data/breadcrumb-schema'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

function CarouselSkeleton() {
  return (
    <section className="max-w-[1600px] mx-auto px-4 py-16">
      <div className="h-3 w-48 bg-muted animate-pulse rounded mb-8" />
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-6 min-w-max pb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-[400px] h-[500px] bg-secondary animate-pulse rounded flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }]} />
      <Hero />
      <Suspense fallback={<CarouselSkeleton />}>
        <FeaturedTeamsCarousel />
      </Suspense>
    </>
  )
}
