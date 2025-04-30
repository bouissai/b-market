import {
	CheckCheck,
	CheckCircle2,
	CreditCardIcon,
	MapPin,
	ShoppingBag,
} from 'lucide-react';

type RenderStepIndicatorProps = {
	currentStep: string;
};

export default function RenderStepIndicator({
	currentStep,
}: RenderStepIndicatorProps) {
	const steps = [
		{
			id: 'cart',
			label: 'Panier',
			icon: <ShoppingBag className="h-5 w-5" />,
		},
		{
			id: 'delivery',
			label: 'Livraison',
			icon: <MapPin className="h-5 w-5" />,
		},
		{
			id: 'payment',
			label: 'Paiement',
			icon: <CreditCardIcon className="h-5 w-5" />,
		},
		{
			id: 'confirmation',
			label: 'Confirmation',
			icon: <CheckCheck className="h-5 w-5" />,
		},
	];
	return (
		<div className="mb-8">
			<div className="hidden sm:flex items-center justify-center">
				{steps.map((step, index) => (
					<div key={step.id} className="flex flex-row items-center gap-2">
						<div
							className={`flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 ${
								currentStep === step.id
									? 'border-boucherie-red bg-boucherie-red text-boucherie-white'
									: steps.findIndex(s => s.id === currentStep) > index
										? 'border-boucherie-red  bg-boucherie-red text-boucherie-white'
										: 'border-gray-700 text-gray-500'
							}`}>
							{steps.findIndex(s => s.id === currentStep) > index ? (
								<CheckCircle2 className="h-6 w-6" />
							) : (
								step.icon
							)}
						</div>
						<div
							className={`ml-2 text-sm font-medium ${
								currentStep === step.id
									? 'text-boucherie-red font-bold'
									: 'text-gray-500'
							}`}>
							{step.label}
						</div>
						{index < steps.length - 1 && (
							<div
								className={`h-0.5 w-16 mx-4  ${
									currentStep === step.id
										? 'bg-boucherie-red '
										: 'bg-gray-700'
								}`}
							/>
						)}
					</div>
				))}
			</div>
			<div className="sm:hidden">
				<p className="text-lg font-medium">
					Étape {steps.findIndex(step => step.id === currentStep) + 1} sur{' '}
					{steps.length}:{' '}
					{steps.find(step => step.id === currentStep)?.label}
				</p>
			</div>
		</div>
	);
}
