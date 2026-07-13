import type { RecipeStepDto } from '@/types/recipe';

type RecipeStepsProps = {
	steps: RecipeStepDto[];
};

export default function RecipeSteps({ steps }: RecipeStepsProps) {
	return (
		<ol className="space-y-4" aria-label="Étapes de préparation">
			{steps.map((step, index) => (
				<li key={step.id} className="flex gap-4">
					<div
						className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium"
						aria-hidden="true">
						{index + 1}
					</div>
					<div className="pt-1">
						<p>{step.description}</p>
					</div>
				</li>
			))}
		</ol>
	);
}
