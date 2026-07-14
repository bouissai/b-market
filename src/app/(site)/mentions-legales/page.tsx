import { BUSINESS_INFO } from '@/lib/site-seo';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Mentions légales',
	description:
		'Mentions légales de B Market, boucherie halal à Fontaine près de Grenoble, exploitée par la SARL IMENE.',
	alternates: {
		canonical: '/mentions-legales',
	},
};

export default function MentionsLegalesPage() {
	return (
		<article className="mx-auto max-w-4xl px-6 py-16">
			<header className="mb-10">
				<h1 className="font-sans text-4xl md:text-6xl font-light tracking-tight">
					Mentions légales
				</h1>
				<p className="mt-4 text-muted-foreground">
					Informations relatives au site B Market, boucherie halal à Fontaine près de Grenoble.
				</p>
			</header>

			<div className="space-y-8 leading-relaxed">
				<section>
					<h2 className="text-2xl font-semibold">Éditeur du site</h2>
					<p className="mt-3">
						Le site bmarket-grenoble.fr est édité par {BUSINESS_INFO.legalName}, société à responsabilité limitée.
					</p>
					<ul className="mt-4 space-y-2">
						<li>Nom commercial : {BUSINESS_INFO.name}</li>
						<li>Enseigne : {BUSINESS_INFO.alternateName}</li>
						<li>Adresse : {BUSINESS_INFO.address}</li>
						<li>SIREN : {BUSINESS_INFO.siren}</li>
						<li>SIRET : {BUSINESS_INFO.siret}</li>
						<li>RCS : {BUSINESS_INFO.rcs}</li>
						<li>Capital social : {BUSINESS_INFO.capital}</li>
						<li>TVA intracommunautaire : {BUSINESS_INFO.vatNumber}</li>
						<li>Code APE : {BUSINESS_INFO.ape}</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold">Contact</h2>
					<ul className="mt-4 space-y-2">
						<li>Téléphone : {BUSINESS_INFO.phone}</li>
						<li>Email : {BUSINESS_INFO.email}</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold">Hébergement</h2>
					<p className="mt-3">
						Le site est hébergé sur une infrastructure VPS Linux administrée pour B Market. Les informations
						détaillées de l&apos;hébergeur peuvent être communiquées sur demande à l&apos;adresse {BUSINESS_INFO.email}.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold">Propriété intellectuelle</h2>
					<p className="mt-3">
						Les contenus du site, notamment les textes, visuels, logos, interfaces et éléments graphiques, sont
						protégés. Toute reproduction ou réutilisation non autorisée est interdite.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold">Données personnelles</h2>
					<p className="mt-3">
						Les informations relatives au traitement des données personnelles sont disponibles dans la{' '}
						<Link href="/politique-confidentialite" className="underline underline-offset-4">
							politique de confidentialité
						</Link>
						.
					</p>
				</section>
			</div>
		</article>
	);
}
