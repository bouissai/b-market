import { Clock, Facebook, Instagram, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export function FooterUser() {
    return (
        <footer className="bg-gray-100 text-gray-600 py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Horaires d'ouverture</h2>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                <span>Mardi - Dimanche: 9h - 18h</span>
                            </li>
                            <li className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                <span>Lundi: Fermé</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Suivez-nous</h2>
                        <div className="flex space-x-4">
                            <Link href="https://www.facebook.com" className="hover:text-blue-600 transition-colors">
                                <Facebook className="h-6 w-6" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="https://www.instagram.com" className="hover:text-pink-600 transition-colors">
                                <Instagram className="h-6 w-6" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Contact</h2>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <Phone className="mr-2 h-4 w-4" />
                                <span>+33 1 23 45 67 89</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="mr-2 h-4 w-4" />
                                <span>contact@example.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex flex-wrap justify-between items-center">
                        <p className="text-sm">&copy; 2024 Votre Entreprise. Tous droits réservés.</p>
                        <nav className="flex space-x-4 text-sm">
                            <Link href="/mentions-legales" className="hover:underline">Mentions légales</Link>
                            <Link href="/politique-de-confidentialite" className="hover:underline">Politique de confidentialité</Link>
                            <Link href="/cgv" className="hover:underline">CGV</Link>
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    )
}
