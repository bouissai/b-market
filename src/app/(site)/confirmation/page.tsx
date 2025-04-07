import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default function ConfirmationPage() {
  const orderNumber = "CMD-" + Math.floor(Math.random() * 10000)

  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Commande confirmée</h1>
          <p className="text-muted-foreground mt-2">
            Merci pour votre commande ! Votre numéro de commande est <strong>{orderNumber}</strong>
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-start">
                <Clock className="mr-4 h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Retrait en boutique</h3>
                  <p className="text-muted-foreground">Demain, entre 14h00 et 17h00</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="mr-4 h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Adresse</h3>
                  <p className="text-muted-foreground">B-Market, 123 Rue de la Boucherie, 75001 Paris</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="mr-4 h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Contact</h3>
                  <p className="text-muted-foreground">01 23 45 67 89</p>
                  <p className="text-muted-foreground">contact@b-market.fr</p>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold mb-4">Récapitulatif de la commande</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Entrecôte (2)</span>
                    <span>57,80 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Filet Mignon (1)</span>
                    <span>22,90 €</span>
                  </div>
                  <div className="border-t my-2 pt-2"></div>
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>80,70 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span>Gratuit</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>80,70 €</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8 gap-4">
          <Button asChild variant="outline">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
          <Button asChild>
            <Link href="/compte">Voir mes commandes</Link>
          </Button>
        </div>
      </main>

    </div>
  )
}

