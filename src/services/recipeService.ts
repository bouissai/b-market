import { prisma } from '@/lib/prisma';
import type {
	RecipeCardDto,
	RecipeDetailDto,
	RecipeFilters,
	RecipeIngredientDto,
	RecipeIngredientInput,
	RecipeNutritionDto,
	RecipePostDto,
	RecipePutDto,
	RecipeStepDto,
} from '@/types/recipe';
import type { Prisma } from '@prisma/client';

const recipeInclude = {
	ingredients: {
		orderBy: { position: 'asc' as const },
		include: {
			article: {
				include: {
					category: { select: { name: true } },
				},
			},
		},
	},
	steps: {
		orderBy: { position: 'asc' as const },
	},
} satisfies Prisma.RecipeInclude;

type RecipeWithRelations = Prisma.RecipeGetPayload<{
	include: typeof recipeInclude;
}>;

function mapIngredient(ingredient: RecipeWithRelations['ingredients'][number]): RecipeIngredientDto {
	const article = ingredient.article;
	return {
		id: ingredient.id,
		name: ingredient.name,
		displayQuantity: ingredient.displayQuantity,
		position: ingredient.position,
		articleId: ingredient.articleId,
		cartQuantity: ingredient.cartQuantity,
		available: ingredient.articleId !== null && article !== null,
		article: article ? {
					id: article.id,
					name: article.name,
					unit: article.unit,
					price: article.price,
					image: article.image,
					categoryName: article.category.name,
				}
			: null,
	};
}

function mapNutrition(recipe: RecipeWithRelations): RecipeNutritionDto | null {
	const nutrition: RecipeNutritionDto = {};
	if (recipe.calories != null) nutrition.calories = recipe.calories;
	if (recipe.protein != null) nutrition.protein = recipe.protein;
	if (recipe.carbs != null) nutrition.carbs = recipe.carbs;
	if (recipe.fat != null) nutrition.fat = recipe.fat;
	return Object.keys(nutrition).length > 0 ? nutrition : null;
}

function mapRecipeCard(recipe: RecipeWithRelations): RecipeCardDto {
	const availableProductCount = recipe.ingredients.filter(
		i => i.articleId !== null && i.article !== null,
	).length;

	return {
		id: recipe.id,
		title: recipe.title,
		description: recipe.description,
		image: recipe.image,
		category: recipe.category,
		prepTime: recipe.prepTime,
		cookTime: recipe.cookTime,
		servings: recipe.servings,
		difficulty: recipe.difficulty as RecipeCardDto['difficulty'],
		tags: recipe.tags,
		featured: recipe.featured,
		forEvents: recipe.forEvents,
		ingredientCount: recipe.ingredients.length,
		availableProductCount,
	};
}

function mapRecipeDetail(recipe: RecipeWithRelations): RecipeDetailDto {
	return {
		...mapRecipeCard(recipe),
		ingredients: recipe.ingredients.map(mapIngredient),
		steps: recipe.steps.map(
			(step): RecipeStepDto => ({
				id: step.id,
				description: step.description,
				position: step.position,
			}),
		),
		nutrition: mapNutrition(recipe),
		createdAt: recipe.createdAt.toISOString(),
		updatedAt: recipe.updatedAt.toISOString(),
	};
}

function buildWhereClause(filters: RecipeFilters): Prisma.RecipeWhereInput {
	const where: Prisma.RecipeWhereInput = {};

	if (filters.category) {
		where.category = filters.category;
	}
	if (filters.difficulty) {
		where.difficulty = filters.difficulty;
	}
	if (filters.featured !== undefined) {
		where.featured = filters.featured;
	}
	if (filters.forEvents !== undefined) {
		where.forEvents = filters.forEvents;
	}
	if (filters.search) {
		where.title = { contains: filters.search, mode: 'insensitive' };
	}
	if (filters.tag) {
		where.tags = { has: filters.tag };
	}
	if (filters.excludeId) {
		where.id = { not: filters.excludeId };
	}

	return where;
}

export async function getRecipes(
	filters: RecipeFilters = {},
): Promise<{ recipes: RecipeCardDto[]; total: number }> {
	const where = buildWhereClause(filters);

	const [recipes, total] = await Promise.all([
		prisma.recipe.findMany({
			where,
			include: recipeInclude,
			orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }],
			...(filters.limit ? { take: filters.limit } : {}),
		}),
		prisma.recipe.count({ where }),
	]);

	return {
		recipes: recipes.map(mapRecipeCard),
		total,
	};
}

export async function getRecipeById(id: string): Promise<RecipeDetailDto | null> {
	const recipe = await prisma.recipe.findUnique({
		where: { id },
		include: recipeInclude,
	});

	if (!recipe) return null;
	return mapRecipeDetail(recipe);
}

export async function getRelatedRecipes(
	recipeId: string,
	limit = 3,
): Promise<RecipeCardDto[]> {
	const current = await prisma.recipe.findUnique({
		where: { id: recipeId },
		select: { tags: true, category: true, difficulty: true },
	});

	if (!current) return [];

	const candidates = await prisma.recipe.findMany({
		where: { id: { not: recipeId } },
		include: recipeInclude,
		orderBy: { updatedAt: 'desc' },
	});

	const scored = candidates
		.map(recipe => {
			let score = 0;
			const commonTags = recipe.tags.filter(tag => current.tags.includes(tag));
			score += commonTags.length * 3;
			if (recipe.category === current.category) score += 2;
			if (recipe.difficulty === current.difficulty) score += 1;
			return { recipe, score };
		})
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit);

	if (scored.length > 0) {
		return scored.map(({ recipe }) => mapRecipeCard(recipe));
	}

	return candidates.slice(0, limit).map(mapRecipeCard);
}

async function validateArticleIds(
	ingredients: RecipeIngredientInput[],
): Promise<string | null> {
	const articleIds = ingredients
		.map(i => i.articleId)
		.filter((id): id is string => !!id);

	if (articleIds.length === 0) return null;

	const uniqueIds = [...new Set(articleIds)];
	const articles = await prisma.article.findMany({
		where: { id: { in: uniqueIds } },
		select: { id: true },
	});

	if (articles.length !== uniqueIds.length) {
		return 'Un ou plusieurs articles liés sont introuvables';
	}

	return null;
}

function normalizePositions<T extends { position: number }>(items: T[]): T[] {
	return items.map((item, index) => ({ ...item, position: index + 1 }));
}

export async function createRecipe(data: RecipePostDto): Promise<RecipeDetailDto> {
	const articleError = await validateArticleIds(data.ingredients);
	if (articleError) {
		throw new Error(articleError);
	}

	const ingredients = normalizePositions(data.ingredients);
	const steps = normalizePositions(data.steps);

	const recipe = await prisma.recipe.create({
		data: {
			title: data.title,
			description: data.description,
			image: data.image || '/images/no-img.png',
			category: data.category,
			prepTime: data.prepTime,
			cookTime: data.cookTime,
			servings: data.servings,
			difficulty: data.difficulty,
			tags: data.tags,
			featured: data.featured,
			forEvents: data.forEvents,
			calories: data.calories ?? null,
			protein: data.protein ?? null,
			carbs: data.carbs ?? null,
			fat: data.fat ?? null,
			ingredients: {
				create: ingredients.map(ing => ({
					name: ing.name,
					displayQuantity: ing.displayQuantity,
					position: ing.position,
					articleId: ing.articleId ?? null,
					cartQuantity: ing.articleId ? (ing.cartQuantity ?? null) : null,
				})),
			},
			steps: {
				create: steps.map(step => ({
					description: step.description,
					position: step.position,
				})),
			},
		},
		include: recipeInclude,
	});

	return mapRecipeDetail(recipe);
}

export async function updateRecipe(data: RecipePutDto): Promise<RecipeDetailDto> {
	const existing = await prisma.recipe.findUnique({
		where: { id: data.id },
		include: { ingredients: true, steps: true },
	});

	if (!existing) {
		throw new Error('NOT_FOUND');
	}

	const articleError = await validateArticleIds(data.ingredients);
	if (articleError) {
		throw new Error(articleError);
	}

	const ingredients = normalizePositions(data.ingredients);
	const steps = normalizePositions(data.steps);

	const recipe = await prisma.$transaction(async tx => {
		await tx.recipeIngredient.deleteMany({ where: { recipeId: data.id } });
		await tx.recipeStep.deleteMany({ where: { recipeId: data.id } });

		return tx.recipe.update({
			where: { id: data.id },
			data: {
				title: data.title,
				description: data.description,
				image: data.image || '/images/no-img.png',
				category: data.category,
				prepTime: data.prepTime,
				cookTime: data.cookTime,
				servings: data.servings,
				difficulty: data.difficulty,
				tags: data.tags,
				featured: data.featured,
				forEvents: data.forEvents,
				calories: data.calories ?? null,
				protein: data.protein ?? null,
				carbs: data.carbs ?? null,
				fat: data.fat ?? null,
				ingredients: {
					create: ingredients.map(ing => ({
						name: ing.name,
						displayQuantity: ing.displayQuantity,
						position: ing.position,
						articleId: ing.articleId ?? null,
						cartQuantity: ing.articleId ? (ing.cartQuantity ?? null) : null,
					})),
				},
				steps: {
					create: steps.map(step => ({
						description: step.description,
						position: step.position,
					})),
				},
			},
			include: recipeInclude,
		});
	});

	return mapRecipeDetail(recipe);
}

export async function deleteRecipe(id: string): Promise<{ image: string }> {
	const existing = await prisma.recipe.findUnique({
		where: { id },
		select: { id: true, image: true },
	});

	if (!existing) {
		throw new Error('NOT_FOUND');
	}

	await prisma.recipe.delete({ where: { id } });

	return { image: existing.image };
}

export async function recipeExists(id: string): Promise<boolean> {
	const count = await prisma.recipe.count({ where: { id } });
	return count > 0;
}
