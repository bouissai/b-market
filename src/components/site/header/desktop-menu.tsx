'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU_ITEMS } from '@/constants';

export function DesktopMenu({ goTo }: { goTo: (href: string) => void }) {
	const pathname = usePathname();

	return (
		<nav className="hidden lg:flex items-center">
			<div className="space-x-1">
				{MENU_ITEMS.map(item => (
					<Link
						key={item.label}
						href={item.href}
						onClick={() => goTo(item.href)}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:scale-105 transform ${
							pathname === item.href
								? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
								: 'hover:text-primary-foreground hover:bg-primary/70 shadow-md'
						}`}>
						{item.label}
					</Link>
				))}
			</div>
		</nav>
	);
}
