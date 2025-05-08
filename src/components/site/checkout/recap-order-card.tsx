import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/useCartStore';

type RecapOrderCardProps = {
	total: number;
	currentStep: string;
	promoApplied: boolean | null;
	promoDiscount: number;
	deliveryFee: number;
};

export default function RecapOrderCard({
	total,
	currentStep,
	promoDiscount,
	promoApplied,
	deliveryFee,
}: RecapOrderCardProps) {
	const { cartItems, totalPrice } = useCartStore();

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
						<span>{totalPrice.toFixed(2)}€</span>
					</div>
					{promoApplied && (
						<div className="flex justify-between text-success">
							<span>Réduction</span>
							<span>-{promoDiscount.toFixed(2)}€</span>
						</div>
					)}
					{currentStep !== 'cart' && (
						<div className="flex justify-between">
							<span>Frais de livraison</span>
							<span>{deliveryFee.toFixed(2)}€</span>
						</div>
					)}
					<div className="flex justify-between text-lg font-bold">
						<span>Total</span>
						<span>
							{currentStep === 'cart'
								? (totalPrice - promoDiscount).toFixed(2)
								: total.toFixed(2)}
							€
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
