import Link from 'next/link';
import { ShoppingBag, Calendar, Utensils } from 'lucide-react';

const services = [
	{
		icon: <ShoppingBag className="h-8 w-8 text-boucherie-red" />,
		title: 'Click & Collect',
		description:
			'Commandez en ligne et récupérez votre commande en boutique à Fontaine.',
		link: '/products',
	},
	{
		icon: <Utensils className="h-8 w-8 text-boucherie-red" />,
		title: 'Les recettes maison',
		description:
			'Brochettes marinées, kefta, viandes épicées et plats orientaux sur mesure.',
		link: '/recipes',
	},
	{
		icon: <Calendar className="h-8 w-8 text-boucherie-red" />,
		title: 'Commandes spéciales',
		description:
			'Préparations sur mesure pour vos événements (mariages, Aïd, barbecues...).',
		link: '/events',
	},
];

export function ServicesOverviewSection() {
	return (
		<section className="section-padding bg-boucherie-black">
			<div className="container-custom">
				<div className="text-center mb-16">
					<h2 className="heading-lg mb-4 text-white font-playfair">
						Nos Services
					</h2>
					<p className="text-xl text-gray-400 max-w-3xl mx-auto">
						Découvrez notre gamme complète de services pour vous offrir
						une expérience de boucherie exceptionnelle.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{services.map((service, index) => (
						<div
							key={index}
							className="boucherie-card p-8 text-center hover-lift transition-all duration-300 hover:bg-gray-900">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-boucherie-red/10 mb-6 border border-boucherie-red/30">
								{service.icon}
							</div>
							<h3 className="text-xl font-bold mb-3 text-white">
								{service.title}
							</h3>
							<p className="text-gray-400 mb-6">{service.description}</p>
							<Link
								href={service.link}
								className="text-boucherie-red font-medium hover:text-boucherie-red-light transition-colors inline-flex items-center">
								En savoir plus
								<svg
									className="ml-2 w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
								</svg>
							</Link>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
