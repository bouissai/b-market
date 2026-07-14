import { toast } from '@/hooks/use-toast';
import type {
	RecipeCardDto,
	RecipeDeleteDto,
	RecipeDetailDto,
	RecipePostDto,
	RecipePutDto,
} from '@/types/recipe';
import { create } from 'zustand';

type RecipeStore = {
	recipes: RecipeCardDto[];
	selectedRecipe:
		| RecipePutDto
		| RecipePostDto
		| RecipeDeleteDto
		| RecipeDetailDto
		| null;
	mode: 'new' | 'edit' | 'delete' | null;
	isLoading: boolean;
	isSubmitting: boolean;
	error: string | null;
	totalRecipes: number;
	fetchRecipes: () => Promise<void>;
	fetchRecipeById: (id: string) => Promise<RecipeDetailDto | null>;
	addRecipe: (recipe: RecipePostDto) => Promise<RecipeDetailDto | null>;
	updateRecipe: (recipe: RecipePutDto) => Promise<RecipeDetailDto | null>;
	deleteRecipe: () => Promise<boolean>;
	setSelectedRecipe: (
		recipe:
			| RecipePutDto
			| RecipePostDto
			| RecipeDeleteDto
			| RecipeDetailDto
			| null,
		mode: null | 'edit' | 'delete' | 'new',
	) => void;
};

export const useRecipeStore = create<RecipeStore>((set, get) => ({
	recipes: [],
	selectedRecipe: null,
	mode: null,
	isLoading: false,
	isSubmitting: false,
	error: null,
	totalRecipes: 0,

	fetchRecipes: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await fetch('/api/recipes');
			if (!response.ok) {
				throw new Error('Erreur lors du chargement des recettes');
			}
			const data = await response.json();
			set({
				recipes: data.recipes,
				totalRecipes: data.total,
				isLoading: false,
			});
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Une erreur est survenue',
				isLoading: false,
			});
		}
	},

	fetchRecipeById: async (id: string) => {
		try {
			const response = await fetch(`/api/recipes/${id}`);
			if (!response.ok) return null;
			return (await response.json()) as RecipeDetailDto;
		} catch {
			return null;
		}
	},

	setSelectedRecipe: (recipe, mode) => {
		if (mode === 'delete' && recipe) {
			const { id, title, image } = recipe as RecipeDeleteDto;
			set({ selectedRecipe: { id, title, image }, mode });
		} else {
			set({ selectedRecipe: recipe, mode });
		}
	},

	addRecipe: async (recipeData: RecipePostDto) => {
		set({ isSubmitting: true, error: null });
		try {
			const response = await fetch('/api/recipes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(recipeData),
			});

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(errorResponse.message || 'Erreur inconnue');
			}

			const newRecipe = (await response.json()) as RecipeDetailDto;

			set(state => ({
				recipes: [
					...state.recipes,
					{
						id: newRecipe.id,
						title: newRecipe.title,
						description: newRecipe.description,
						image: newRecipe.image,
						category: newRecipe.category,
						prepTime: newRecipe.prepTime,
						cookTime: newRecipe.cookTime,
						servings: newRecipe.servings,
						difficulty: newRecipe.difficulty,
						tags: newRecipe.tags,
						featured: newRecipe.featured,
						forEvents: newRecipe.forEvents,
						ingredientCount: newRecipe.ingredients.length,
						availableProductCount: newRecipe.availableProductCount,
					},
				],
				totalRecipes: state.totalRecipes + 1,
				isSubmitting: false,
			}));

			toast({
				title: 'Succès',
				description: 'Recette ajoutée avec succès',
			});

			return newRecipe;
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Une erreur est survenue',
				isSubmitting: false,
			});
			toast({
				title: 'Erreur',
				description:
					error instanceof Error
						? error.message
						: 'Une erreur est survenue',
				variant: 'destructive',
			});
			return null;
		}
	},

	updateRecipe: async (recipeData: RecipePutDto) => {
		set({ isSubmitting: true, error: null });
		try {
			const response = await fetch(`/api/recipes/${recipeData.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(recipeData),
			});

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(errorResponse.message || 'Erreur inconnue');
			}

			const updatedRecipe = (await response.json()) as RecipeDetailDto;

			set(state => ({
				recipes: state.recipes.map(r =>
					r.id === updatedRecipe.id
						? {
								id: updatedRecipe.id,
								title: updatedRecipe.title,
								description: updatedRecipe.description,
								image: updatedRecipe.image,
								category: updatedRecipe.category,
								prepTime: updatedRecipe.prepTime,
								cookTime: updatedRecipe.cookTime,
								servings: updatedRecipe.servings,
								difficulty: updatedRecipe.difficulty,
								tags: updatedRecipe.tags,
								featured: updatedRecipe.featured,
								forEvents: updatedRecipe.forEvents,
								ingredientCount: updatedRecipe.ingredients.length,
								availableProductCount:
									updatedRecipe.availableProductCount,
							}
						: r,
				),
				isSubmitting: false,
			}));

			toast({
				title: 'Succès',
				description: 'Recette modifiée avec succès',
			});

			return updatedRecipe;
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Une erreur est survenue',
				isSubmitting: false,
			});
			toast({
				title: 'Erreur',
				description:
					error instanceof Error
						? error.message
						: 'Une erreur est survenue',
				variant: 'destructive',
			});
			return null;
		}
	},

	deleteRecipe: async () => {
		const { selectedRecipe } = get();
		if (!selectedRecipe || !('id' in selectedRecipe)) return false;

		try {
			const response = await fetch(`/api/recipes/${selectedRecipe.id}`, {
				method: 'DELETE',
			});
			const data = await response.json();

			if (!response.ok) {
				toast({
					title: 'Erreur',
					description:
						data.message ||
						'Une erreur est survenue lors de la suppression',
					variant: 'destructive',
				});
				return false;
			}

			set(state => ({
				recipes: state.recipes.filter(r => r.id !== selectedRecipe.id),
				totalRecipes: state.totalRecipes - 1,
				selectedRecipe: null,
				mode: null,
			}));

			toast({
				title: 'Succès',
				description: 'Recette supprimée avec succès',
			});

			return true;
		} catch {
			toast({
				title: 'Erreur',
				description: 'Une erreur est survenue lors de la suppression',
				variant: 'destructive',
			});
			return false;
		}
	},
}));
