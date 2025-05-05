import RenderStepIndicator from '@/components/site/checkout/renders/render-step-indicator';
import { useCartStore } from '@/store/useCartStore';
import RenderRecapCard from '@/components/site/checkout/renders/render-recap-card';
import RenderCurrentStep from '@/components/site/checkout/renders/render-current-step';
import { useCheckoutStore } from '@/store/useCheckoutStore';

export default function Checkout() {
	const { totalPrice } = useCartStore();

	const {
		currentStep,
		deliveryFee,
		promoDiscount,
		previousStep,
		nextStep,
		promoApplied,
	} = useCheckoutStore();

	// Total
	const total = totalPrice + deliveryFee - promoDiscount;
	return (
		<div className="container mx-auto px-4 py-8">
			<RenderStepIndicator currentStep={currentStep} />
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<RenderCurrentStep
						currentStep={currentStep}
						previousStep={previousStep}
						nextStep={nextStep}
					/>
				</div>
				{currentStep !== 'confirmation' && (
					<div className="lg:col-span-1">
						<RenderRecapCard
							currentStep={currentStep}
							deliveryFee={deliveryFee}
							promoApplied={promoApplied}
							promoDiscount={promoDiscount}
							total={total}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
