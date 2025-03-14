import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/user/events/event-card';
import ContactForm from '@/components/user/events/contact-form';
import { CheckCircle } from 'lucide-react';

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
      "Livraison le jour de l'événement",
      'Conseils personnalisés sur les quantités',
      'Options halal disponibles',
    ],
  },
  {
    id: '2',
    title: 'Fêtes religieuses',
    description: "Viande halal pour l'Aïd et autres célébrations religieuses",
    image: '/placeholder.svg?height=300&width=400',
    features: [
      'Viande halal certifiée',
      "Moutons entiers pour l'Aïd al-Adha",
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
        <div className="relative h-[400px] md:h-[500px]">
          <Image
            src="/placeholder.svg?height=500&width=1200"
            alt="Viande de qualité pour événements"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                Viande de qualité pour vos événements spéciaux
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Faites de votre célébration un moment inoubliable avec notre
                sélection de viandes fraîches et de qualité supérieure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Link href="#contact">Demander un devis</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <Link href="#services">Nos services</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Votre partenaire pour tous vos événements
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Depuis plus de 15 ans, notre boucherie fournit de la viande de
              qualité supérieure pour les événements les plus importants de
              votre vie. Que ce soit pour un mariage, une fête religieuse ou une
              célébration familiale, nous vous garantissons fraîcheur, qualité
              et service personnalisé.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="bg-background p-4 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-primary mb-2">500+</p>
                <p className="text-sm text-muted-foreground">
                  Événements servis
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-primary mb-2">100%</p>
                <p className="text-sm text-muted-foreground">
                  Satisfaction client
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-primary mb-2">15+</p>
                <p className="text-sm text-muted-foreground">
                  Années d'expérience
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-primary mb-2">24h</p>
                <p className="text-sm text-muted-foreground">
                  Délai de livraison
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Nos services pour événements
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nous proposons une gamme complète de services pour répondre à tous
              vos besoins en viande pour vos événements spéciaux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {eventTypes.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Process section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Un processus simple en 4 étapes pour vous fournir la meilleure
              viande pour votre événement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm text-center relative">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Contactez-nous</h3>
              <p className="text-muted-foreground">
                Remplissez notre formulaire ou appelez-nous pour discuter de vos
                besoins.
              </p>
              {/* Flèche de connexion (visible uniquement sur desktop) */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  />
                </svg>
              </div>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm text-center relative">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Devis personnalisé</h3>
              <p className="text-muted-foreground">
                Nous vous préparons un devis adapté à votre événement et budget.
              </p>
              {/* Flèche de connexion (visible uniquement sur desktop) */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  />
                </svg>
              </div>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm text-center relative">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Confirmation</h3>
              <p className="text-muted-foreground">
                Validez votre commande et choisissez votre mode de livraison.
              </p>
              {/* Flèche de connexion (visible uniquement sur desktop) */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  />
                </svg>
              </div>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Livraison</h3>
              <p className="text-muted-foreground">
                Nous livrons votre commande fraîche et prête pour votre
                événement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez les témoignages de clients satisfaits qui nous ont fait
              confiance pour leurs événements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-background p-6 rounded-lg shadow-sm border"
              >
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image || '/placeholder.svg'}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.event}
                    </p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur nos services pour événements.
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">
                Combien de temps à l'avance dois-je réserver ?
              </h3>
              <p className="text-muted-foreground">
                Nous recommandons de réserver au moins 2 semaines à l'avance
                pour les petits événements et 1 mois pour les grands événements
                comme les mariages.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">
                Proposez-vous de la viande halal ?
              </h3>
              <p className="text-muted-foreground">
                Oui, toute notre viande est halal et certifiée selon les normes
                religieuses.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">
                Livrez-vous à domicile ?
              </h3>
              <p className="text-muted-foreground">
                Oui, nous proposons la livraison à domicile ou sur le lieu de
                votre événement dans un rayon de 50 km.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">
                Quelle quantité commander pour mon événement ?
              </h3>
              <p className="text-muted-foreground">
                Nous vous conseillons sur les quantités en fonction du nombre
                d'invités et du type d'événement. Contactez-nous pour une
                estimation personnalisée.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">
                Puis-je modifier ma commande après confirmation ?
              </h3>
              <p className="text-muted-foreground">
                Oui, vous pouvez modifier votre commande jusqu'à 48 heures avant
                la date de livraison.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">
                Quels modes de paiement acceptez-vous ?
              </h3>
              <p className="text-muted-foreground">
                Nous acceptons les paiements par carte bancaire, espèces et
                virement bancaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Contactez-nous pour votre événement
              </h2>
              <p className="text-muted-foreground mb-8">
                Remplissez le formulaire ci-dessous ou contactez-nous
                directement par téléphone pour discuter de vos besoins
                spécifiques.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Téléphone</h3>
                    <p className="text-muted-foreground">01 23 45 67 89</p>
                    <p className="text-sm text-muted-foreground">
                      Lun-Sam: 8h-19h
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">
                      evenements@votreboucherie.fr
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Nous répondons sous 24h
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Adresse</h3>
                    <p className="text-muted-foreground">
                      123 Rue du Commerce, 75000 Paris
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Venez nous rencontrer
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Pourquoi nous choisir pour votre événement ?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Viande fraîche et de qualité supérieure</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Service personnalisé selon vos besoins</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Livraison ponctuelle garantie</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Viande halal certifiée</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Plus de 15 ans d'expérience</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à organiser votre événement ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour discuter de vos besoins et
            obtenir un devis personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link href="#contact">Demander un devis</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="tel:0123456789">Nous appeler</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
