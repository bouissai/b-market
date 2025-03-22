import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SignOutButton from '@/components/user/auth/sign-out-button';

interface BasketButtonProps {
	className?: string;
}

export const BasketButton = ({ className = '' }: BasketButtonProps) => {
	const router = useRouter();
	const { data: session } = useSession();
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
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="relative">
							Panier
							<ShoppingBag className="h-5 w-5" />
							<Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs">
								0
							</Badge>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{session ? (
							<DropdownMenuGroup>
								<DropdownMenuItem
									onClick={() => router.push('#click-collect')}>
									Voir mon panier
								</DropdownMenuItem>
								<DropdownMenuItem>
									<SignOutButton />
								</DropdownMenuItem>
							</DropdownMenuGroup>
						) : (
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={() => router.push('/auth')}>
									Se connecter
								</DropdownMenuItem>
							</DropdownMenuGroup>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</motion.span>
		</motion.a>
	);
};
