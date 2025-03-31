'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MENU_ITEMS } from '@/constants';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/useAuthStore';
import { BasketButton } from './basket-button';

export function DesktopMenu({ goTo }: { goTo: (href: string) => void }) {
	const pathname = usePathname();
	const { data: session } = useSession();
	const { signOut } = useAuthStore();
	const router = useRouter();

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
								? 'text-boucherie-white bg-boucherie-red shadow-md'
								: 'text-boucherie-white hover:text-boucherie-black hover:bg-boucherie-red'
						}`}>
						{item.label}
					</Link>
				))}
			</div>

			<div className="flex mx-10 space-x-1 gap-4">
				<BasketButton />
				{session ? (
					<DropdownMenu>
						<DropdownMenuTrigger className="focus:outline-none">
							<Avatar className="h-9 w-9">
								<AvatarImage
									src="/placeholder.svg"
									alt={session.user?.name || 'U'}
								/>
								<AvatarFallback>
									{session.user?.name?.charAt(0) || 'U'}
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => goTo('/compte?tab=commandes')}>
								Mes commandes
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => goTo('/compte?tab=infos')}>
								Mes informations personnelles
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-red-600"
								onClick={() => signOut(false)}>
								<LogOut className="mr-2 h-4 w-4" />
								Se déconnecter
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Button onClick={() => router.push('/auth')}>
						Se connecter
					</Button>
				)}
			</div>
		</nav>
	);
}
