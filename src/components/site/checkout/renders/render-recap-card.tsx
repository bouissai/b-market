import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/types/cart';

type RenderRecapCartProps = {
	cartItems: CartItem[];
	totalCart: number;
	total: number;
	currentStep: 'cart' | 'delivery' | 'payment' | 'confirmation';
	promoApplied: boolean;
	promoDiscount: number;
	deliveryFee: number;
};

export default function RenderRecapCard({
	cartItems,
	totalCart,
	total,
	currentStep,
	promoDiscount,
	promoApplied,
	deliveryFee,
}: RenderRecapCartProps) {
	return (
		<Card className="sticky top-8">
			<CardHeader>
				<CardTitle className="text-2xl">Récapitulatif</CardTitle>
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
						<span>{totalCart.toFixed(2)}€</span>
					</div>
					{promoApplied && (
						<div className="flex justify-between text-green-600">
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
								? (totalCart - promoDiscount).toFixed(2)
								: total.toFixed(2)}
							€
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
