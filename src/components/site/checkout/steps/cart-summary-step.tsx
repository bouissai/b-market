'use client';
import { Button } from '@/components/ui/button';
import {
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	Info,
	Loader2,
	Minus,
	Plus,
	ShoppingBag,
	Trash2,
	XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePromoCodeStore } from '@/store/usePromoCodeStore';
import { useRouter } from 'next/navigation';

type CartSummaryStepProps = {
	nextStep: () => void;
};

export default function CartSummaryStep({ nextStep }: CartSummaryStepProps) {
	const {
		cartItems,
		totalCartItems,
		loadingItems,
		updateQuantity,
		removeFromCart,
	} = useCartStore();
	const { validateCode, currentCode, discount, isValid, isLoading } =
		usePromoCodeStore();
	const router = useRouter();

	const [promoCodeInput, setPromoCodeInput] = useState<string>('');

	const handleSubmitPromo = (event: React.FormEvent) => {
		event.preventDefault();
		validateCode(promoCodeInput);
	};

	return (
		<div className="space-y-6">
			{cartItems.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-5 box-border">
					<ShoppingBag className="h-12 w-12 text-muted-foreground" />
					<p className="text-muted-foreground">Votre panier est vide</p>
					<Button
						onClick={() => {
							router.push('/products');
						}}
						className="mt-4">
						Découvrir nos produits
					</Button>
				</div>
			) : (
				<>
					<div className="flex flex-row items-center justify-between">
						<h2 className="text-2xl font-bold">Votre panier</h2>
						<Badge>{totalCartItems} articles</Badge>
					</div>

					<ScrollArea className="h-[400px] pr-4">
						<div className="space-y-4">
							{cartItems.map(item => (
								<Card key={item.article.id}>
									<CardContent className="p-4">
										<div className="flex items-center space-x-4">
											<div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
												<Image
													src={item.article.image!}
													alt={item.article.name!}
													width={80}
													height={80}
													className="h-full w-full object-cover object-center"
												/>
											</div>
											<div className="flex-grow">
												<h3 className="text-base font-medium">
													{item.article.name}
												</h3>
												<p className="text-sm text-muted-foreground">
													{item.article.price!.toFixed(2)}€ / unité
												</p>
											</div>
											<div className="flex items-center space-x-2">
												<Button
													disabled={loadingItems.has(
														item.article.id!,
													)}
													variant="outline"
													size="icon"
													className="h-8 w-8 rounded-full"
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
												<span className="w-8 text-center">
													{item.quantity}
												</span>
												<Button
													disabled={loadingItems.has(
														item.article.id!,
													)}
													variant="outline"
													size="icon"
													className="h-8 w-8 rounded-full"
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
											</div>
											<div className="w-20 text-right font-medium">
												{(
													item.article.price! * item.quantity
												).toFixed(2)}
												€
											</div>
											<Button
												variant="ghost"
												size="icon"
												className="text-red-500 hover:text-red-700 hover:bg-red-50"
												onClick={() =>
													removeFromCart(item.article)
												}>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</ScrollArea>
					<Collapsible>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Label htmlFor="promoCode">Code promo</Label>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Info className="h-4 w-4 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p>
												Entrez un code de promotion pour obtenir une
												réduction
											</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
							<CollapsibleTrigger asChild>
								<Button variant="ghost" size="sm">
									<ChevronDown className="h-4 w-4" />
								</Button>
							</CollapsibleTrigger>
						</div>
						<CollapsibleContent className="mt-2">
							<div>
								<form
									onSubmit={handleSubmitPromo}
									className="flex space-x-2">
									<div className="w-full">
										<Input
											id="promoCode"
											placeholder="Entrez votre code"
											value={promoCodeInput}
											onChange={e =>
												setPromoCodeInput(e.target.value)
											}
										/>
									</div>
									<Button type="submit">Appliquer</Button>
								</form>
							</div>

							{isLoading ? (
								<Alert>
									<Loader2 className="h-4 w-4 animate-spin" />
									<AlertTitle>Validation en cours...</AlertTitle>
								</Alert>
							) : isValid === false ? (
								<Alert variant="destructive">
									<XCircle className="h-4 w-4" />
									<AlertTitle>Code promo invalide</AlertTitle>
									<AlertDescription>
										Le code "{currentCode}" n'est pas valide.
									</AlertDescription>
								</Alert>
							) : (
								isValid === true && (
									<Alert className="text-success">
										<CheckCircle2 color="green" className="h-4 w-4" />
										<AlertTitle>Code promo appliqué</AlertTitle>
										<AlertDescription>
											Vous bénéficiez d'une réduction de{' '}
											{discount < 1 && discount > 0
												? discount * 100 + '%'
												: discount + '€'}
										</AlertDescription>
									</Alert>
								)
							)}
						</CollapsibleContent>
					</Collapsible>
					<div className="w-full flex justify-end">
						<Button onClick={nextStep} variant={'default'}>
							Continuer vers la livraison
							<ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
