'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
	{
		id: 1,
		name: 'Mohammed Benali',
		role: 'Client fidèle',
		image: '',
		quote: 'Je suis client de B Market depuis plus de 10 ans. La qualité de la viande est toujours au rendez-vous et le service est impeccable. Je recommande particulièrement leurs merguez maison !',
		rating: 5,
	},
	{
		id: 2,
		name: 'Samira Hadj',
		role: 'Cliente régulière',
		image: '',
		quote: "Pour l'Aïd, je commande toujours mon agneau chez B Market. La viande est tendre, savoureuse et la découpe est parfaite. Un grand merci à toute l'équipe pour leur professionnalisme.",
		rating: 5,
	},
	{
		id: 3,
		name: 'Thomas Dubois',
		role: 'Nouveau client',
		image: '',
		quote: "J'ai découvert cette boucherie récemment et je suis impressionné par la qualité des produits. Les conseils du boucher sont précieux et les préparations marinées sont délicieuses.",
		rating: 4,
	},
	{
		id: 4,
		name: 'Fatima Lahmidi',
		role: 'Cliente pour événements',
		image: '',
		quote: 'Pour le mariage de ma fille, nous avons commandé un méchoui complet. Le service était parfait, la viande excellente et tous nos invités ont adoré. Merci B Market !',
		rating: 5,
	},
];

export function TestimonialsSection() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [autoplay, setAutoplay] = useState(true);

	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (autoplay) {
			interval = setInterval(() => {
				setCurrentIndex(prevIndex => (prevIndex + 1) % testimonials.length);
			}, 5000);
		}

		return () => clearInterval(interval);
	}, [autoplay]);

	const handlePrev = () => {
		setAutoplay(false);
		setCurrentIndex(
			prevIndex =>
				(prevIndex - 1 + testimonials.length) % testimonials.length,
		);
	};

	const handleNext = () => {
		setAutoplay(false);
		setCurrentIndex(prevIndex => (prevIndex + 1) % testimonials.length);
	};

	return (
		<section className="section-padding bg-boucherie-black relative overflow-hidden animate-fadeIn">
			<div className="absolute inset-0 pointer-events-none opacity-10">
				<div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200&text=B')] bg-repeat-space bg-contain"></div>
			</div>

			<div className="container-custom relative z-10">
				<div className="text-center mb-16">
					<h2 className="heading-lg text-white font-playfair">
						Ce que disent nos clients
					</h2>
					<p className="text-gray-400 max-w-2xl mx-auto">
						Découvrez les témoignages de nos clients satisfaits qui nous
						font confiance depuis des années.
					</p>
				</div>

				<div className="relative max-w-4xl mx-auto">
					<div className="overflow-hidden">
						<div
							className="flex transition-transform duration-500 ease-in-out"
							style={{
								transform: `translateX(-${currentIndex * 100}%)`,
							}}>
							{testimonials.map(testimonial => (
								<div
									key={testimonial.id}
									className="w-full flex-shrink-0 px-4">
									<div className="boucherie-card p-8 shadow-md">
										<div className="flex flex-col md:flex-row md:items-center mb-6">
											<div className="relative w-16 h-16 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-4 border border-boucherie-red/30">
												<Image
													src={
														testimonial.image ||
														'/placeholder.svg'
													}
													alt={testimonial.name}
													fill
													className="object-cover"
												/>
											</div>
											<div>
												<h3 className="font-bold text-lg text-white">
													{testimonial.name}
												</h3>
												<p className="text-gray-400 text-sm">
													{testimonial.role}
												</p>
												<div className="flex text-boucherie-red mt-1">
													{[...Array(5)].map((_, i) => (
														<Star
															key={i}
															className="w-4 h-4"
															fill={
																i < testimonial.rating
																	? 'currentColor'
																	: 'none'
															}
														/>
													))}
												</div>
											</div>
										</div>
										<div className="relative">
											<div className="absolute -top-2 -left-2 text-5xl text-boucherie-red opacity-20">
												"
											</div>
											<blockquote className="text-gray-300 italic relative z-10 pl-4">
												{testimonial.quote}
											</blockquote>
											<div className="absolute -bottom-4 -right-2 text-5xl text-boucherie-red opacity-20">
												"
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<button
						onClick={handlePrev}
						className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 bg-boucherie-black rounded-full p-2 shadow-md hover:bg-gray-900 transition-colors border border-boucherie-red/30 text-boucherie-red"
						aria-label="Témoignage précédent">
						<ChevronLeft className="w-5 h-5" />
					</button>

					<button
						onClick={handleNext}
						className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 bg-boucherie-black rounded-full p-2 shadow-md hover:bg-gray-900 transition-colors border border-boucherie-red/30 text-boucherie-red"
						aria-label="Témoignage suivant">
						<ChevronRight className="w-5 h-5" />
					</button>

					<div className="flex justify-center mt-6 space-x-2">
						{testimonials.map((_, index) => (
							<button
								key={index}
								onClick={() => {
									setAutoplay(false);
									setCurrentIndex(index);
								}}
								className={`w-3 h-3 rounded-full transition-colors ${
									index === currentIndex
										? 'bg-boucherie-red'
										: 'bg-gray-700'
								}`}
								aria-label={`Aller au témoignage ${index + 1}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
