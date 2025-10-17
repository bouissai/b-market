"use client"
import { Button } from '@/components/ui/button';
import { useCategoryStore } from '@/store/useCategoryStore';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { AnimatedSection } from '../animations/animated-section';
import { CategoryCard } from './category-card';


export function ProductsShowcaseSection() {
	const { categories, fetchCategories } = useCategoryStore();
	const featuredCategories = categories.filter(c => c.featured);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);
	return (<section className="py-12 relative bg-muted/30">
		<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/30 via-muted/20 to-transparent" />
		<div className="container mx-auto px-6 relative z-10">
			<AnimatedSection>
				<div className="text-center mb-20">
					<h2 className="text-3xl md:text-5xl font-light text-foreground mb-6 tracking-tight">Nos produits</h2>
					<p className="text-muted-foreground font-light text-lg max-w-2xl mx-auto">
						Explorez notre sélection de viandes premium organisée par catégories
					</p>
				</div>
			</AnimatedSection>

			<AnimatedSection delay={200}>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
					{featuredCategories.map(category => (
						<CategoryCard
							key={category.id}
							title={category.name}
							image={category.image}
							href={`/products?category=${category.name}`}
						/>
					))}

				</div>
			</AnimatedSection>

			<AnimatedSection delay={400}>
				<div className="text-center mt-16">
					<Button
						asChild
						variant="outline"
						size="lg"
						className="text-base px-8 py-6 h-auto bg-background/50 backdrop-blur"
					>
						<Link href="/products/" className="flex items-center gap-2">
							Voir tous les produits
							<ArrowRight className="w-5 h-5" />
						</Link>
					</Button>
				</div>
			</AnimatedSection>
		</div>
	</section>
	);
}
