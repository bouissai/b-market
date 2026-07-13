import type { RecipeCardDto } from '@/types/recipe';
import RecipeCard from '@/components/site/recipe/recipe-card';

type RecipeGridProps = {
	recipes: RecipeCardDto[];
	emptyMessage?: string;
};

export default function RecipeGrid({
	recipes,
	emptyMessage = 'Aucune recette trouvée.',
}: RecipeGridProps) {
	if (recipes.length === 0) {
		return (
			<div
				className="text-center py-12 text-muted-foreground"
				role="status"
				aria-live="polite">
				<p>{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{recipes.map(recipe => (
				<RecipeCard key={recipe.id} recipe={recipe} />
			))}
		</div>
	);
}
