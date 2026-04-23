"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { SizeSelector } from "@/components/size-selector";
import type { ShopifyProduct, ShopifyVariant } from "@/lib/shopify/types";
import { formatPrice, getVariantByOptions } from "@/lib/shopify/utils";

type Props = {
	product: ShopifyProduct;
	images: { url: string; altText: string | null }[];
	variants: ShopifyVariant[];
	confederation: string | null;
	emoji: string | null;
	shippingTime: string;
	availableColors: string[];
	availableSizes: string[];
	colorOptionName: string;
	sizeOptionName: string;
};

export function ProductPageClient({
	product,
	images,
	variants,
	confederation,
	emoji,
	shippingTime,
	availableColors,
	availableSizes,
	colorOptionName,
	sizeOptionName,
}: Props) {
	const [selectedColor, setSelectedColor] = useState(availableColors[0] ?? "");
	const [selectedSize, setSelectedSize] = useState(availableSizes[0] ?? "");
	const [activeImageIndex, setActiveImageIndex] = useState(0);

	const selectedVariant = getVariantByOptions(variants, {
		[colorOptionName]: selectedColor,
		[sizeOptionName]: selectedSize,
	});

	const price = selectedVariant
		? formatPrice(
				selectedVariant.price.amount,
				selectedVariant.price.currencyCode,
			)
		: formatPrice(
				product.priceRange.minVariantPrice.amount,
				product.priceRange.minVariantPrice.currencyCode,
			);

	return (
		<div className="max-w-6xl mx-auto px-4 py-12">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
				{/* Images */}
				<div>
					<div className="aspect-square bg-secondary relative mb-3 overflow-hidden">
						{images[activeImageIndex] ? (
							<Image
								src={images[activeImageIndex].url}
								alt={images[activeImageIndex].altText ?? product.title}
								fill
								className="object-cover"
								priority
								sizes="(max-width: 768px) 100vw, 50vw"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-6xl">
								{emoji ?? "⚽"}
							</div>
						)}
					</div>
					{images.length > 1 && (
						<div className="flex gap-2">
							{images.map((image, i) => (
								<button
									key={`thumbnail-${i}-${image.altText}`}
                  type="button"
									onClick={() => setActiveImageIndex(i)}
									className={`w-16 h-16 relative bg-secondary overflow-hidden border-2 transition-colors ${
										activeImageIndex === i
											? "border-foreground"
											: "border-transparent"
									}`}
								>
									<Image
										src={image.url}
										alt={image.altText ?? `Vista ${i + 1}`}
										fill
										className="object-cover"
										sizes="64px"
									/>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Info */}
				<div className="flex flex-col gap-6">
					{confederation && (
						<span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
							{confederation}
						</span>
					)}
					<h1 className="text-2xl font-medium">{product.title}</h1>
					<p className="text-xl font-semibold">{price}</p>

					{availableColors.length > 1 && (
						<div>
							<p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">
								{colorOptionName}
							</p>
							<div className="flex flex-wrap gap-2">
								{availableColors.map((color) => (
									<button
										key={`color-${color}`}
                    type="button"
										onClick={() => setSelectedColor(color)}
										className={`px-4 py-2 text-sm border transition-colors whitespace-nowrap ${
											selectedColor === color
												? "border-foreground bg-foreground text-background"
												: "border-border hover:border-foreground"
										}`}
									>
										{color}
									</button>
								))}
							</div>
						</div>
					)}

					<SizeSelector
						sizes={availableSizes}
						selected={selectedSize}
						onChange={setSelectedSize}
					/>

					<div className="bg-secondary px-4 py-3 text-xs text-muted-foreground tracking-wide">
						📦 Envío estimado: {shippingTime} a México
					</div>

					<AddToCartButton
						variantId={selectedVariant?.id}
						disabled={!selectedVariant?.availableForSale}
					/>

					<Link
						href="/paginas/guia-de-tallas"
						className="text-xs text-muted-foreground underline underline-offset-4 text-center hover:text-foreground transition-colors"
					>
						Consultar guía de tallas
					</Link>

					{product.description && (
						<p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-6">
							{product.description}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
