import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

type RenderCartSummaryProps = {
	nextStep: () => void;
};

export default function RenderCartSummary({
	nextStep,
}: RenderCartSummaryProps) {
	return (
		<div>
			<Button onClick={nextStep} variant={'default'}>
				Continuer vers la livraison
				<ChevronRight className="ml-2 h-4 w-4" />
			</Button>
		</div>
	);
}
