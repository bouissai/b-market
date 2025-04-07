import Link from 'next/link';
import { Facebook, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Image from 'next/image';
import { GENERAL_INFO, MENU_ITEMS } from '@/constants';

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

					<div>
						<h3 className="text-lg font-semibold mb-6 flex items-center">
							<span className="w-8 h-0.5 bg-boucherie-red mr-3"></span>
							Liens Rapides
						</h3>
						<ul className="space-y-3">
							{MENU_ITEMS.map(item => (
								<li key={item.href}>
									<Link
										href={item.href}
										className="text-gray-400 hover:text-boucherie-red transition-colors">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-6 flex items-center">
							<span className="w-8 h-0.5 bg-boucherie-red mr-3"></span>
							Nous Contacter
						</h3>
						<ul className="space-y-4">
							<li className="flex items-start">
								<MapPin className="h-6 w-6 text-boucherie-red shrink-0 mt-0.5 mr-3" />
								<span className="text-gray-400">
									<div>{GENERAL_INFO.address}</div>
								</span>
							</li>
							<li className="flex items-center">
								<Phone className="h-6 w-6 text-boucherie-red mr-3" />
								<span className="text-gray-400">
									{GENERAL_INFO.phone}
								</span>
							</li>
							<li className="flex items-center">
								<Mail className="h-6 w-6 text-boucherie-red mr-3" />
								<span className="text-gray-400">
									{GENERAL_INFO.email}
								</span>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-6 flex items-center">
							<span className="w-8 h-0.5 bg-boucherie-red mr-3"></span>
							Horaires d'Ouverture
						</h3>
						<ul className="space-y-3">
							{GENERAL_INFO.openingHours.map((item, index) => (
								<li key={index} className="flex items-start">
									<Clock className="h-6 w-6 text-boucherie-red shrink-0 mt-0.5 mr-3" />
									<div>
										<p className="text-gray-400">{item.days}:</p>
										{item.hours.map((hour, i) => (
											<p
												key={i}
												className="font-semibold text-white">
												{hour}
											</p>
										))}
									</div>
								</li>
							))}
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
