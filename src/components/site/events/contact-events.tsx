import { CheckCircle } from "lucide-react";
import ContactFormEvent from "./contact-form-events";

export function ContactEvents() {
    return (
        <>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">
                            Contactez-nous pour votre événement
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Remplissez le formulaire ci-dessous ou contactez-nous
                            directement par téléphone pour discuter de vos besoins
                            spécifiques.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-primary"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Téléphone</h3>
                                    <p className="text-muted-foreground">04 38 86 15 65</p>
                                    <p className="text-sm text-muted-foreground">
                                        Mardi - Dimanche: 9h - 18h
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-primary"
                                    >
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <p className="text-muted-foreground">
                                        evenements@votreboucherie.fr
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Nous répondons sous 24h
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-primary"
                                    >
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Adresse</h3>
                                    <p className="text-muted-foreground">
                                        39 Av. du Vercors, 38600 Fontaine
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Venez nous rencontrer
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-muted/30 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">
                                Pourquoi nous choisir pour votre événement ?
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                    <span>Viande fraîche et de qualité</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                    <span>Service personnalisé selon vos besoins</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                    <span>Viande halal certifiée</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <ContactFormEvent />
                    </div>
                </div>
            </div>
        </>
    )
}