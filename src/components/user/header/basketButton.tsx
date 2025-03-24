import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface BasketButtonProps {
	className?: string;
}

export const BasketButton = ({ className = '' }: BasketButtonProps) => {
	let itemCount: number = 1;
	const router = useRouter()
	const [open, setOpen] = useState(false);


	return (
		<div>
			<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`relative ${className}`}>
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="relative">
							<ShoppingBag className="h-5 w-5" />
							<Badge
								variant="destructive"
								className="absolute -top-2 -right-2 px-2 py-1 text-xs min-w-5 h-5 flex items-center justify-center"
							>
								{itemCount}
							</Badge>
							<span className="sr-only">Panier</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right">
						<SheetHeader>
							<SheetTitle>Votre panier</SheetTitle>
						</SheetHeader>

						<div className="mt-8 flex flex-col h-[calc(100vh-10rem)]">
							{itemCount === 0 ? (
								<div className="flex flex-col items-center justify-center h-full text-center space-y-4">
									<ShoppingBag className="h-12 w-12 text-muted-foreground" />
									<p className="text-muted-foreground">Votre panier est vide</p>
									<Button onClick={() => {router.push("/");setOpen(false);}} className="mt-4">
										Continuer mes achats
									</Button>
								</div>
							) : (
								<div className="flex flex-col h-full">
									<div className="flex-1 overflow-auto">
										{/* Cart items would go here */}
										<div className="py-4 border-b">
											<p className="font-medium">Produit exemple</p>
											<div className="flex justify-between mt-1">
												<p className="text-sm text-muted-foreground">1 × 29,99 €</p>
												<p className="font-medium">29,99 €</p>
											</div>
										</div>
									</div>

									<div className="border-t pt-4 mt-auto">
										<div className="flex justify-between py-2">
											<span>Sous-total</span>
											<span className="font-medium">29,99 €</span>
										</div>
										<Button className="w-full mt-4" onClick={() => router.push("/panier")}>
											Passer la commande
										</Button>
									</div>
								</div>
							)}
						</div>
					</SheetContent>
				</Sheet>
			</motion.div>
		</div>
	);
};
