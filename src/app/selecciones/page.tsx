import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfederationFilter } from "@/components/confederation-filter";
import { ProductCard } from "@/components/product-card";
import { BreadcrumbSchema } from "@/components/structured-data/breadcrumb-schema";
import { getProducts } from "@/lib/shopify/queries/products";
import { extractMetafield } from "@/lib/shopify/utils";

type SearchParams = Promise<{ confederacion?: string }>;

export async function generateMetadata({
	searchParams,
}: {
	searchParams: SearchParams;
}): Promise<Metadata> {
	const { confederacion } = await searchParams;

	if (confederacion) {
		return {
			title: `${confederacion} — Playeras Mundial 2026`,
			description: `Playeras oficiales de selecciones de ${confederacion} para el Mundial 2026. Envío express a México.`,
			openGraph: {
				title: `${confederacion} — Mundial Shop`,
				description: `Playeras de ${confederacion} para el Mundial 2026`,
			},
		};
	}

	return {
		title: "Todas las Selecciones — Mundial Shop",
		description:
			"48 selecciones del Mundial 2026. Encuentra la playera de tu selección favorita. Envío express a México. Calidad premium.",
		openGraph: {
			title: "Todas las Selecciones — Mundial Shop",
			description: "48 selecciones del Mundial 2026",
			images: ["/og-selecciones.jpg"],
		},
	};
}

export default async function SeleccionesPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const { confederacion } = await searchParams;

	// Get all products
	const { products: allProducts } = await getProducts({ first: 50 });

	// Filter by confederation on the server
	const products = confederacion
		? allProducts.filter((product) => {
				const productConfederation = extractMetafield(
					product.metafields,
					"confederacion",
				);

				return productConfederation === confederacion;
			})
		: allProducts;

	return (
		<>
			<BreadcrumbSchema
				items={[
					{ name: "Inicio", url: "/" },
					{ name: "Selecciones", url: "/selecciones" },
				]}
			/>
			<div className="max-w-6xl mx-auto px-4 py-12">
				<h1 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">
					{confederacion
						? `${confederacion} · ${products.length} selecciones`
						: `Todas las selecciones · ${products.length}`}
				</h1>

				<Suspense>
					<ConfederationFilter />
				</Suspense>

				{products.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No hay playeras disponibles en esta categoría todavía.
					</p>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}
			</div>
		</>
	);
}
