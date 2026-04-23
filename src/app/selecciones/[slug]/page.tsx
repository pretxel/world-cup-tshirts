import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductPageClient } from "@/components/product-page-client";
import { ProductSchema } from "@/components/structured-data/product-schema";
import { BreadcrumbSchema } from "@/components/structured-data/breadcrumb-schema";
import { getProductByHandle } from "@/lib/shopify/queries/products";
import {
	extractMetafield,
	getProductImages,
	getProductVariants,
} from "@/lib/shopify/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
	const { slug } = await params;
	const product = await getProductByHandle(slug);

	if (!product) {
		return {
			title: "Producto no encontrado — Mundial Shop",
		};
	}

	const images = getProductImages(product);
	const confederation = extractMetafield(product.metafields, "confederacion");
	const emoji = extractMetafield(product.metafields, "pais_emoji");

	return {
		title: `${product.title} ${emoji || ""} — Mundial Shop`,
		description:
			product.description ||
			`Playera oficial de ${product.title}. ${confederation || "Mundial 2026"}. Envío express a México. Calidad premium.`,
		keywords: [
			product.title,
			confederation || "",
			"Mundial 2026",
			"playera de fútbol",
			"jersey",
			"selección nacional",
			"camiseta oficial",
		].filter(Boolean),
		openGraph: {
			title: `${product.title} ${emoji || ""}`,
			description:
				product.description ||
				`Playera oficial de ${product.title} para el Mundial 2026`,
			images: images.map((img) => ({
				url: img.url,
				alt: img.altText || product.title,
				width: 1200,
				height: 1200,
			})),
			type: "website",
			siteName: "Mundial Shop",
		},
		twitter: {
			card: "summary_large_image",
			title: `${product.title} ${emoji || ""}`,
			description:
				product.description ||
				`Playera oficial de ${product.title} para el Mundial 2026`,
			images: images[0]?.url ? [images[0].url] : [],
		},
		alternates: {
			canonical: `/selecciones/${slug}`,
		},
	};
}

export default async function ProductPage({ params }: { params: Params }) {
	const { slug } = await params;
	const product = await getProductByHandle(slug);

	if (!product) notFound();

	const images = getProductImages(product);
	const variants = getProductVariants(product);
	const confederation = extractMetafield(product.metafields, "confederacion");
	const emoji = extractMetafield(product.metafields, "pais_emoji");
	const shippingTime =
		extractMetafield(product.metafields, "tiempo_envio") ?? "10–15 días";

	// Detectar automáticamente los nombres de las opciones
	const optionNames = variants[0]?.selectedOptions.map(opt => opt.name) ?? [];
	const colorOptionName = optionNames.find(name =>
		name === 'Color' || name === 'Versión'
	) ?? 'Color';
	const sizeOptionName = optionNames.find(name =>
		name === 'Size' || name === 'Talla'
	) ?? 'Size';

	// Obtener valores únicos para cada opción
	const availableColors = Array.from(
		new Set(
			variants
				.map((v) => v.selectedOptions.find((opt) => opt.name === colorOptionName)?.value)
				.filter((v): v is string => !!v)
		)
	);

	const availableSizes = Array.from(
		new Set(
			variants
				.map((v) => v.selectedOptions.find((opt) => opt.name === sizeOptionName)?.value)
				.filter((v): v is string => !!v)
				.filter((size) => !/^\d+$/.test(size)) // Filtrar tallas numéricas (100, 110, 120, etc.)
				.filter((size) => !size.toLowerCase().includes('kid')) // Filtrar tallas de kids
		)
	);

	return (
		<>
			<ProductSchema product={product} images={images} />
			<BreadcrumbSchema
				items={[
					{ name: "Inicio", url: "/" },
					{ name: "Selecciones", url: "/selecciones" },
					{ name: product.title, url: `/selecciones/${slug}` },
				]}
			/>
			<ProductPageClient
				product={product}
				images={images}
				variants={variants}
				confederation={confederation}
				emoji={emoji}
				shippingTime={shippingTime}
				availableColors={availableColors}
				availableSizes={availableSizes}
				colorOptionName={colorOptionName}
				sizeOptionName={sizeOptionName}
			/>
		</>
	);
}
