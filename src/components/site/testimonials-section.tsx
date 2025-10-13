'use client';

import { useReviewsStore } from '@/store/useReviewStore';
import { useEffect } from 'react';
import { AnimatedSection } from './animations/animated-section';
import { TestimonialsCarousel } from './testimonials-carousel';


export function TestimonialsSection() {
	const { reviews, fetchReviews, loading } = useReviewsStore();

	useEffect(() => {
		fetchReviews();
	}, [fetchReviews, reviews]);

	if (loading || reviews.length === 0) return null;

	return (
		<section className="py-12 relative">
			<div className="absolute inset-0 bg-gradient-to-br from-muted/10 via-transparent to-muted/10" />
			<div className="container mx-auto px-6 relative z-10">
				<AnimatedSection>
					<h2 className="text-sm font-light text-muted-foreground tracking-widest uppercase mb-16 text-center">
						Ils nous font confiance
					</h2>
				</AnimatedSection>

				<AnimatedSection delay={200}>
					<TestimonialsCarousel reviews={reviews} />
				</AnimatedSection>
			</div>
		</section>
	);
}
