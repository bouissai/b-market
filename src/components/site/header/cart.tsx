import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';

interface CartProps {
	className?: string;
}

export const Cart = ({ className = '' }: CartProps) => {
	const {
		cartItems,
		updateQuantity,
		removeFromCart: removeCartItem,
		totalCartItems,
		totalPrice,
		fetchCartItems,
	} = useCartStore();

	const router = useRouter();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		fetchCartItems();
	}, []);

	return (
		<div>
			<motion.div
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				className={`relative ${className}`}>
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="relative">
							<ShoppingBag className="h-5 w-5" />
							{totalCartItems > 0 && (
								<Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs min-w-5 h-5 flex items-center justify-center">
									{totalCartItems}
								</Badge>
							)}
							<span className="sr-only">Panier</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right">
						<SheetHeader>
							<SheetTitle>Votre panier</SheetTitle>
						</SheetHeader>

						<div className="mt-8 flex flex-col h-[calc(100vh-10rem)]">
							{totalCartItems === 0 ? (
								<div className="flex flex-col items-center justify-center h-full text-center space-y-4">
									<ShoppingBag className="h-12 w-12 text-muted-foreground" />
									<p className="text-muted-foreground">
										Votre panier est vide
									</p>
									<Button
										onClick={() => {
											router.push('/');
											setOpen(false);
										}}
										className="mt-4">
										Continuer mes achats
									</Button>
								</div>
							) : (
								<div className="flex flex-col h-full">
									{cartItems.map(item => (
										<div
											key={item.article.id}
											className="flex items-center justify-between">
											<div className="flex items-center space-x-4">
												<Image
													// TODO : a modifier quand il y aura les images des articles
													// src={article.image && article.image.startsWith('http') ? article.image : '/placeholder.svg'}
													src={item.article.image}
													alt={item.article.name}
													width={50}
													height={50}
													className="rounded-md"
												/>
												<div>
													<p className="font-medium">
														{item.article.name}
													</p>
													<p className="text-sm text-muted-foreground">
														{item.article.price.toFixed(2)}€ ×{' '}
														{item.quantity}
													</p>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<Button
													variant="outline"
													size="icon"
													className="h-8 w-8"
													onClick={() =>
														updateQuantity(
															item.article,
															item.quantity - 1,
														)
													}>
													<Minus className="h-4 w-4" />
												</Button>
												<input
													type="number"
													value={item.quantity}
													onChange={e => {
														const newQuantity = parseInt(
															e.target.value,
															10,
														);
														if (!isNaN(newQuantity)) {
															updateQuantity(
																item.article,
																newQuantity,
															);
														}
													}}
													className="w-12 h-8 text-center border rounded-md
                            [appearance:textfield]
                            [&::-webkit-outer-spin-button]:appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none" // pour enlever les boutons d'incrementation de l'input number
													min="0"
												/>
												<Button
													variant="outline"
													size="icon"
													className="h-8 w-8"
													onClick={() =>
														updateQuantity(
															item.article,
															item.quantity + 1,
														)
													}>
													<Plus className="h-4 w-4" />
												</Button>
												<Button
													variant="outline"
													size="icon"
													className="h-8 w-8 ml-2"
													onClick={() =>
														removeCartItem(item.article)
													}>
													<Trash className="h-4 w-4 text-red-500" />
												</Button>
											</div>
										</div>
									))}

									<div className="border-t pt-4 mt-auto">
										<div className="flex justify-between py-2">
											<span>Sous-total</span>
											<span className="font-medium">
												{totalPrice.toFixed(2)}€
											</span>
										</div>
										<SheetClose asChild>
											<Button
												className="w-full mt-4"
												onClick={() => router.push('/panier')}>
												Passer la commande
											</Button>
										</SheetClose>
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
