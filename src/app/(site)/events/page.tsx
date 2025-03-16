import { ContactEvents } from '@/components/user/events/contact-events';
import { CtaEvents } from '@/components/user/events/cta-events';
import { FaqEvents } from '@/components/user/events/faq-events';
import { HeroEvent } from '@/components/user/events/hero-events';
import { IntroEvent } from '@/components/user/events/intro-events';
import { ProcessEvents } from '@/components/user/events/process-event';
import { ServiceEvents } from '@/components/user/events/service-events';
import { TestimonialsEvents } from '@/components/user/events/test-events';
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
    image: '/placeholder.svg?height=300&width=400',
    features: [
      'Découpes sur mesure selon vos besoins',
      'Livraison le jour de l\'événement',
      'Conseils personnalisés sur les quantités',
      'Viande halal',
    ],
  },
  {
    id: '2',
    title: 'Fêtes religieuses',
    description: "Viande halal pour l'Aïd et autres célébrations religieuses",
    image: '/placeholder.svg?height=300&width=400',
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
    image: '/placeholder.svg?height=300&width=400',
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
    image: '/placeholder.svg?height=300&width=400',
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
    name: 'Ahmed K.',
    event: 'Mariage',
    quote:
      'La qualité de la viande était exceptionnelle. Tous nos invités ont été impressionnés par le repas. Merci pour votre service impeccable !',
    image: '/placeholder.svg?height=100&width=100',
  },
  {
    id: '2',
    name: 'Fatima M.',
    event: 'Aïd al-Adha',
    quote:
      "Nous commandons notre mouton chez eux chaque année pour l'Aïd. La viande est toujours fraîche et préparée selon nos traditions.",
    image: '/placeholder.svg?height=100&width=100',
  },
  {
    id: '3',
    name: 'Jean D.',
    event: "Réception d'entreprise",
    quote:
      "Service professionnel et ponctuel. La qualité était au rendez-vous et le prix très compétitif pour notre événement d'entreprise.",
    image: '/placeholder.svg?height=100&width=100',
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

      {/* FAQ section */}
      <section className="py-16 bg-muted/30">
        <FaqEvents />
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
