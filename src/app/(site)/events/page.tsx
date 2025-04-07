import { ContactEvents } from '@/components/site/events/contact-events';
import { CtaEvents } from '@/components/site/events/cta-events';
import { HeroEvent } from '@/components/site/events/hero-events';
import { IntroEvent } from '@/components/site/events/intro-events';
import { ProcessEvents } from '@/components/site/events/process-event';
import { ServiceEvents } from '@/components/site/events/service-events';
import { TestimonialsSection } from '@/components/site/testimonials-section';
import { eventTypes } from '@/constants';

import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Événements | Votre Boucherie',
	description:
		'Viande de qualité pour vos événements spéciaux - mariages, fêtes religieuses et célébrations',
};

export default function EventsPage() {
	return (
		<>
			<section className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
				<HeroEvent />
			</section>

			<section className="py-16 bg-muted/30">
				<IntroEvent />
			</section>

			<section className="py-16">
				<ServiceEvents eventTypes={eventTypes} />
			</section>

			<section className="py-16 bg-muted/30">
				<ProcessEvents />
			</section>

			<section className="py-16">
				<TestimonialsSection />
			</section>

			<section className="py-16">
				<ContactEvents />
			</section>

			<section className="py-16 bg-primary/10">
				<CtaEvents />
			</section>
		</>
	);
}
