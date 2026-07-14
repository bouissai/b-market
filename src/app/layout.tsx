import '@/app/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { BUSINESS_INFO, LOCAL_SEO_KEYWORDS, SITE_URL } from '@/lib/site-seo';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Montserrat, Playfair_Display } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

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
	metadataBase: new URL(SITE_URL),
	applicationName: 'B Market Grenoble',
	title: {
		default: 'Boucherie halal Grenoble | B Market',
		template: '%s | B Market Grenoble',
	},
	description:
		'B Market est votre boucherie halal proche de Grenoble, à Fontaine. Viandes fraîches, découpes artisanales, préparations maison, traiteur halal et click-and-collect.',
	keywords: LOCAL_SEO_KEYWORDS,
	alternates: {
		canonical: '/',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1,
		},
	},
	authors: [{ name: BUSINESS_INFO.legalName }],
	creator: 'B Market',
	publisher: BUSINESS_INFO.legalName,
	openGraph: {
		type: 'website',
		url: SITE_URL,
		locale: 'fr_FR',
		title: 'Boucherie halal Grenoble | B Market',
		description:
			'Boucherie halal artisanale près de Grenoble : viandes fraîches, découpes sur mesure, préparations maison et click-and-collect à Fontaine.',
		images: [
			{
				url: '/images/devanture-bmarket-hero.webp',
				width: 1200,
				height: 630,
				alt: 'Viande de boucherie halal B Market Grenoble',
			},
		],
		siteName: 'B Market - Boucherie halal Grenoble',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Boucherie halal Grenoble | B Market',
		description:
			'Viandes fraîches, boucherie halal artisanale et click-and-collect près de Grenoble.',
		images: ['/images/devanture-bmarket-hero.webp'],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="fr" className={`${playfair.variable} ${montserrat.variable}`}>
			<body>
				<Toaster />
				<SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
					<NuqsAdapter>{children}</NuqsAdapter>
				</SessionProvider>
			</body>
		</html>
	);
}
