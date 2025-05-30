import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/useCartStore';
import { useCheckoutTotal } from '@/store/useCheckoutStore';
import { usePromoCodeStore } from '@/store/usePromoCodeStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin } from 'lucide-react';

export default function RecapOrderCard() {
	const {
		cartItems,
		totalCartItems,
		totalPrice: totalCartPrice,
	} = useCartStore();
	const { isValid, discount, calculateDiscount } = usePromoCodeStore();
	const discountAmount = calculateDiscount(totalCartPrice);
	const finalTotal = useCheckoutTotal();

	return (
		<div className="sticky top-24">
			<Alert className="mb-3" variant={'warning'}>
				<MapPin className="h-4 w-4 " />
				<AlertTitle>Click and Collect uniquement !</AlertTitle>
				<AlertDescription>
					Les commandes sont uniquement disponibles en retrait sur place.
				</AlertDescription>
			</Alert>
			<Card>
				<CardHeader>
					<CardTitle>
						<h1 className="text-2xl">Récapitulatif</h1>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{cartItems.map(item => (
							<div
								key={item.article.id}
								className="flex justify-between">
								<span>
									{item.article.name} × {item.quantity}
								</span>
								<span className="font-medium">
									{totalCartItems.toFixed(2)}€
								</span>
							</div>
						))}
					</div>
					<Separator className="my-4" />
					<div className="space-y-2">
						<div className="flex justify-between">
							<span>Total du panier</span>
							<span>{totalCartPrice.toFixed(2)}€</span>
						</div>
						{isValid && (
							<div className="flex justify-between text-success">
								<span>
									Réduction de{' '}
									{discount < 1 && discount > 0
										? discount * 100 + '%'
										: discount + '€'}
								</span>
								<span>-{discountAmount.toFixed(2)}€</span>
							</div>
						)}
						<div className="flex justify-between text-lg font-bold">
							<span>Total</span>
							<span>{finalTotal.toFixed(2)}€</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
