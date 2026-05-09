import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/shopify/queries/products";
import { extractMetafield, getProductImages } from "@/lib/shopify/utils";

type FeaturedTeam = {
	team: string;
	emoji: string;
	confederation: string;
	image: string;
	handle: string;
};

export async function FeaturedTeamsCarousel() {
	const { products } = await getProducts({ first: 50 });

	// Get featured teams (customize this list)
	const featuredTeamNames = [
		"argentina",
		"mexico",
		"spain",
		"brazil",
		"france",
	];

	const featuredTeams: FeaturedTeam[] = featuredTeamNames
		.map((teamName) => {
			const product = products.find(
				(p) =>
					extractMetafield(p.metafields, "team")?.toLowerCase() === teamName,
			);

			if (!product) return null;

			const team = extractMetafield(product.metafields, "team") || "";
			const emoji = extractMetafield(product.metafields, "pais_emoji") || "";
			const confederation =
				extractMetafield(product.metafields, "confederacion") || "";
			const images = getProductImages(product);

			return {
				team,
				emoji,
				confederation,
				image: images[0]?.url || "",
				handle: product.handle,
			};
		})
		.filter((team): team is FeaturedTeam => team !== null);

	if (featuredTeams.length === 0) {
		return null;
	}

	return (
		<section className="max-w-[1600px] mx-auto px-4 py-16">
			<p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-8">
				Equipos destacados
			</p>

			{/* Horizontal scroll container */}
			<div className="overflow-x-auto -mx-4 px-4">
				<div className="flex gap-6 min-w-max pb-4">
					{featuredTeams.map((team) => (
						<Link
							key={team.team}
							href={`/c/${team.confederation.toLowerCase()}/${team.team.toLowerCase()}`}
							className="group relative w-[400px] h-[500px] overflow-hidden flex-shrink-0"
						>
							{/* Background Image */}
							<div className="absolute inset-0">
								<Image
									src={team.image}
									alt={`${team.team} Jersey`}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									sizes="400px"
								/>
								{/* Overlay gradient */}
								<div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
							</div>

							{/* Badge */}
							<div className="absolute top-6 left-6 bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-wider">
								Mundial 2026
							</div>

							{/* Content */}
							<div className="absolute bottom-0 left-0 right-0 p-8 text-white">
								<h3 className="text-3xl font-bold mb-4">
									{team.team} {team.emoji}
								</h3>
								<button
									type="button"
									className="cursor-pointer px-6 py-3 border-2 border-white text-sm font-medium tracking-wider uppercase hover:bg-white hover:text-black transition-colors"
								>
									Shop {team.team}
								</button>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* Scroll indicator */}
			<div className="flex gap-2 mt-6 justify-center md:hidden">
				{featuredTeams.map((team, i) => (
					<div
						key={`indicator-${team.team}`}
						className="h-1 w-8 bg-muted rounded-full"
					/>
				))}
			</div>
		</section>
	);
}
