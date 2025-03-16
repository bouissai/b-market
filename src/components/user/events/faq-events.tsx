export function FaqEvents() {
    return (
        <>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Tout ce que vous devez savoir sur nos services pour événements.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-background p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                            Combien de temps à l'avance dois-je réserver ?
                        </h3>
                        <p className="text-muted-foreground">
                            Nous recommandons de réserver au moins 2 semaines à l'avance
                            pour les petits événements et 1 mois pour les grands événements
                            comme les mariages.
                        </p>
                    </div>

                    <div className="bg-background p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                            Proposez-vous de la viande halal ?
                        </h3>
                        <p className="text-muted-foreground">
                            Oui, toute notre viande est halal et certifiée selon les normes
                            religieuses.
                        </p>
                    </div>

                    <div className="bg-background p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                            Livrez-vous à domicile ?
                        </h3>
                        <p className="text-muted-foreground">
                            Oui, nous proposons la livraison à domicile ou sur le lieu de
                            votre événement dans un rayon de 50 km.
                        </p>
                    </div>

                    <div className="bg-background p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                            Quelle quantité commander pour mon événement ?
                        </h3>
                        <p className="text-muted-foreground">
                            Nous vous conseillons sur les quantités en fonction du nombre
                            d'invités et du type d'événement. Contactez-nous pour une
                            estimation personnalisée.
                        </p>
                    </div>

                    <div className="bg-background p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                            Puis-je modifier ma commande après confirmation ?
                        </h3>
                        <p className="text-muted-foreground">
                            Oui, vous pouvez modifier votre commande jusqu'à 48 heures avant
                            la date de livraison.
                        </p>
                    </div>

                    <div className="bg-background p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                            Quels modes de paiement acceptez-vous ?
                        </h3>
                        <p className="text-muted-foreground">
                            Nous acceptons les paiements par carte bancaire, espèces et
                            virement bancaire.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}