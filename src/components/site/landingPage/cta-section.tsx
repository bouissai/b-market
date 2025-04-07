import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapComponent } from '../map-component';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Phone } from 'lucide-react';

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
					<MapComponent />
				</div>

				{/* Section informations avec design amélioré */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
					<Card className="bg-gray-900 border-none shadow-lg hover:shadow-xl transition-shadow">
						<CardContent className="p-6">
							<div className="flex flex-col items-center text-center">
								<div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center mb-4">
									<MapPin className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-xl font-bold mb-2">
									B Market Fontaine
								</h3>
								<p className="text-gray-300">123 Rue de la Boucherie</p>
								<p className="text-gray-300">38600 Fontaine</p>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gray-900 border-none shadow-lg hover:shadow-xl transition-shadow">
						<CardContent className="p-6">
							<div className="flex flex-col items-center text-center">
								<div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center mb-4">
									<Phone className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-xl font-bold mb-2">
									Contactez-nous
								</h3>
								<p className="text-gray-300">Tél: 04 76 12 34 56</p>
								<p className="text-gray-300">contact@bmarket.fr</p>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gray-900 border-none shadow-lg hover:shadow-xl transition-shadow">
						<CardContent className="p-6">
							<div className="flex flex-col items-center text-center">
								<div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center mb-4">
									<Clock className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-xl font-bold mb-2">Horaires</h3>
								<p className="text-gray-300">Lun-Sam: 8h-19h30</p>
								<p className="text-gray-300">Dim: 8h-13h</p>
							</div>
						</CardContent>
					</Card>
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
						<Link href="/products">Commander maintenant</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
