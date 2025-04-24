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
			<section className="bg-muted/30 pt-20 py-4 box-border">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl">
						<h1 className="text-3xl md:text-4xl font-bold mb-4">
							Nos Produits
						</h1>
						<p className="text-muted-foreground mb-6">
							Découvrez notre sélection de recettes délicieuses préparées
							avec nos viandes de qualité. De l'entrée au plat principal,
							pour le quotidien ou pour vos événements spéciaux.
						</p>
					</div>
				</div>
			</section>

			{/* Tabs section */}
			<section className="py-12 box-border">
				<div className="container mx-auto px-4">
					<TabsProduit />
				</div>
			</section>
		</div>
	);
}
