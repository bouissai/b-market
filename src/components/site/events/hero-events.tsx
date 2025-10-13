import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function HeroEvent() {

    return (
        <>
            <div className="relative h-[450px] md:h-[500px]">
                <Image
                    src="/images/events.webp"
                    alt="Viande de qualité pour événements"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
            </div>
            <div className="absolute inset-0 z-20 flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 ">
                            Viande de qualité pour vos événements spéciaux
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-primary/90">
                            Faites de votre célébration un moment inoubliable avec notre
                            sélection de viandes fraîches et de qualité supérieure.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                asChild
                                size="lg"
                            >
                                <Link href="#contact">Demander un devis</Link>
                            </Button>
                            <Button
                                asChild
                                variant="secondary"
                                size="lg"
                            >
                                <Link href="#services">Nos services</Link>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}