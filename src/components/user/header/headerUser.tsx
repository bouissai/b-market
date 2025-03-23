'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { MENU_ITEMS } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOutIcon, Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BasketButton } from './basketButton';
import { MobileMenu } from './mobileMenu';

export function HeaderUser() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { data: session } = useSession();
	const router = useRouter();
	const { signOut } = useAuthStore();

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ type: 'spring', stiffness: 100 }}
			className="bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
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
				<div className='flex items-center gap-4'>
					{session ?
						<Button variant="link" className='hidden md:flex' onClick={signOut}>
							Déconnexion
							<LogOutIcon />
						</Button>
						:
						<Button className='hidden md:block' onClick={() => router.push('/auth')}>
							Se connecter
						</Button>
					}
					{/* Desktop basket button */}
					<div>
						<BasketButton />
					</div>
					{/* Menu mobile toggle */}
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
