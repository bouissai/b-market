'use client';
import { MENU_ITEMS } from '@/constants';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
	isOpen: boolean;
	onClose: () => void;
	goTo: (href: string) => void;
}

export const MobileMenu = ({ isOpen, onClose, goTo }: MobileMenuProps) => {
	const pathname = usePathname();

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
		</div>
	);
};
