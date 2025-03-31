'use client';

import { MENU_ITEMS } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface MobileMenuProps {
	isOpen: boolean;
	onClose: () => void;
	goTo: (href: string) => void;
}

export const MobileMenu = ({ isOpen, onClose, goTo }: MobileMenuProps) => {
	const { data: session } = useSession();
	const { signOut } = useAuthStore();
	const pathname = usePathname();
	const router = useRouter();

	if (!isOpen) return null;

	return (
		<div className="lg:hidden mt-4 bg-boucherie-black rounded-lg shadow-lg p-4 border border-boucherie-red/30">
			{MENU_ITEMS.map(item => (
				<button
					key={item.label}
					onClick={() => goTo(item.href)}
					className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium mb-2 ${
						pathname === item.href
							? 'text-boucherie-white bg-boucherie-red shadow-md'
							: 'text-boucherie-white hover:text-boucherie-black hover:bg-boucherie-red'
					}`}>
					{item.label}
				</button>
			))}

			{session ? (
				<button
					onClick={() => {
						signOut(false);
						onClose();
					}}
					className="flex text-gray-600 hover:text-red-700 mt-4">
					Déconnexion
				</button>
			) : (
				<button
					onClick={() => goTo('/auth')}
					className="flex text-gray-600 hover:text-red-700 mt-4">
					Se connecter
				</button>
			)}
		</div>
	);
};
