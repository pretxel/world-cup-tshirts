import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { BreadcrumbSchema } from "@/components/structured-data/breadcrumb-schema";
import { getProducts } from "@/lib/shopify/queries/products";
import { extractMetafield } from "@/lib/shopify/utils";

type Params = Promise<{ confederacion: string; team: string }>;

export async function generateMetadata({
	params,
}: {
	params: Params;
}): Promise<Metadata> {
	const { team } = await params;
	const teamCapitalized = team.charAt(0).toUpperCase() + team.slice(1);

	return {
		title: `${teamCapitalized} — Playeras Mundial 2026`,
		description: `Playeras oficiales de ${teamCapitalized} para el Mundial 2026. Envío express a México.`,
		openGraph: {
			title: `${teamCapitalized} — Mundial Shop`,
			description: `Playeras de ${teamCapitalized} para el Mundial 2026`,
		},
	};
}

export default async function TeamPage({ params }: { params: Params }) {
	const { confederacion, team } = await params;
	const teamNormalized = team.toLowerCase();
	const confederacionNormalized = confederacion.toUpperCase();

	// Get all products and filter by team
	const { products: allProducts } = await getProducts({ first: 100 });
	const products = allProducts.filter((product) => {
		const productTeam = extractMetafield(product.metafields, "team");
		return productTeam?.toLowerCase() === teamNormalized;
	});

	if (products.length === 0) {
		notFound();
	}

	const teamName = extractMetafield(products[0].metafields, "team") || team;
	const emoji = extractMetafield(products[0].metafields, "pais_emoji") || "";

	return (
		<>
			<BreadcrumbSchema
				items={[
					{ name: "Inicio", url: "/" },
					{ name: "Selecciones", url: "/selecciones" },
					{
						name: confederacionNormalized,
						url: `/c/${confederacion}`,
					},
					{ name: teamName, url: `/c/${confederacion}/${team}` },
				]}
			/>
			<div className="max-w-6xl mx-auto px-4 py-12">
				<h1 className="text-2xl font-medium mb-2">
					{teamName} {emoji}
				</h1>
				<p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">
					{confederacionNormalized} · {products.length} producto
					{products.length > 1 ? "s" : ""}
				</p>

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
