'use client';
import { MENU_ITEMS } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface MobileMenuProps {
	isOpen: boolean;
	onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
	const { data: session } = useSession();
	const { signOut } = useAuthStore();
	const pathname = usePathname();

	return (
		<div>
			{isOpen && (
				<div className="lg:hidden mt-4 bg-boucherie-black rounded-lg shadow-lg p-4 border border-boucherie-red/30">
					{MENU_ITEMS.map(item => (
						<Link
							key={item.label}
							href={item.href}
							className={`block px-4 py-3 rounded-md text-base font-medium mb-2 ${
								pathname === item.href
									? 'text-boucherie-white bg-boucherie-red shadow-md'
									: 'text-boucherie-white hover:text-boucherie-black hover:bg-boucherie-red'
							}`}
							onClick={() => onClose}>
							{item.label}
						</Link>
					))}

					{session ? (
						<div
							className="flex text-gray-600 hover:text-red-700"
							onClick={() => {
								signOut(false);
								onClose();
							}}>
							Déconnexion
						</div>
					) : (
						<a
							href="/auth"
							className="flex text-gray-600 hover:text-red-700">
							Se connecter
						</a>
					)}
				</div>
			)}
		</div>
	);
};
