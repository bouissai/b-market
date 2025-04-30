import RenderStepIndicator from '@/components/site/checkout/renders/render-step-indicator';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import RenderRecapCard from '@/components/site/checkout/renders/render-recap-card';
import RenderCurrentStep from '@/components/site/checkout/renders/render-current-step';

// Type pour les étapes du checkout
type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'confirmation';

export default function Checkout() {
	const { cartItems, totalPrice } = useCartStore();
	// État pour l'étape actuelle du checkout
	const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');

	// État pour le mode de livraison
	const [deliveryMethod, setDeliveryMethod] = useState('standard');

	// Frais de livraison
	const deliveryFee =
		deliveryMethod === 'express'
			? 9.9
			: deliveryMethod === 'standard'
				? 4.9
				: 0;

	// État pour le code promo
	const [promoCode, setPromoCode] = useState('');
	const [promoApplied, setPromoApplied] = useState(false);
	const [promoDiscount, setPromoDiscount] = useState(0);

	// Total
	const total = totalPrice + deliveryFee - promoDiscount;
	return (
		<div className="container mx-auto px-4 py-8">
			<RenderStepIndicator currentStep={currentStep} />
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<RenderCurrentStep />
				</div>
				{currentStep !== 'confirmation' && (
					<div className="lg:col-span-1">
						<RenderRecapCard
							cartItems={cartItems}
							currentStep={currentStep}
							deliveryFee={0}
							promoApplied={promoApplied}
							promoDiscount={promoDiscount}
							totalCart={totalPrice}
							total={total}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
