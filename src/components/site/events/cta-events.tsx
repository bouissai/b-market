import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CtaEvents() {
    return (
        <>
            <div className="container mx-auto px-4 text-center ">
                <h2 className="text-3xl font-bold mb-4">
                    Prêt à organiser votre événement ?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Contactez-nous dès aujourd&apos;hui pour discuter de vos besoins et
                    obtenir un devis personnalisé.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild size="lg">
                        <Link href="#contact">Demander un devis</Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg">
                        <Link href="tel:0438861565">Nous appeler</Link>
                    </Button>
                </div>
            </div>
        </>
    )
}