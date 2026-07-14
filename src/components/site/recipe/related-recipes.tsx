import type { RecipeCardDto } from '@/types/recipe';
import RecipeGrid from '@/components/site/recipe/recipe-grid';

type RelatedRecipesProps = {
	recipes: RecipeCardDto[];
};

export default function RelatedRecipes({ recipes }: RelatedRecipesProps) {
	if (recipes.length === 0) {
		return (
			<p className="text-sm text-muted-foreground" role="status">
				Aucune recette similaire pour le moment.
			</p>
		);
	}

	return <RecipeGrid recipes={recipes} />;
}
