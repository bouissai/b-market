import { Award, Heart, Users } from 'lucide-react';
import { AnimatedSection } from '../animations/animated-section';

export function WhyChooseUsSection() {
  return (
    <section className="py-12 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted/20 via-transparent to-transparent" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Visual Left */}
            <AnimatedSection className="order-2 lg:order-1">
              <div className="relative h-[500px] rounded-lg overflow-hidden border border-border/30">
                <img
                  src="./images/pourquoi-choisir.png"
                  alt="Pourquoi nous choisir"
                  className="object-cover"
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              </div>
            </AnimatedSection>

            {/* Content Right */}
            <AnimatedSection delay={200} className="order-1 lg:order-2">
              <div className="space-y-12">
                <div>
                  <h2 className="text-sm font-light text-muted-foreground tracking-widest uppercase mb-6">
                    Notre engagement
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-light text-foreground tracking-tight leading-tight">
                    Pourquoi choisir Bmarket ?
                  </h3>
                </div>

                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <Award className="w-10 h-10 text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-light text-foreground">Qualité garantie</h4>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        Nous sélectionnons rigoureusement nos viandes auprès d&apos;éleveurs locaux certifiés. Traçabilité
                        totale de la ferme à votre assiette.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <Users className="w-10 h-10 text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-light text-foreground">Savoir-faire artisanal</h4>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        Nos bouchers passionnés perpétuent les techniques traditionnelles de découpe et de préparation
                        depuis trois générations.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <Heart className="w-10 h-10 text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-light text-foreground">Service personnalisé</h4>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        Conseils sur mesure, découpes personnalisées et recommandations culinaires pour sublimer
                        chaque pièce de viande.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
