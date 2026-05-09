/** biome-ignore-all lint/suspicious/noArrayIndexKey: Using array index as key for skeleton loading elements is acceptable */
export default function Loading() {
	return (
		<div className="max-w-6xl mx-auto px-4 py-12">
			<div className="h-8 w-64 bg-muted animate-pulse rounded mb-2" />
			<div className="h-4 w-48 bg-muted animate-pulse rounded mb-10" />

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="space-y-3">
						<div className="aspect-square bg-secondary animate-pulse rounded" />
						<div className="h-3 w-16 bg-muted animate-pulse rounded" />
						<div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
						<div className="h-3 w-20 bg-muted animate-pulse rounded" />
					</div>
				))}
			</div>
		</div>
	);
}
