"use client"
import { Button } from '@/components/ui/button';
import { useCategoryStore } from '@/store/useCategoryStore';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

const products = [
	{
		name: 'Bœuf',
		image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&h=300&fit=crop&auto=format&q=80',
		description:
			'Côtes, entrecôtes, filets, bavettes et autres morceaux de choix.',
	},
	{
		name: 'Agneau',
		image: 'https://images.unsplash.com/photo-1608500218890-c4f9019eef7f?w=500&h=300&fit=crop&auto=format&q=80',
		description:
			'Gigots, côtelettes, épaules et colliers pour vos plats traditionnels.',
	},
	{
		name: 'Volaille',
		image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&h=300&fit=crop&auto=format&q=80',
		description:
			'Poulets fermiers, pintades, dindes et canards de qualité supérieure.',
	},
	{
		name: 'Préparations',
		image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&h=300&fit=crop&auto=format&q=80',
		description:
			'Brochettes marinées, kefta, merguez maison et autres spécialités.',
	},
];

export function ProductsShowcaseSection() {
	const { categories, fetchCategories } = useCategoryStore();
	const featuredCategories = categories.filter(c => c.featured);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);
	return (
		<section className="section-padding bg-boucherie-black relative overflow-hidden">
			<div className="absolute inset-0 pointer-events-none opacity-5">
				<div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200&text=B')] bg-repeat bg-[length:200px_200px]"></div>
			</div>

			<div className="container-custom relative z-10">
				<div className="text-center mb-16">
					<h2 className="heading-lg mb-4 text-white font-playfair">
						Nos Produits
					</h2>
					<p className="text-xl text-gray-400 max-w-3xl mx-auto">
						Découvrez notre sélection de viandes fraîches et de
						préparations maison, toutes certifiées halal.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{featuredCategories.map((category, index) => (
						<div
							key={category.id}
							className="boucherie-card overflow-hidden group hover-lift">
							<div className="relative h-48">
								<Image
									src={category.image || '/placeholder.svg'}
									alt={category.name}
									fill
									className="object-cover transition-transform duration-300 group-hover:scale-105 border border-boucherie-black"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-boucherie-black/90 to-transparent transition-transform duration-300 group-hover:scale-105"></div>
								<div className="absolute bottom-4 left-4 right-4">
									<h3 className="text-xl font-bold text-white">{category.name}</h3>
								</div>
							</div>
							<div className="p-6">
								<p className="text-gray-400 mb-4">
									{category.description || 'Découvrez notre sélection.'}
								</p>
								<Link
									href={`/products#${category.name.toLowerCase()}`}
									className="text-boucherie-red font-medium hover:text-boucherie-red-light transition-colors inline-flex items-center">
									Voir les produits
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
						</div>
					))}

				</div>

				<div className="text-center mt-12">
					<Button asChild size="lg" className="btn-primary">
						<Link href="/products">Voir tous nos produits</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
