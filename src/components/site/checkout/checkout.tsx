import RenderStepIndicator from '@/components/site/checkout/render-step-indicator';
import { useCartStore } from '@/store/useCartStore';
import RecapOrderCard from '@/components/site/checkout/recap-order-card';
import { useCheckoutFlow } from '@/hooks/use-checkout-flow';

export default function Checkout() {
	const { totalPrice } = useCartStore();

	const {
		currentStep,
		stepMeta,
		previous,
		next,
		promoDiscount,
		promoApplied,
	} = useCheckoutFlow();

	const StepComponent = stepMeta.component;

	return (
		<div className="container mx-auto px-4 py-8">
			<RenderStepIndicator currentStep={currentStep} />
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<StepComponent previousStep={previous} nextStep={next} />
				</div>
				{currentStep !== 'confirmation' && (
					<div className="lg:col-span-1">
						<RecapOrderCard
							currentStep={currentStep}
							promoApplied={promoApplied}
							promoDiscount={promoDiscount}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
