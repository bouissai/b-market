'use client';
import { MENU_ITEMS } from '@/constants';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
	isOpen: boolean;
	onClose: () => void;
	goTo: (href: string) => void;
}

export const MobileMenu = ({ isOpen, goTo }: MobileMenuProps) => {
	const pathname = usePathname();

	if (!isOpen) return null;

	return (
		<div className="lg:hidden mt-4  rounded-lg shadow-lg p-4 border border-primary/30">
			{MENU_ITEMS.map(item => (
				<button
					key={item.label}
					onClick={() => goTo(item.href)}
					className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium mb-2 ${
						pathname === item.href
							? 'bg-primary text-primary-foreground shadow-md'
							: 'hover:bg-primary hover:text-primary-foreground'
					}`}>
					{item.label}
				</button>
			))}
		</div>
	);
};
