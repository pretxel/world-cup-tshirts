import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { BreadcrumbSchema } from "@/components/structured-data/breadcrumb-schema";
import { getProducts } from "@/lib/shopify/queries/products";
import { extractMetafield } from "@/lib/shopify/utils";

type Params = Promise<{ confederacion: string }>;

export async function generateMetadata({
	params,
}: {
	params: Params;
}): Promise<Metadata> {
	const { confederacion } = await params;
	const confederacionNormalized = confederacion.toUpperCase();

	return {
		title: `${confederacionNormalized} — Playeras Mundial 2026`,
		description: `Playeras oficiales de selecciones de ${confederacionNormalized} para el Mundial 2026. Envío express a México.`,
		openGraph: {
			title: `${confederacionNormalized} — Mundial Shop`,
			description: `Playeras de ${confederacionNormalized} para el Mundial 2026`,
		},
	};
}

export default async function ConfederacionPage({ params }: { params: Params }) {
	const { confederacion } = await params;
	const confederacionNormalized = confederacion.toUpperCase();

	// Get all products and filter by confederation
	const { products: allProducts } = await getProducts({ first: 100 });
	const products = allProducts.filter((product) => {
		const productConfederation = extractMetafield(
			product.metafields,
			"confederacion",
		);
		return productConfederation?.toUpperCase() === confederacionNormalized;
	});

	if (products.length === 0) {
		notFound();
	}

	// Get unique teams for this confederation
	const teams = Array.from(
		new Set(
			products
				.map((p) => extractMetafield(p.metafields, "team"))
				.filter((t): t is string => !!t),
		),
	).sort();

	return (
		<>
			<BreadcrumbSchema
				items={[
					{ name: "Inicio", url: "/" },
					{ name: "Selecciones", url: "/selecciones" },
					{ name: confederacionNormalized, url: `/c/${confederacion}` },
				]}
			/>
			<div className="max-w-6xl mx-auto px-4 py-12">
				<h1 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">
					{confederacionNormalized} · {products.length} selecciones
				</h1>

				{/* Filter by team */}
				{teams.length > 1 && (
					<div className="mb-8 flex flex-wrap gap-2">
						{teams.map((team) => {
							const teamProducts = products.filter(
								(p) => extractMetafield(p.metafields, "team") === team,
							);
							return (
								<a
									key={team}
									href={`/c/${confederacion}/${team.toLowerCase()}`}
									className="px-4 py-2 text-xs tracking-wider uppercase border border-border hover:border-foreground transition-colors"
								>
									{team} ({teamProducts.length})
								</a>
							);
						})}
					</div>
				)}

				{/* Products grid */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</>
	);
}
