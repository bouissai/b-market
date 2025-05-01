import { Button } from '@/components/ui/button';

type RenderPaymentFormProps = {
	nextStep: () => void;
	previousStep: () => void;
};

export default function RenderPaymentForm({
	nextStep,
	previousStep,
}: RenderPaymentFormProps) {
	return (
		<div>
			{/* Payment form content goes here */}
			<h2>Payment Form</h2>
			<Button onClick={previousStep} variant={'outline'}>
				Retour à la livraison
			</Button>
			<Button onClick={nextStep} variant={'default'}>
				Confirmer la commande
			</Button>
		</div>
	);
}
