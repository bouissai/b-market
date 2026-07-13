import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import RecipeActions from '@/components/site/recipe/recipe-actions';
import RecipeCartButton from '@/components/site/recipe/recipe-cart-button';
import RecipeIngredients from '@/components/site/recipe/recipe-ingredients';
import RecipeNutrition from '@/components/site/recipe/recipe-nutrition';
import RelatedRecipes from '@/components/site/recipe/related-recipes';
import RecipeSteps from '@/components/site/recipe/recipe-steps';
import { getRecipeById, getRelatedRecipes } from '@/services/recipeService';
import { ChefHat, ChevronLeft, Clock, Users } from 'lucide-react';

type Props = {
	params: Promise<{ id: string }>;
};

function formatTime(minutes: number) {
	if (minutes < 60) return `${minutes} min`;
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const recipe = await getRecipeById(id);

	if (!recipe) {
		return {
			title: 'Recette non trouvée | Votre Boucherie',
		};
	}

	return {
		title: `${recipe.title} | Recettes | Votre Boucherie`,
		description: recipe.description,
	};
}

export default async function RecipeDetailPage({ params }: Props) {
	const { id } = await params;
	const recipe = await getRecipeById(id);

	if (!recipe) {
		notFound();
	}

	const relatedRecipes = await getRelatedRecipes(recipe.id);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6 print:hidden">
				<Button asChild variant="ghost" size="sm" className="gap-1">
					<Link href="/recipes">
						<ChevronLeft className="h-4 w-4" aria-hidden="true" />
						Retour aux recettes
					</Link>
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
				<article>
					<div className="mb-6">
						<div className="flex flex-wrap gap-2 mb-4">
							{recipe.tags.map(tag => (
								<Badge key={tag} variant="pending">
									{tag}
								</Badge>
							))}
						</div>

						<h1 className="text-3xl md:text-4xl font-bold mb-4">
							{recipe.title}
						</h1>
						<p className="text-lg text-muted-foreground mb-6">
							{recipe.description}
						</p>

						<div className="flex flex-wrap gap-6 mb-6">
							<div className="flex items-center gap-2">
								<Clock className="h-5 w-5 text-primary" aria-hidden="true" />
								<div>
									<p className="text-sm text-muted-foreground">Temps total</p>
									<p className="font-medium">
										{formatTime(recipe.prepTime + recipe.cookTime)}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Users className="h-5 w-5 text-primary" aria-hidden="true" />
								<div>
									<p className="text-sm text-muted-foreground">Portions</p>
									<p className="font-medium">{recipe.servings} personnes</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<ChefHat className="h-5 w-5 text-primary" aria-hidden="true" />
								<div>
									<p className="text-sm text-muted-foreground">Difficulté</p>
									<p className="font-medium capitalize">{recipe.difficulty}</p>
								</div>
							</div>
						</div>

						<RecipeActions title={recipe.title} />
					</div>

					<div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
						<Image
							src={recipe.image || '/images/no-img.png'}
							alt={recipe.title}
							fill
							sizes="(max-width: 1024px) 100vw, 66vw"
							className="object-cover"
							priority
						/>
					</div>

					<div className="space-y-8">
						<section aria-labelledby="recipe-steps-title">
							<h2 id="recipe-steps-title" className="text-2xl font-semibold mb-4">
								Préparation
							</h2>
							<RecipeSteps steps={recipe.steps} />
						</section>

						<Separator />

						{recipe.nutrition && (
							<section aria-labelledby="recipe-nutrition-title">
								<h2
									id="recipe-nutrition-title"
									className="text-2xl font-semibold mb-4">
									Valeurs nutritionnelles
								</h2>
								<RecipeNutrition
									nutrition={recipe.nutrition}
									servings={recipe.servings}
								/>
							</section>
						)}
					</div>
				</article>

				<aside>
					<div className="bg-muted/20 p-6 rounded-lg sticky top-24">
						<h2 className="text-xl font-semibold mb-4">Ingrédients</h2>
						<p className="text-sm text-muted-foreground mb-4">
							Pour {recipe.servings} personnes
						</p>

						<RecipeIngredients ingredients={recipe.ingredients} />
						<RecipeCartButton ingredients={recipe.ingredients} />
					</div>
				</aside>
			</div>

			<section className="mt-12 print:hidden" aria-labelledby="related-recipes-title">
				<h2 id="related-recipes-title" className="text-2xl font-semibold mb-6">
					Recettes similaires
				</h2>
				<RelatedRecipes recipes={relatedRecipes} />
			</section>
		</div>
	);
}
