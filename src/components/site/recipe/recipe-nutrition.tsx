import type { RecipeNutritionDto } from '@/types/recipe';

type RecipeNutritionProps = {
	nutrition: RecipeNutritionDto;
	servings: number;
};

export default function RecipeNutrition({
	nutrition,
	servings,
}: RecipeNutritionProps) {
	const fields = [
		{ key: 'calories' as const, label: 'Calories', unit: 'kcal' },
		{ key: 'protein' as const, label: 'Protéines', unit: 'g' },
		{ key: 'carbs' as const, label: 'Glucides', unit: 'g' },
		{ key: 'fat' as const, label: 'Lipides', unit: 'g' },
	].filter(f => nutrition[f.key] != null);

	if (fields.length === 0) return null;

	return (
		<div
			className="grid grid-cols-2 sm:grid-cols-4 gap-4"
			aria-label="Valeurs nutritionnelles">
			{fields.map(field => {
				const total = nutrition[field.key]!;
				const perServing = Math.round(total / servings);
				return (
					<div
						key={field.key}
						className="bg-muted/20 p-4 rounded-lg text-center">
						<p className="text-sm text-muted-foreground mb-1">
							{field.label}
						</p>
						<p className="text-xl font-semibold">
							{perServing} {field.unit}
						</p>
						<p className="text-xs text-muted-foreground">par portion</p>
					</div>
				);
			})}
		</div>
	);
}
