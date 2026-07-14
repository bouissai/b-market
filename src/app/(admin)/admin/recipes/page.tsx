'use client';

import { useEffect, useState } from 'react';
import { Loading } from '@/components/loading';
import { CsvImportExportPanel } from '@/components/admin/csv-import-export-panel';
import { RecipeForm } from '@/components/admin/recipeAdmin/recipe-form';
import { RecipeTable } from '@/components/admin/recipeAdmin/recipe-table';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRecipeStore } from '@/store/useRecipeStore';
import type { ArticleGetDto } from '@/types/article';
import type { RecipeCardDto, RecipeDetailDto } from '@/types/recipe';

export default function RecipesAdminPage() {
	const { toast } = useToast();
	const {
		recipes,
		isLoading,
		mode,
		selectedRecipe,
		fetchRecipes,
		fetchRecipeById,
		deleteRecipe,
		setSelectedRecipe,
	} = useRecipeStore();
	const [articles, setArticles] = useState<ArticleGetDto[]>([]);
	const [editingRecipe, setEditingRecipe] = useState<RecipeDetailDto | null>(null);
	const [isPreparingForm, setIsPreparingForm] = useState(false);

	useEffect(() => {
		void fetchRecipes();
		void fetch('/api/article?limit=1000')
			.then(response => response.json())
			.then(data => setArticles(data.articles ?? []))
			.catch(() =>
				toast({
					title: 'Erreur',
					description: 'Impossible de charger les articles du catalogue.',
					variant: 'destructive',
				}),
			);
	}, [fetchRecipes, toast]);

	const handleCreate = () => {
		setEditingRecipe(null);
		setSelectedRecipe(null, 'new');
	};

	const handleEdit = async (recipe: RecipeCardDto) => {
		setIsPreparingForm(true);
		const detail = await fetchRecipeById(recipe.id);
		setIsPreparingForm(false);

		if (!detail) {
			toast({
				title: 'Erreur',
				description: 'Recette introuvable.',
				variant: 'destructive',
			});
			return;
		}

		setEditingRecipe(detail);
		setSelectedRecipe(detail, 'edit');
	};

	const handleDelete = async () => {
		const success = await deleteRecipe();
		if (success) {
			await fetchRecipes();
		}
		setSelectedRecipe(null, null);
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="p-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between gap-4">
					<CardTitle>Gestion des recettes</CardTitle>
					<div className="flex flex-wrap items-center justify-end gap-2">
						<CsvImportExportPanel
							title="Import CSV des recettes"
							description="Le fichier utilise des colonnes JSON pour préserver les ingrédients et étapes sans ambiguïté."
							endpoint="/api/admin/csv/recipes"
							onImported={() => fetchRecipes()}
						/>
						<Button onClick={handleCreate}>Ajouter une recette</Button>
					</div>
				</CardHeader>
				<CardContent>
					{isPreparingForm && (
						<p className="mb-4 text-sm text-muted-foreground">
							Chargement de la recette...
						</p>
					)}
					<RecipeTable
						data={recipes}
						onEdit={handleEdit}
						onDelete={recipe => setSelectedRecipe(recipe, 'delete')}
					/>
				</CardContent>
			</Card>

			{(mode === 'new' || mode === 'edit') && (
				<RecipeForm
					recipe={mode === 'edit' ? editingRecipe : null}
					articles={articles}
				/>
			)}

			<AlertDialog
				open={mode === 'delete' && selectedRecipe !== null}
				onOpenChange={() => setSelectedRecipe(null, null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Supprimer cette recette ?</AlertDialogTitle>
						<AlertDialogDescription>
							Cette action supprimera définitivement la recette, ses ingrédients
							et ses étapes. Elle ne peut pas être annulée.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Annuler</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>
							Supprimer
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
