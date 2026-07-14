import type { Metadata } from 'next';
import { Suspense } from 'react';
import RecipesPageClient from '@/components/site/recipe/recipes-page-client';
import { getRecipes } from '@/services/recipeService';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Recettes | Votre Boucherie',
	description:
		'Découvrez nos délicieuses recettes à base de viande fraîche et de qualité',
};

export default async function RecipesPage() {
	const { recipes } = await getRecipes();

	return (
		<Suspense
			fallback={
				<div className="container mx-auto px-4 py-12 text-sm text-muted-foreground">
					Chargement des recettes...
				</div>
			}>
			<RecipesPageClient recipes={recipes} />
		</Suspense>
	);
}
