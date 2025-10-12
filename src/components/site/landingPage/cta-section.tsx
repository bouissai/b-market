import { Mail, MapPin, Phone } from 'lucide-react';
import { AnimatedSection } from '../animations/animated-section';
import { MapComponent } from '../map-component';

export function CTASection() {
  return (
    <section className="py-12 relative bg-muted/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-muted/40 via-muted/20 to-transparent" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-sm font-light text-muted-foreground tracking-widest uppercase mb-6 text-center">
              Nous trouver
            </h2>
            <h3 className="text-4xl md:text-5xl font-light text-foreground text-center mb-20 tracking-tight">
              Notre boutique
            </h3>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <AnimatedSection delay={100}>
              <div className="space-y-12 lg:sticky lg:top-32">
                <div className="p-8 rounded-lg bg-background/30 backdrop-blur border border-border/30">
                  <h4 className="text-xl font-light text-foreground mb-6">Horaires d&apos;ouverture</h4>
                  <div className="space-y-3 text-muted-foreground font-light">
                    <div className="flex justify-between py-2 border-b border-border/20">
                      <span>Lundi</span>
                      <span>Fermé</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Mardi à Dimache</span>
                      <span>09h – 13h, 15h – 19h30</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-start gap-6 p-6 rounded-lg bg-background/20 backdrop-blur border border-border/20">
                    <MapPin className="w-7 h-7 text-foreground flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-light text-foreground mb-2">Adresse</h4>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        39 Bis Av. du Vercors,
                        <br />
                        38600 Fontaine, France
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 p-6 rounded-lg bg-background/20 backdrop-blur border border-border/20">
                    <Phone className="w-7 h-7 text-foreground flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-light text-foreground mb-2">Téléphone</h4>
                      <p className="text-muted-foreground font-light">04 38 86 15 65</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 p-6 rounded-lg bg-background/20 backdrop-blur border border-border/20">
                    <Mail className="w-7 h-7 text-foreground flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-light text-foreground mb-2">Email</h4>
                      <p className="text-muted-foreground font-light">contact@bmarket.fr</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="relative h-[600px] lg:h-[700px] bg-muted/30 rounded-lg overflow-hidden border border-border/30 shadow-2xl">
                <MapComponent></MapComponent>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
