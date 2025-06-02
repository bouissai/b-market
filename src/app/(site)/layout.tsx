import { FooterSite } from '@/components/site/footer/footer-site';
import { HeaderSite } from '@/components/site/header/header-site';
import { CartMergeDialog } from '@/components/site/landingPage/cart-merge-dialog';
import { ThemeProvider } from '@/components/theme-provider';

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<ThemeProvider forcedTheme={'dark'}>
				<div className="font-sans bg-boucherie-black text-white">
					<HeaderSite />
					<main>{children}</main>
					<CartMergeDialog />
					<FooterSite />
				</div>
			</ThemeProvider>
		</>
	);
}
