'use client';

import { Toaster } from '../ui/toaster';
import { FooterSite } from './footer/footer-site';
import { HeaderSite } from './header/header-site';

export function UserNavBar({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<HeaderSite />
			<main>{children}</main>
			<Toaster />
			<FooterSite />
		</div>
	);
}
