import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
	return (
		<section className="py-20 bg-gradient-to-br from-gray-950 to-boucherie-black relative overflow-hidden">
			<div className="absolute inset-0 pointer-events-none opacity-5">
				<div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200&text=B')] bg-repeat bg-[length:200px_200px]"></div>
			</div>

			<div className="container-custom relative z-10">
				<div className="text-center mb-12">
					<h2 className="heading-lg mb-6 text-white font-playfair">
						Notre Boutique
					</h2>
					<p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
						Rendez-nous visite dans notre boucherie à Fontaine. Nous vous
						accueillons du mardi au dimanche.
					</p>
				</div>

				<div className="mb-12 boucherie-card p-1">
					<div className="bg-gray-800 h-[400px] w-full flex items-center justify-center text-gray-500 text-lg">
						Carte de la boutique B Market
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
					<div className="boucherie-card p-6">
						<h3 className="text-xl font-bold mb-4 text-white">
							B Market Fontaine
						</h3>
						<p className="text-gray-400 mb-2">
							123 Rue de la Boucherie, 38600 Fontaine
						</p>
						<p className="text-gray-400 mb-2">Tél: 04 76 12 34 56</p>
						<p className="text-gray-400 mb-4">
							<span className="font-semibold">Horaires:</span> Lun-Sam
							8h-19h30, Dim 8h-13h
						</p>
						<Button asChild variant="outline" className="w-full">
							<Link
								href="https://maps.google.com"
								target="_blank"
								rel="noopener noreferrer">
								Voir sur Google Maps
							</Link>
						</Button>
					</div>
				</div>

				<div className="text-center">
					<h3 className="text-2xl font-bold mb-4 text-white font-playfair">
						Prêt à commander ?
					</h3>
					<p className="text-gray-400 max-w-2xl mx-auto mb-8">
						Commandez en ligne et récupérez vos produits en boutique ou
						optez pour la livraison à domicile.
					</p>
					<Button
						asChild
						size="lg"
						className="bg-boucherie-red text-white hover:bg-boucherie-red-light rounded-md shadow-md">
						<Link href="/produits">Commander maintenant</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
