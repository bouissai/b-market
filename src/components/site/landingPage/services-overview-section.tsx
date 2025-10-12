import { Calendar, ChefHat, Clock } from 'lucide-react';
import { AnimatedSection } from '../animations/animated-section';


export function ServicesOverviewSection() {
	return (
		<section className="py-12 relative bg-muted/30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Content Left */}
              <AnimatedSection>
                <div className="space-y-12">
                  <div>
                    <h2 className="text-sm font-light text-muted-foreground tracking-widest uppercase mb-6">
                      Nos services
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-light text-foreground tracking-tight leading-tight">
                      Une expérience sur mesure
                    </h3>
                  </div>

                  <div className="space-y-10">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-background/50 backdrop-blur flex items-center justify-center border border-border/30">
                          <Clock className="w-7 h-7 text-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-light text-foreground">Click & Collect</h4>
                        <p className="text-muted-foreground font-light leading-relaxed">
                          Commandez en ligne et récupérez vos produits en boutique. Gain de temps garanti.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-background/50 backdrop-blur flex items-center justify-center border border-border/30">
                          <ChefHat className="w-7 h-7 text-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-light text-foreground">Recettes maison</h4>
                        <p className="text-muted-foreground font-light leading-relaxed">
                          Découvrez nos préparations artisanales et nos marinades exclusives.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-background/50 backdrop-blur flex items-center justify-center border border-border/30">
                          <Calendar className="w-7 h-7 text-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-light text-foreground">Événements</h4>
                        <p className="text-muted-foreground font-light leading-relaxed">
                          Barbecues, réceptions, mariages : nous préparons vos événements sur mesure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Visual Right */}
              <AnimatedSection delay={200}>
                <div className="relative h-[500px] rounded-lg overflow-hidden border border-border/30">
                  <img
                    src="./images/beef-tenderloin-fillet-on-marble-surface.png"
                    alt="Nos services"
                    className="object-cover w-full h-full absolute inset-0"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                </div>
              </AnimatedSection>
          </div>
        </div>
        </div>
      </section>
	);
}
