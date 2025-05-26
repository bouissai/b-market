import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/useCartStore';
import { useCheckoutStore, useCheckoutTotal } from '@/store/useCheckoutStore';

export default function RecapOrderCard() {
	const { promoApplied, promoDiscount } = useCheckoutStore();
	const { cartItems, totalPrice: cartPrice } = useCartStore();
	const finalTotal = useCheckoutTotal();

	return (
		<Card className="sticky top-24">
			<CardHeader>
				<CardTitle>
					<h1 className="text-2xl">Récapitulatif</h1>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{cartItems.map(item => (
						<div key={item.article.id} className="flex justify-between">
							<span>
								{item.article.name} × {item.quantity}
							</span>
							<span className="font-medium">
								{(item.article.price! * item.quantity).toFixed(2)}€
							</span>
						</div>
					))}
				</div>
				<Separator className="my-4" />
				<div className="space-y-2">
					<div className="flex justify-between">
						<span>Total du panier</span>
						<span>{cartPrice.toFixed(2)}€</span>
					</div>
					{promoApplied && (
						<div className="flex justify-between text-success">
							<span>Réduction</span>
							<span>-{promoDiscount.toFixed(2)}€</span>
						</div>
					)}
					<div className="flex justify-between text-lg font-bold">
						<span>Total</span>
						<span>{finalTotal.toFixed(2)}€</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
