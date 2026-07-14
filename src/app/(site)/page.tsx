import { CTASection } from '@/components/site/landingPage/cta-section';
import { HeroSection } from '@/components/site/landingPage/hero-section';
import { ProductsShowcaseSection } from '@/components/site/landingPage/product-showcase-section';
import { ServicesOverviewSection } from '@/components/site/landingPage/services-overview-section';
import { TestimonialsSection } from '@/components/site/testimonials-section';
import { WhyChooseUsSection } from '@/components/site/landingPage/why-choose-us-section';
import { SectionSeparator } from '@/components/site/section-separator';
import {
	getFeaturedLandingCategories,
	getLandingReviews,
} from '@/services/landingService';

export const dynamic = 'force-dynamic';

export default async function Home() {
	const [categories, reviews] = await Promise.all([
		getFeaturedLandingCategories(),
		getLandingReviews(),
	]);

	return (
		<div className="min-h-screen">
			<HeroSection />
			<SectionSeparator variant="wave" />
			<ServicesOverviewSection />
			<SectionSeparator variant="diagonal" />
			<WhyChooseUsSection />
			<SectionSeparator variant="wave" />
			<ProductsShowcaseSection categories={categories} />
			<SectionSeparator variant="diagonal" />
			<TestimonialsSection reviews={reviews} />
			<SectionSeparator variant="wave" />
			<CTASection />
		</div>
	);
}
