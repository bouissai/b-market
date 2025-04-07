'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { MobileMenu } from './mobile-menu';
import { DesktopMenu } from './desktop-menu';
import { Button } from '@/components/ui/button';
import { Cart } from './cart';
import { ProfileButton } from './profile-button';

export function HeaderSite() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const router = useRouter();

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
						<span className="lg:text-2xl text-lg font-bold gradient-text font-playfair ">
							B Market
						</span>
					</Link>

					<DesktopMenu goTo={goTo} />

					<div className="flex flex-row gap-x-3">
						<div className="flex flex-row gap-x-1">
							<ProfileButton goTo={goTo} />
							<Cart />
						</div>
						<Button
							size="icon"
							className="lg:hidden bg-boucherie-red text-white hover:bg-boucherie-red-light"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							aria-label="Toggle menu">
							{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</Button>
					</div>
				</div>
			</div>
			<MobileMenu
				isOpen={isMobileMenuOpen}
				onClose={() => setIsMobileMenuOpen(false)}
				goTo={goTo}
			/>
		</header>
	);
}
