import TabsProduit from '@/components/products';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nos produits | Votre Boucherie',
  description:
    'Découvrez tous nos produits de qualité',
};

export default function Produits() {
  return (
    <div className=''>
      {/* Hero section */}
      <section className="bg-muted/30 md:py-12 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Nos Produits
            </h1>
            <p className="text-muted-foreground mb-6">
              Découvrez notre sélection de recettes délicieuses préparées avec
              nos viandes de qualité. De l'entrée au plat principal, pour le
              quotidien ou pour vos événements spéciaux.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <TabsProduit />
        </div>
      </section>
    </div>
  );
}
