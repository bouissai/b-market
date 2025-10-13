import { CTASection } from '@/components/site/landingPage/cta-section';
import { HeroSection } from '@/components/site/landingPage/hero-section';
import { ProductsShowcaseSection } from '@/components/site/landingPage/product-showcase-section';
import { ServicesOverviewSection } from '@/components/site/landingPage/services-overview-section';
import { TestimonialsSection } from '@/components/site/testimonials-section';
import { WhyChooseUsSection } from '@/components/site/landingPage/why-choose-us-section';
import { SectionSeparator } from '@/components/site/section-separator';

export default function Home() {
	return (
		<div className='min-h-screen'>
			<HeroSection />
			<SectionSeparator variant="wave" />
			<ServicesOverviewSection />
			<SectionSeparator variant="diagonal" />
			<WhyChooseUsSection />
			<SectionSeparator  variant="wave"/>
			<ProductsShowcaseSection />
			<SectionSeparator variant='diagonal'/>
			<TestimonialsSection/>
			<SectionSeparator  variant="wave"/>
			<CTASection />
		</div>
	);
}
