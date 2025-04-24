'use client';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Minus, Plus, ShoppingBag, Trash, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { CartClearConfirmDialog } from '@/components/site/landingPage/cart-clear-confirm-dialog';

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
		clearCart,
		loadingItems,
	} = useCartStore();

	const router = useRouter();
	const [open, setOpen] = useState(false);

	const [showClearConfirm, setShowClearConfirm] = useState(false);

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
							<AnimatePresence>
								{totalCartItems > 0 && (
									<motion.div
										key={totalCartItems}
										initial={{ scale: 0.6, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
										{totalCartItems}
									</motion.div>
								)}
							</AnimatePresence>
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
											router.push('/products');
											setOpen(false);
										}}
										className="mt-4">
										Découvrir nos produits
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
													src={item.article.image!}
													alt={item.article.name!}
													width={50}
													height={50}
													className="rounded-md"
												/>
												<div>
													<p className="font-medium">
														{item.article.name}
													</p>
													<p className="text-sm text-muted-foreground">
														{item.article.price!.toFixed(2)}€ ×{' '}
														{item.quantity}
													</p>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<Button
													variant="outline"
													size="icon"
													disabled={loadingItems.has(
														item.article.id!,
													)}
													onClick={async () => {
														await updateQuantity(
															item.article,
															item.quantity - 1,
														);
													}}>
													{loadingItems.has(item.article.id!) ? (
														<Loader2 className="h-4 w-4 animate-spin" />
													) : (
														<Minus className="h-4 w-4" />
													)}
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
													className="w-12 h-8 text-center border rounded-md bg-neutral-700
                            [appearance:textfield]
                            [&::-webkit-outer-spin-button]:appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none" // pour enlever les boutons d'incrementation de l'input number
													min="0"
												/>
												<Button
													variant="outline"
													size="icon"
													disabled={loadingItems.has(
														item.article.id!,
													)}
													onClick={async () => {
														await updateQuantity(
															item.article,
															item.quantity + 1,
														);
													}}>
													{loadingItems.has(item.article.id!) ? (
														<Loader2 className="h-4 w-4 animate-spin" />
													) : (
														<Plus className="h-4 w-4" />
													)}
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
									<Button
										onClick={() => {
											setShowClearConfirm(true);
										}}
										variant="ghost"
										className="text-red-500 hover:text-red-400 hover:bg-red-950 flex items-center gap-2 mt-2 box-border">
										<Trash2 className="h-4 w-4" />
										Vider le panier
									</Button>
									<CartClearConfirmDialog
										isOpen={showClearConfirm}
										onConfirm={async () => {
											await clearCart();
											setShowClearConfirm(false);
										}}
										onClose={() => setShowClearConfirm(false)}
									/>
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
