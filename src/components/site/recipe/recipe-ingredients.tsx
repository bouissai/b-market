import type { RecipeIngredientDto } from '@/types/recipe';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

type RecipeIngredientsProps = {
	ingredients: RecipeIngredientDto[];
};

export default function RecipeIngredients({
	ingredients,
}: RecipeIngredientsProps) {
	return (
		<ul className="space-y-2" aria-label="Liste des ingrédients">
			{ingredients.map(ingredient => (
				<li
					key={ingredient.id}
					className="flex items-start justify-between gap-3 py-2 border-b last:border-0">
					<div className="flex items-start gap-2 min-w-0">
						{ingredient.available ? (
							<div
								className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"
								aria-hidden="true">
								<Check className="h-3 w-3 text-primary" />
							</div>
						) : (
							<div
								className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5"
								aria-hidden="true">
								<X className="h-3 w-3 text-muted-foreground" />
							</div>
						)}
						<div className="min-w-0">
							<span className="font-medium">{ingredient.name}</span>
							<Badge
								variant={ingredient.available ? 'default' : 'outline'}
								className="ml-2 text-xs">
								{ingredient.available
									? 'Disponible dans notre catalogue'
									: 'Indisponible dans notre catalogue'}
							</Badge>
							{ingredient.article && (
								<p className="text-xs text-muted-foreground mt-0.5">
									{ingredient.article.name} — {ingredient.article.price.toFixed(2)} € /{' '}
									{ingredient.article.unit}
								</p>
							)}
						</div>
					</div>
					<span className="text-sm text-muted-foreground shrink-0">
						{ingredient.displayQuantity}
					</span>
				</li>
			))}
		</ul>
	);
}
