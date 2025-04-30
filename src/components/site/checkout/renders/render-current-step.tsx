import RenderCartSummary from '@/components/site/checkout/renders/render-cart-summary';

type RenderCurrentStepProps = {
	currentStep: 'cart' | 'delivery' | 'payment' | 'confirmation';
};

export default function RenderCurrentStep({
	currentStep,
}: RenderCurrentStepProps) {
	switch (currentStep) {
		case 'cart':
			return RenderCartSummary();
		case 'delivery':
			return RenderDeliveryForm();
		case 'payment':
			return RenderPaymentForm();
		case 'confirmation':
			return RenderConfirmation();
		default:
			return RenderCartSummary();
	}
}
