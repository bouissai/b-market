import { CTASection } from '@/components/site/landingPage/cta-section';
import { HeroSection } from '@/components/site/landingPage/hero-section';
import { ProductsShowcaseSection } from '@/components/site/landingPage/product-showcase-section';
import { ServicesOverviewSection } from '@/components/site/landingPage/services-overview-section';
import { TestimonialsSection } from '@/components/site/landingPage/testimonials-section';
import { WhyChooseUsSection } from '@/components/site/landingPage/why-choose-us-section';

export default function Home() {
	return (
		<>
			<HeroSection />
			<ServicesOverviewSection />
			<WhyChooseUsSection />
			<ProductsShowcaseSection />
			<TestimonialsSection />
			<CTASection />
		</>
	);
}
