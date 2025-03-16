import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function HeroEvent() {

    return (
        <>
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
        </>
    )
}