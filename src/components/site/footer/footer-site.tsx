import Link from 'next/link';
import { Facebook, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Image from 'next/image';

export function FooterSite() {
	return (
		<footer className="bg-boucherie-black text-white pt-20 pb-10 border-t border-boucherie-red/20">
			<div className="container-custom">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
					<div>
						<div className="flex items-center mb-6">
							<Link
								href="/"
								className="flex items-center space-x-2 transition-transform hover:scale-105">
								<div className="w-12 h-12 rounded-full overflow-hidden border border-boucherie-red/50">
									<Image
										src="/images/logo.png"
										alt="B Market Logo"
										width={48}
										height={48}
										className="rounded-full object-cover bg-boucherie-red text-white"
									/>
								</div>
								<span className="text-2xl font-bold gradient-text font-playfair ">
									B Market
								</span>
							</Link>
						</div>
						<p className="text-gray-400 mb-6">
							Boucherie artisanale halal depuis 1982. Nous vous proposons
							des viandes fraîches de qualité, découpées sur place par
							nos bouchers expérimentés.
						</p>
						<div className="flex space-x-4">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-boucherie-red transition-colors">
								<Instagram className="h-6 w-6" />
							</a>
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-boucherie-red transition-colors">
								<Facebook className="h-6 w-6" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-semibold mb-6 flex items-center">
							<span className="w-8 h-0.5 bg-boucherie-red mr-3"></span>
							Liens Rapides
						</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/produits"
									className="text-gray-400 hover:text-boucherie-red transition-colors">
									Nos Produits
								</Link>
							</li>
							<li>
								<Link
									href="/services"
									className="text-gray-400 hover:text-boucherie-red transition-colors">
									Nos Services
								</Link>
							</li>
							<li>
								<Link
									href="/recettes"
									className="text-gray-400 hover:text-boucherie-red transition-colors">
									Recettes
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-gray-400 hover:text-boucherie-red transition-colors">
									Contact
								</Link>
							</li>
							<li>
								<Link
									href="/commande"
									className="text-gray-400 hover:text-boucherie-red transition-colors">
									Commander en ligne
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Information */}
					<div>
						<h3 className="text-lg font-semibold mb-6 flex items-center">
							<span className="w-8 h-0.5 bg-boucherie-red mr-3"></span>
							Nous Contacter
						</h3>
						<ul className="space-y-4">
							<li className="flex items-start">
								<MapPin className="h-6 w-6 text-boucherie-red shrink-0 mt-0.5 mr-3" />
								<span className="text-gray-400">
									<div>Fontaine: 123 Rue de la Boucherie, 38600</div>
									<div>Meylan: 456 Avenue des Viandes, 38240</div>
								</span>
							</li>
							<li className="flex items-center">
								<Phone className="h-6 w-6 text-boucherie-red mr-3" />
								<span className="text-gray-400">04 76 12 34 56</span>
							</li>
							<li className="flex items-center">
								<Mail className="h-6 w-6 text-boucherie-red mr-3" />
								<span className="text-gray-400">
									contact@bmarket.fr
								</span>
							</li>
						</ul>
					</div>

					{/* Business Hours */}
					<div>
						<h3 className="text-lg font-semibold mb-6 flex items-center">
							<span className="w-8 h-0.5 bg-boucherie-red mr-3"></span>
							Horaires d'Ouverture
						</h3>
						<ul className="space-y-3">
							<li className="flex items-start">
								<Clock className="h-6 w-6 text-boucherie-red shrink-0 mt-0.5 mr-3" />
								<div>
									<p className="text-gray-400">Lundi - Samedi:</p>
									<p className="font-semibold text-white">
										8h00 - 19h30
									</p>
								</div>
							</li>
							<li className="flex items-start">
								<Clock className="h-6 w-6 text-boucherie-red shrink-0 mt-0.5 mr-3" />
								<div>
									<p className="text-gray-400">Dimanche:</p>
									<p className="font-semibold text-white">
										8h00 - 13h00
									</p>
								</div>
							</li>
						</ul>
					</div>
				</div>

				{/* Newsletter Subscription */}
				<div className="border-t border-boucherie-red/20 pt-10 pb-8 mb-8">
					<div className="max-w-2xl mx-auto text-center">
						<h3 className="text-xl font-semibold mb-4 font-playfair">
							Inscrivez-vous à Notre Newsletter
						</h3>
						<p className="text-gray-400 mb-6">
							Recevez nos offres spéciales et nos nouvelles recettes
							directement dans votre boîte mail.
						</p>
						<form className="flex flex-col sm:flex-row gap-4">
							<input
								type="email"
								placeholder="Votre adresse email"
								className="flex-grow px-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-boucherie-red border border-boucherie-red/30"
							/>
							<button type="submit" className="boucherie-button">
								S'inscrire
							</button>
						</form>
					</div>
				</div>

				{/* Copyright */}
				<div className="text-center text-gray-500 text-sm">
					<p>
						&copy; {new Date().getFullYear()} Boucherie B Market. Tous
						droits réservés.
					</p>
					<p className="mt-2">
						<span className="inline-block">
							Boucherie artisanale halal depuis 1982
						</span>
						<span className="mx-2">|</span>
						<span className="inline-block">Qualité et tradition</span>
					</p>
				</div>
			</div>
		</footer>
	);
}
