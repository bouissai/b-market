import RenderCartSummary from '@/components/site/checkout/renders/steps/render-cart-summary';
import RenderDeliveryForm from '@/components/site/checkout/renders/steps/render-delivery-form';
import RenderPaymentForm from '@/components/site/checkout/renders/steps/render-paiement-form';
import { RenderConfirmation } from '@/components/site/checkout/renders/steps/render-confirmation';

type RenderCurrentStepProps = {
	currentStep: 'cart' | 'delivery' | 'payment' | 'confirmation';
	nextStep: () => void;
	previousStep: () => void;
};

export default function RenderCurrentStep({
	currentStep,
	previousStep,
	nextStep,
}: RenderCurrentStepProps) {
	switch (currentStep) {
		case 'cart':
			return RenderCartSummary({ nextStep });
		case 'delivery':
			return RenderDeliveryForm({ nextStep, previousStep });
		case 'payment':
			return RenderPaymentForm({ nextStep, previousStep });
		case 'confirmation':
			return RenderConfirmation();
		default:
			return RenderCartSummary({ nextStep });
	}
}
