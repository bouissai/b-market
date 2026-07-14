import { Button } from '@/components/ui/button';
import { GENERAL_INFO } from '@/constants';
import { BUSINESS_INFO } from '@/lib/site-seo';
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function FooterSite() {
	const developers = [
		{ name: 'Ilyass B', href: 'https://github.com/bouissai' },
		{
			name: 'Yassine',
			href: 'https://github.com/moslehy?tab=repositories',
		},
		{ name: 'Flavien', href: 'https://github.com/flavien-smn' },
	];

	return (
		<footer className="px-8 pt-20 pb-10 border-t">
			<div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
					<div>
						<div className="flex items-center mb-6">
							<Link
								href="/"
								className="flex items-center space-x-2 transition-transform hover:scale-105">
								<div className="w-12 h-12 rounded-full overflow-hidden border">
									<Image
										src="/images/logo.png"
										alt="B Market Logo"
										width={48}
										height={48}
										className="rounded-full object-cover"
									/>
								</div>
								<span className="text-2xl font-bold font-playfair">
									B Market
								</span>
							</Link>
						</div>
						<p className="mb-6">
							Boucherie halal artisanale près de Grenoble depuis 1982. Nous
							vous proposons des viandes fraîches de qualité, découpées sur
							place par nos bouchers expérimentés.
						</p>
						<div className="flex space-x-4">
							<a
								href="https://www.instagram.com/bmarket_38/?hl=fr"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
								aria-label="Instagram">
								<Instagram className="h-5 w-5" />
							</a>
							<a
								href="https://www.facebook.com/boucherieimene/?locale=fr_FR"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
								aria-label="Facebook">
								<Facebook className="h-5 w-5" />
							</a>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-6 flex items-center">
							<span className="w-8 h-0.5 mr-3 bg-primary" />
							Nous contacter
						</h3>
						<ul className="space-y-4">
							<li className="flex items-start">
								<MapPin className="h-6 w-6 shrink-0 mt-0.5 mr-3" />
								<span>{GENERAL_INFO.address}</span>
							</li>
							<li className="flex items-center">
								<Phone className="h-6 w-6 mr-3" />
								<span>{GENERAL_INFO.phone}</span>
							</li>
							<li className="flex items-center">
								<Mail className="h-6 w-6 mr-3" />
								<span>{GENERAL_INFO.email}</span>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-6 flex items-center">
							<span className="w-8 h-0.5 mr-3 bg-primary" />
							Horaires d&apos;ouverture
						</h3>
						<ul className="space-y-3">
							{GENERAL_INFO.openingHours.map((item, index) => (
								<li key={index} className="flex items-start">
									<Clock className="h-6 w-6 shrink-0 mt-0.5 mr-3" />
									<div>
										<p>{item.days}:</p>
										{item.hours.map((hour, i) => (
											<p key={i} className="font-semibold">
												{hour}
											</p>
										))}
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="border-t pt-10 pb-8 mb-8">
					<div className="max-w-2xl mx-auto text-center">
						<h3 className="text-xl font-semibold mb-4 font-playfair">
							Inscrivez-vous à notre newsletter
						</h3>
						<p className="mb-6">
							Recevez nos offres spéciales et nos nouvelles recettes
							directement dans votre boîte mail.
						</p>
						<form className="flex flex-col sm:flex-row gap-4">
							<input
								type="email"
								placeholder="Votre adresse email"
								className="flex-grow px-4 py-3 rounded-md focus:outline-none focus:ring-2"
							/>
							<Button type="submit">S&apos;inscrire</Button>
						</form>
					</div>
				</div>

				<div className="text-center text-sm">
					<p>
						&copy; {new Date().getFullYear()} Boucherie B Market. Tous
						droits réservés.
					</p>
					<p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-foreground/80">
						<span>Développé par</span>
						{developers.map((developer, index) => (
							<span key={developer.href} className="inline-flex items-center gap-2">
								<a
									href={developer.href}
									target="_blank"
									rel="noopener noreferrer"
									className="underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									aria-label={`Voir le GitHub de ${developer.name}`}>
									{developer.name}
								</a>
								{index < developers.length - 1 && (
									<span aria-hidden="true">·</span>
								)}
							</span>
						))}
					</p>
					<p className="mt-2">
						<span className="inline-block">
							Boucherie artisanale halal depuis 1982
						</span>
						<span className="mx-2">|</span>
						<span className="inline-block">Qualité et tradition</span>
					</p>
					<nav
						aria-label="Informations légales"
						className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
						<Link
							href="/mentions-legales"
							className="underline-offset-4 transition-colors hover:text-foreground hover:underline">
							Mentions légales
						</Link>
						<Link
							href="/politique-confidentialite"
							className="underline-offset-4 transition-colors hover:text-foreground hover:underline">
							Politique de confidentialité
						</Link>
					</nav>
					<p className="mt-3 text-foreground/80">
						{BUSINESS_INFO.legalName} ({BUSINESS_INFO.name}) - SIREN{' '}
						{BUSINESS_INFO.siren}
					</p>
				</div>
			</div>
		</footer>
	);
}
