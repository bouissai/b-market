import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/devanture-bmarket-hero.webp"
          alt="Viande premium"
          fill
          className="object-cover opacity-40"
          sizes="100vw"
          quality={50}
          priority
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-light text-foreground tracking-tight leading-[1.1] mb-8 text-balance">
          <span className="text-accent">Boucherie halal </span>
          à Grenoble
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Découvrez B Market à Fontaine, votre boucherie artisanale près de Grenoble pour viandes fraîches, découpes
          sur mesure, préparations maison et click-and-collect.
        </p>
        <Button asChild size="lg" variant="accent">
          <Link href="/products" className="flex items-center gap-2">
            Commander maintenant
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
