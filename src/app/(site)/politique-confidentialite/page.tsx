import { BUSINESS_INFO } from '@/lib/site-seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Politique de confidentialité',
	description:
		'Politique de confidentialité de B Market, boucherie halal à Fontaine près de Grenoble.',
	alternates: {
		canonical: '/politique-confidentialite',
	},
};

export default function PolitiqueConfidentialitePage() {
	return (
		<article className="mx-auto max-w-4xl px-6 py-16">
			<header className="mb-10">
				<h1 className="font-sans text-4xl md:text-6xl font-light tracking-tight">
					Politique de confidentialité
				</h1>
				<p className="mt-4 text-muted-foreground">
					Cette page explique comment B Market traite les données personnelles collectées via le site.
				</p>
			</header>

			<div className="space-y-8 leading-relaxed">
				<section>
					<h2 className="text-2xl font-semibold">Responsable du traitement</h2>
					<p className="mt-3">
						Le responsable du traitement est {BUSINESS_INFO.legalName}, exploitant B Market, situé au{' '}
						{BUSINESS_INFO.address}. Contact : {BUSINESS_INFO.email}.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold">Données collectées</h2>
					<p className="mt-3">
						Les données collectées peuvent inclure les informations de compte, coordonnées, commandes,
						messages envoyés via le formulaire de contact, préférences de retrait et données techniques
						nécessaires au fonctionnement du site.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold">Finalités</h2>
					<ul className="mt-4 list-disc space-y-2 pl-6">
						<li>Créer et gérer les comptes clients.</li>
						<li>Préparer les commandes et demandes de click-and-collect.</li>
						<li>Répondre aux messages envoyés via le site.</li>
						<li>Assurer la sécurité, la maintenance et l&apos;amélioration du service.</li>
						<li>Envoyer des communications commerciales uniquement lorsque l&apos;utilisateur y consent.</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold">Durée de conservation</h2>
					<p className="mt-3">
						Les données sont conservées pendant la durée nécessaire aux finalités décrites ci-dessus, puis
						archivées ou supprimées selon les obligations légales applicables.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold">Cookies et session</h2>
					<p className="mt-3">
						Le site peut utiliser des cookies ou technologies similaires nécessaires à l&apos;authentification, au
						panier, à la sécurité et au bon fonctionnement du service.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold">Droits des utilisateurs</h2>
					<p className="mt-3">
						Vous pouvez demander l&apos;accès, la rectification, l&apos;effacement ou la limitation du traitement de vos
						données en écrivant à {BUSINESS_INFO.email}. Vous pouvez également introduire une réclamation auprès
						de la CNIL.
					</p>
				</section>
			</div>
		</article>
	);
}
