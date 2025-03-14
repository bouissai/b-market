import { FAQItem } from '@/types/faq';
import {
  Award,
  Beef,
  ChefHat,
  Clock,
  HandPlatter,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Sparkle,
  Sparkles,
  Truck,
} from 'lucide-react';

// Contact information items
export const contactItems = [
  {
    icon: Mail,
    title: 'Email',
    info: 'contact@example.com',
  },
  {
    icon: Phone,
    title: 'Téléphone',
    info: '+33 1 23 45 67 89',
  },
  {
    icon: MapPin,
    title: 'Adresse',
    info: '123 Avenue des Champs-Élysées, 75008 Paris, France',
  },
];

// Hours information
export const hoursInfo = [
  { day: 'Lundi - Vendredi', hours: '9h00 - 18h00' },
  { day: 'Samedi', hours: '10h00 - 15h00' },
  { day: 'Dimanche', hours: 'Fermé' },
];

export const LES_VALEURS = [
  {
    id: 1,
    icon: ChefHat,
    title: 'Savoir-faire',
    description:
      'Un savoir-faire unique dans la préparation des viandes, géré par un boucher expérimenté',
  },
  {
    id: 2,
    icon: Sparkles,
    title: 'Qualité',
    description:
      "Sélection rigoureuse des meilleures viandes, volaille de Drôme et bovin d'Allier.",
  },
  {
    id: 3,
    icon: HandPlatter,
    title: 'Service',
    description:
      'Conseils personnalisés et préparations sur mesure, adaptés à vos besoins.',
  },
];

export const MENU_ITEMS = [
  { label: 'Accueil', href: '/#accueil' },
  { label: 'Nos Produits', href: '/produits' },
  { label: 'Recettes', href: '/recipes' },
  { label: 'Evenements', href: '/events' },
  { label: 'Faq', href: '/faq' },
  { label: 'Contact', href: '/#contact' },
];

export const PRODUCTS = [
  {
    image:
      'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=800&q=80',
    title: 'Viande Fraîche',
    description: 'Bœuf, veau et agneau de première qualité',
  },
  {
    image:
      'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80',
    title: 'Volaille',
    description: 'Poulet, dinde et autres volailles halal',
  },
  {
    image:
      'https://images.unsplash.com/photo-1591674061999-e5ea4778945d?auto=format&fit=crop&w=800&q=80',
    title: 'Préparations Maison',
    description: 'Merguez, kefta et autres spécialités',
  },
];

export const CLICK_COLLECT_STEPS = [
  {
    icon: ShoppingBag,
    title: '1. Commandez',
    description: 'Sélectionnez vos produits en ligne',
  },
  {
    icon: Clock,
    title: '2. Choisissez',
    description: 'Sélectionnez votre créneau de retrait',
  },
  {
    icon: Truck,
    title: '3. Retirez',
    description: 'Récupérez votre commande en magasin',
  },
];

// Données FAQ en respectant le type défini
export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Comment puis-je passer une commande ?',
    answer:
      'Vous pouvez passer une commande directement via notre site en sélectionnant les produits que vous souhaitez acheter et en suivant le processus de commande. Vous avez également la possibilité de passer une commande par téléphone ou en personne à la boucherie.',
  },
  {
    question: 'Quels modes de paiement acceptez-vous ?',
    answer:
      "Les paiements en ligne ne sont malheureusement pas disponibles pour le moment. Sur place, nous acceptons les cartes de crédit, les cartes de débit, l'espèce et les tickets restaurants.",
  },
  {
    question: 'Est-il possible de retourner un produit ?',
    answer:
      "En vertu de l'Article L121-20-2 du code de la consommation, le droit de rétractation ne s'applique pas pour les livraisons de produits frais périssables. En conséquence, une demande d'annulation de commande pour le non-respect du créneau horaire de livraison prévu n'est pas recevable.",
  },
  {
    question: 'Comment puis-je suivre ma commande ?',
    answer:
      'Après avoir passé une commande, vous recevrez un email avec un numéro de suivi et des instructions pour suivre votre commande.',
  },
  {
    question: 'Puis-je annuler ma commande ?',
    answer:
      "Oui, vous pouvez annuler votre commande avant qu'elle ne soit expédiée. Après l'expédition, il faudra procéder à un retour une fois l'article reçu.",
  },
  {
    question: "Quels sont les horaires d'ouverture de la boucherie ?",
    answer:
      "Nous sommes ouverts du lundi au samedi, de 8h00 à 19h00, et fermés le dimanche. Pendant les jours fériés, nos horaires peuvent varier. Consultez notre site ou contactez-nous pour plus d'informations.",
  },
  {
    question: "Est-il possible de passer des commandes à l'avance ?",
    answer:
      "Oui, vous pouvez passer vos commandes à l'avance en ligne via notre système de click-and-collect ou par téléphone. Il suffit de préciser les produits souhaités et la quantité. Vous pourrez récupérer votre commande à la boucherie à l'heure convenue.",
  },
  {
    question: 'Livrez-vous à domicile ?',
    answer:
      'Actuellement, nous proposons uniquement un service de click-and-collect. Vous pouvez passer votre commande en ligne et venir la récupérer directement à la boucherie. La livraison à domicile pourrait être disponible prochainement.',
  },
  {
    question: 'Quels types de viande proposez-vous ?',
    answer:
      "Nous proposons une large gamme de viandes, dont du bœuf, du veau, de l'agneau, du poulet etc. Nous avons également des spécialités comme des paupiette de veau maison, des brochettes et des plats préparés.",
  },
  {
    question: "Les viandes sont-elles d'origine locale ?",
    answer:
      "Nous travaillons avec des éleveurs locaux et régionaux pour garantir des produits de qualité et d'origine contrôlée. La majorité de nos viandes provient de fermes environnantes qui respectent des normes strictes en matière de bien-être animal.",
  },
  {
    question: 'Faites-vous des produits halal ?',
    answer:
      "Nous proposons de la viande halal, préparée selon les règles strictes de l'abattage rituel. Si vous avez des besoins spécifiques, n'hésitez pas à nous le signaler lors de votre commande.",
  },
  {
    question: 'Comment savoir si un produit est disponible ?',
    answer:
      'Vous pouvez consulter la disponibilité des produits directement sur notre site lors de la commande en ligne, ou nous appeler pour vérifier. Notre boucher met régulièrement à jour les produits en stock.',
  },
  {
    question: 'Proposez-vous des offres spéciales ou des réductions ?',
    answer:
      'Nous pouvons proposer des offres spéciales sur certains produits. Suivez-nous sur les réseaux sociaux ou inscrivez-vous à notre newsletter pour être informé de nos promotions.',
  },
  {
    question: 'Comment se déroule le click-and-collect ?',
    answer:
      "Le click-and-collect est simple : passez votre commande en ligne, choisissez votre créneau horaire, et venez la récupérer à la boucherie à l'heure convenue. Vous pourrez payer directement sur place.",
  },
  {
    question: 'Acceptez-vous les paiements par carte ?',
    answer:
      'Oui, nous acceptons les paiements par carte bancaire, espèces et chèques. Pour les commandes importantes ou sur mesure, un acompte peut être demandé.',
  },
  {
    question:
      'Puis-je vous contacter pour des conseils sur la préparation ou la cuisson ?',
    answer:
      'Bien sûr ! Nous sommes heureux de partager des conseils sur la préparation et la cuisson de nos viandes. Demandez nous lors de votre visite.',
  },
];
