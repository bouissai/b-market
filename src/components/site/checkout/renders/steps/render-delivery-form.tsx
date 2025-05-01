import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

type RenderDeliveryFormProps = {
	nextStep: () => void;
	previousStep: () => void;
};

export default function RenderDeliveryForm({
	nextStep,
	previousStep,
}: RenderDeliveryFormProps) {
	return (
		<div>
			{/* Delivery form content goes here */}
			<h2>Delivery Form</h2>
			<Button onClick={previousStep} variant={'outline'}>
				Retour au récapitulatif du panier
			</Button>
			<Button onClick={nextStep} variant={'default'}>
				Continuer vers le paiement
				<ChevronRight className="ml-2 h-4 w-4" />
			</Button>
		</div>
	);
}
