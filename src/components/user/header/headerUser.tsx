'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';

import { MENU_ITEMS } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { BasketButton } from './basketButton';
import { MobileMenu } from './mobileMenu';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function HeaderUser() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { data: session } = useSession();
	const router = useRouter();
	const { signOut } = useAuthStore();

	const goTo = (path: string) => {
		router.push(path);
		setIsMenuOpen(false);
	};

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ type: 'spring', stiffness: 100 }}
			className="bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
				{/* Logo */}
				<div>
					<Image
						src="/images/logo.png"
						alt="logo"
						width={75}
						height={75}
						className="rounded-full"
					/>
				</div>

				{/* Menu desktop */}
				<div className="hidden md:flex space-x-8">
					{MENU_ITEMS.map(item => (
						<motion.a
							key={item.label}
							href={item.href}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}>
							{item.label}
						</motion.a>
					))}
				</div>

				{/* Right section */}
				<div className="flex items-center gap-4">
					<BasketButton />

					{/* Desktop user menu */}
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
									onClick={() => signOut()}>
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

					{/* Mobile menu toggle */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-gray-600 hover:text-red-700">
							{isMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</nav>

			<MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
		</motion.header>
	);
}
