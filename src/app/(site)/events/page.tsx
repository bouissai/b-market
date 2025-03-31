import { ContactEvents } from '@/components/site/events/contact-events';
import { CtaEvents } from '@/components/site/events/cta-events';
import { HeroEvent } from '@/components/site/events/hero-events';
import { IntroEvent } from '@/components/site/events/intro-events';
import { ProcessEvents } from '@/components/site/events/process-event';
import { ServiceEvents } from '@/components/site/events/service-events';
import { TestimonialsEvents } from '@/components/site/events/test-events';

import { FAQ_DATA_EVENTS } from '@/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Événements | Votre Boucherie',
	description:
		'Viande de qualité pour vos événements spéciaux - mariages, fêtes religieuses et célébrations',
};

// Données statiques pour les types d'événements
const eventTypes = [
	{
		id: '1',
		title: 'Mariages',
		description: 'Viande de qualité supérieure pour votre jour spécial',
		image: '/images/mariage.webp',
		features: [
			'Découpes sur mesure selon vos besoins',
			"Livraison le jour de l'événement",
			'Conseils personnalisés sur les quantités',
			'Viande halal',
		],
	},
	{
		id: '2',
		title: 'Fêtes religieuses',
		description: "Viande halal pour l'Aïd et autres célébrations religieuses",
		image: '/images/religieux.webp',
		features: [
			'Viande halal certifiée',
			"Découpe de moutons entiers pour l'Aïd al-Adha",
			'Préparation selon les traditions',
			"Réservation à l'avance pour garantir la disponibilité",
		],
	},
	{
		id: '3',
		title: "Événements d'entreprise",
		description: 'Solutions pour vos réceptions et événements professionnels',
		image: '/images/afterwork.webp',
		features: [
			'Grandes quantités disponibles',
			'Options de livraison pour les entreprises',
			'Facturation simplifiée',
			'Devis personnalisés selon vos besoins',
		],
	},
	{
		id: '4',
		title: 'Célébrations familiales',
		description: 'Pour vos réunions de famille et fêtes entre amis',
		image: '/images/famille.webp',
		features: [
			"Portions adaptées à votre nombre d'invités",
			'Préparations spéciales sur demande',
			'Conseils de cuisson offerts',
			'Options économiques disponibles',
		],
	},
];

// Témoignages clients
const testimonials = [
	{
		id: '1',
		name: 'Fa B.',
		date: '5 mois',
		quote: "Hacène n'est pas simplement un boucher mais un artisan-boucher, car il va au delà de la simple vente, il maîtrise l'ensemble du processus. Il fournit un large choix de viandes à ses clients, en vaillant à la leur fraîcheur et leur qualité, il met en œuvre son savoir-faire en découpant, et desossant la viande avec precession. Peut-être elle est un peu plus chère mais c'est de la qualité.",
		image: '/images/faBelli.png',
	},
	{
		id: '2',
		name: 'Annick C.',
		date: '5 mois',
		quote: "Nous commandons notre mouton chez eux chaque année pour l'Aïd. La viande est toujours fraîche et préparée selon nos traditions.",
		image: '/images/annick.png',
	},
	{
		id: '3',
		date: '5 mois',
		name: 'Jean D.',
		quote: "Meilleure boucherie de l'agglomération ! Nous sommes ravis de retrouver notre boucher avec sa viande de qualité !! Service impeccable et toujours bien reçu ! Mes commandes sont toujours préparées avec soin. C'est de loin la meilleure viande de Grenoble !",
		image: '/images/ju.png',
	},
];

export default function EventsPage() {
	return (
		<>
			{/* Hero section */}
			<section className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
				<HeroEvent />
			</section>

			{/* Introduction */}
			<section className="py-16 bg-muted/30">
				<IntroEvent />
			</section>

			{/* Services section */}
			<section id="services" className="py-16">
				<ServiceEvents eventTypes={eventTypes} />
			</section>

			{/* Process section */}
			<section className="py-16 bg-muted/30">
				<ProcessEvents />
			</section>

			{/* Testimonials */}
			<section className="py-16">
				<TestimonialsEvents testimonialsType={testimonials} />
			</section>

			{/* Contact section */}
			<section id="contact" className="py-16">
				<ContactEvents />
			</section>

			{/* CTA section */}
			<section className="py-16 bg-primary/10">
				<CtaEvents />
			</section>
		</>
	);
}
