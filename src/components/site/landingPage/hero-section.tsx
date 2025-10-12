'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
	return (
		<section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1920&h=1080&fit=crop&crop=focalpoint&auto=format&q=80"
            alt="Viande premium"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-light text-foreground tracking-tight leading-[1.1] mb-8 text-balance">
            L&apos;excellence de la viande artisanale
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Découvrez notre sélection de viandes premium, issues d&apos;élevages locaux et préparées avec passion par nos
            artisans bouchers.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 py-6 h-auto"
          >
            <Link href="/produits" className="flex items-center gap-2">
              Commander maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

	);
}
