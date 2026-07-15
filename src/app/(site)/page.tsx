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
import { BUSINESS_INFO, LOCAL_SEO_KEYWORDS, SITE_URL } from '@/lib/site-seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Boucherie Grenoble halal et artisanale',
	description:
		'B Market, boucherie halal près de Grenoble à Fontaine : viandes fraîches, découpe artisanale, préparations maison, traiteur halal et click-and-collect.',
	keywords: LOCAL_SEO_KEYWORDS,
	alternates: {
		canonical: '/',
	},
};

export default async function Home() {
	const [categories, reviews] = await Promise.all([
		getFeaturedLandingCategories(),
		getLandingReviews(),
	]);

	const localBusinessJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ButcherShop',
		'@id': `${SITE_URL}/#b-market`,
		name: BUSINESS_INFO.name,
		legalName: BUSINESS_INFO.legalName,
		alternateName: [BUSINESS_INFO.alternateName, 'Boucherie B Market'],
		url: SITE_URL,
		image: `${SITE_URL}/images/devanture-bmarket-hero.webp`,
		logo: `${SITE_URL}/images/logo_bmarket`,
		description:
			'Boucherie halal artisanale près de Grenoble proposant viandes fraîches, découpes sur mesure, préparations maison, traiteur halal et click-and-collect.',
		telephone: BUSINESS_INFO.phone,
		email: BUSINESS_INFO.email,
		priceRange: '€€',
		address: {
			'@type': 'PostalAddress',
			streetAddress: BUSINESS_INFO.streetAddress,
			postalCode: BUSINESS_INFO.postalCode,
			addressLocality: BUSINESS_INFO.addressLocality,
			addressRegion: BUSINESS_INFO.addressRegion,
			addressCountry: BUSINESS_INFO.addressCountry,
		},
		areaServed: [
			'Grenoble',
			'Fontaine',
			'Seyssinet-Pariset',
			'Saint-Martin-d’Hères',
			'Échirolles',
			'Meylan',
		],
		openingHoursSpecification: [
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
				opens: '09:00',
				closes: '13:00',
			},
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
				opens: '15:00',
				closes: '19:30',
			},
		],
		sameAs: [
			'https://www.instagram.com/bmarket_38/?hl=fr',
			'https://www.facebook.com/boucherieimene/?locale=fr_FR',
		],
	};

	return (
		<div className="min-h-screen">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(localBusinessJsonLd).replace(/</g, '\\u003c'),
				}}
			/>
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
