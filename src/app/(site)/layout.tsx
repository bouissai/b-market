import '@/app/globals.css';
import { FooterSite } from '@/components/site/footer/footer-site';
import { HeaderSite } from '@/components/site/header/header-site';
import { Metadata, Viewport } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

const playfair = Playfair_Display({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700', '900'],
	variable: '--font-playfair',
});

const montserrat = Montserrat({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	variable: '--font-montserrat',
});

export const metadata: Metadata = {
	title: 'Boucherie Halal Grenoble - Viandes Fraîches & Qualité | BMarket',
	description:
		'Découvrez BMarket, votre boucherie halal à Grenoble. Viandes fraîches, certifiées et de qualité. Commandez en ligne et récupérez en magasin !',
	keywords: [
		'boucherie halal Grenoble',
		'viande halal Grenoble',
		'boucherie Fontaine',
		'boucherie Grenoble',
		"boucherie Saint Martin d'Hères",
		'boucherie Meylan',
		'halal Grenoble',
		'viande de qualité',
	],
	openGraph: {
		type: 'website',
		url: 'https://www.bmarket-grenoble.fr',
		title: 'Boucherie Halal Grenoble - Viandes Fraîches & Qualité | BMarket',
		description:
			'Votre boucherie halal de référence à Grenoble. Viandes fraîches, certifiées, et click-and-collect disponible !',
		images: [
			{
				url: 'https://www.bmarket-grenoble.fr/images/viande-halal.jpg',
				width: 1200,
				height: 630,
				alt: 'Viande Halal de Qualité',
			},
		],
		siteName: 'BMarket - Boucherie Halal Grenoble',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Boucherie Halal Grenoble - Viandes Fraîches & Qualité | BMarket',
		description:
			'Trouvez la meilleure viande halal à Grenoble chez BMarket. Qualité supérieure et service rapide !',
		images: ['https://www.bmarket-grenoble.fr/images/viande-halal.jpg'],
		site: '@BMarketGrenoble',
	},
};

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="fr" className="dark">
			<body
				className={`${playfair.variable} ${montserrat.variable} font-sans bg-boucherie-black text-white`}>
				<HeaderSite />
				<main>{children}</main>
				<FooterSite />
			</body>
		</html>
	);
}
