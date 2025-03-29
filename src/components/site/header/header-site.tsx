'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MENU_ITEMS } from '@/constants';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { BasketButton } from './basket-button';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { MobileMenu } from './mobile-menu';

export function HeaderSite() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const { data: session } = useSession();
	const router = useRouter();
	const { signOut } = useAuthStore();

	const goTo = (path: string) => {
		router.push(path);
		setIsMobileMenuOpen(false);
	};

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 10);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<header
			className={`fixed w-full z-50 transition-all duration-300 animate-fadeIn ${
				isScrolled
					? 'bg-boucherie-black/95 backdrop-blur-md border-b border-boucherie-red/20 py-2'
					: 'bg-transparent py-4'
			}`}>
			<div className="container-custom">
				<div className="flex items-center justify-between">
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
					<nav className="hidden lg:flex items-center">
						<div className="space-x-1">
							{MENU_ITEMS.map(item => (
								<Link
									key={item.label}
									href={item.href}
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
											Se dÃ©connecter
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

					<Button
						size="icon"
						className="lg:hidden bg-boucherie-red text-white hover:bg-boucherie-red-light"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label="Toggle menu">
						{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</Button>
				</div>
			</div>
			<MobileMenu
				isOpen={isMobileMenuOpen}
				onClose={() => setIsMobileMenuOpen(false)}
			/>
		</header>
	);
}
