import Image from 'next/image';
import { Award, ThumbsUp, Clock } from 'lucide-react';

const features = [
	{
		icon: <Award className="h-8 w-8 text-boucherie-red" />,
		title: 'Qualité Garantie',
		description:
			'Viandes sélectionnées avec soin, 100% halal et traçabilité garantie pour une qualité irréprochable.',
		image: 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=600&h=400&fit=crop&crop=focalpoint&auto=format&q=80',
	},
	{
		icon: <ThumbsUp className="h-8 w-8 text-boucherie-red" />,
		title: 'Savoir-faire Artisanal',
		description:
			'Nos bouchers expérimentés perpétuent un savoir-faire traditionnel depuis plus de 40 ans.',
		image: 'https://images.unsplash.com/photo-1542528180-a1208c5169a5?w=600&h=400&fit=crop&crop=focalpoint&auto=format&q=80',
	},
	{
		icon: <Clock className="h-8 w-8 text-boucherie-red" />,
		title: 'Service Personnalisé',
		description:
			'Conseils sur mesure, découpes spéciales et préparations adaptées à vos besoins.',
		image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&h=400&fit=crop&crop=focalpoint&auto=format&q=80',
	},
];

export function WhyChooseUsSection() {
	return (
		<section className="section-padding bg-gray-950">
			<div className="container-custom">
				<div className="text-center mb-16">
					<h2 className="heading-lg mb-4 text-white font-playfair">
						Pourquoi Choisir B Market ?
					</h2>
					<p className="text-xl text-gray-400 max-w-3xl mx-auto">
						Découvrez ce qui fait la différence de notre boucherie
						artisanale depuis 1982.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							className="boucherie-card overflow-hidden group hover-lift">
							<div className="relative h-48">
								<Image
									src={feature.image || '/placeholder.svg'}
									alt={feature.title}
									fill
									className="object-cover transition-transform duration-300 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-boucherie-black/90 to-transparent"></div>
								<div className="absolute bottom-4 left-4 right-4">
									<div className="flex items-center">
										<div className="p-2 bg-boucherie-black/90 border border-boucherie-red/30 rounded-full mr-3">
											{feature.icon}
										</div>
										<h3 className="text-xl font-bold text-white">
											{feature.title}
										</h3>
									</div>
								</div>
							</div>
							<div className="p-6">
								<p className="text-gray-400">{feature.description}</p>
							</div>
						</div>
					))}
				</div>

				<div className="mt-16 text-center">
					<a
						href="/contact"
						className="inline-flex items-center text-boucherie-red font-semibold hover:text-boucherie-red-light transition-colors">
						Contactez-nous pour en savoir plus
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
					</a>
				</div>
			</div>
		</section>
	);
}
