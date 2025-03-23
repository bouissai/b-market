import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface BasketButtonProps {
	className?: string;
}

export const BasketButton = ({ className = '' }: BasketButtonProps) => {
	return (
		<motion.a
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			className={`relative flex items-center ${className}`}>
			<motion.span
				variants={{
					rest: { x: 0, opacity: 1 },
					hover: { x: 50, opacity: 0 },
				}}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
				className="flex items-center gap-2">
				<Button variant="ghost" size="icon" className="relative">
					<ShoppingBag className="h-5 w-5" />
					<Badge
						variant="destructive"
						className="absolute -top-2 -right-2 px-2 py-1 text-xs min-w-5 h-5 flex items-center justify-center"
					>
						1
					</Badge>
					<span className="sr-only">Panier</span>
				</Button>
			</motion.span>
		</motion.a>
	);
};
