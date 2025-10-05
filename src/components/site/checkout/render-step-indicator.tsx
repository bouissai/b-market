import { CHECKOUT_STEPS } from '@/constants';
import { DynamicIcon } from 'lucide-react/dynamic';

type RenderStepIndicatorProps = {
	currentStep: string;
};

export default function RenderStepIndicator({
	currentStep,
}: RenderStepIndicatorProps) {
	return (
		<div className="mb-8">
			<div className="hidden sm:flex items-center justify-center">
				{CHECKOUT_STEPS.map((step, index) => (
					<div key={step.key} className="flex flex-row items-center gap-2">
						<div
							className={`flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 ${
								currentStep === step.key
									? 'border-boucherie-red bg-boucherie-red text-boucherie-white'
									: CHECKOUT_STEPS.findIndex(
												s => s.key === currentStep,
										  ) > index
										? 'border-boucherie-red  bg-boucherie-red text-boucherie-white'
										: 'border-gray-700 text-gray-500'
							}`}>
							{CHECKOUT_STEPS.findIndex(s => s.key === currentStep) >
							index ? (
								<DynamicIcon
									name="check-circle-2"
									className="h-5 w-5"
								/>
							) : (
								<DynamicIcon name={step.icon} className="h-5 w-5" />
							)}
						</div>
						<div
							className={`ml-2 text-sm font-medium ${
								currentStep === step.key
									? 'text-boucherie-red font-bold'
									: 'text-gray-500'
							}`}>
							{step.title}
						</div>
						{index < CHECKOUT_STEPS.length - 1 && (
							<div
								className={`h-0.5 w-16 mx-4  ${
									CHECKOUT_STEPS.findIndex(
										s => s.key === currentStep,
									) > index
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
					Étape{' '}
					{CHECKOUT_STEPS.findIndex(step => step.key === currentStep) + 1}{' '}
					sur {CHECKOUT_STEPS.length}:{' '}
					{CHECKOUT_STEPS.find(step => step.key === currentStep)?.title}
				</p>
			</div>
		</div>
	);
}
