import { Award, ThumbsUp, Clock, ShoppingBag, Truck } from 'lucide-react';

export const MENU_ITEMS = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Nos Produits', href: '#produits' },
  { label: 'Click & Collect', href: '#click-collect' },
  { label: 'Contact', href: '#contact' }
];

export const FEATURES = [
  {
    icon: Award,
    title: "100% Halal",
    description: "Viande certifiée halal de première qualité"
  },
  {
    icon: ThumbsUp,
    title: "Qualité Premium",
    description: "Sélection rigoureuse de nos viandes depuis plus de 30 ans"
  },
  {
    icon: Clock,
    title: "Click & Collect",
    description: "Commandez en ligne et retirez en magasin"
  }
];

export const PRODUCTS = [
  {
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=800&q=80",
    title: "Viande Fraîche",
    description: "Bœuf, veau et agneau de première qualité"
  },
  {
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80",
    title: "Volaille",
    description: "Poulet, dinde et autres volailles halal"
  },
  {
    image: "https://images.unsplash.com/photo-1591674061999-e5ea4778945d?auto=format&fit=crop&w=800&q=80",
    title: "Préparations Maison",
    description: "Merguez, kefta et autres spécialités"
  }
];

export const CLICK_COLLECT_STEPS = [
  {
    icon: ShoppingBag,
    title: "1. Commandez",
    description: "Sélectionnez vos produits en ligne"
  },
  {
    icon: Clock,
    title: "2. Choisissez",
    description: "Sélectionnez votre créneau de retrait"
  },
  {
    icon: Truck,
    title: "3. Retirez",
    description: "Récupérez votre commande en magasin"
  }
];