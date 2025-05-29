import { Button } from '@/components/ui/button';

type PaymentFormStepProps = {
	nextStep: () => void;
	previousStep: () => void;
};

export default function PaymentFormStep({
	nextStep,
	previousStep,
}: PaymentFormStepProps) {
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
