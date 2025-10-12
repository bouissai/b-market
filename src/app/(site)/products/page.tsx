import TabsProduit from '@/components/site/products/products';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Nos produits | Votre Boucherie',
	description: 'Découvrez tous nos produits de qualité',
};

export default function Produits() {
	return (
		<div className="">
			{/* Hero section */}
			<header className="border-b border-border/50">
				<div className="container mx-auto px-6 py-12 md:py-10">
					<h1 className="font-sans text-4xl md:text-6xl lg:text-7xl font-light text-foreground text-center tracking-tight leading-tight">
						Nos produits
					</h1>
					<p className="text-muted-foreground text-center mt-4 md:mt-6 text-base md:text-lg max-w-2xl mx-auto font-light tracking-wide">
						Viandes de qualité supérieure, sélectionnées avec soin
					</p>
				</div>
			</header>

			{/* Tabs section */}
			<section className="py-12 box-border">
				<div className="container mx-auto px-4">
					<TabsProduit />
				</div>
			</section>
		</div>
	);
}
