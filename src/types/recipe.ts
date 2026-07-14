export type RecipeDifficulty = 'facile' | 'moyen' | 'difficile';

export type RecipeIngredientDto = {
	id: string;
	name: string;
	displayQuantity: string;
	position: number;
	articleId: string | null;
	cartQuantity: number | null;
	available: boolean;
	article?: {
		id: string;
		name: string;
		unit: string;
		price: number;
		image: string;
		categoryName: string;
	} | null;
};

export type RecipeStepDto = {
	id: string;
	description: string;
	position: number;
};

export type RecipeNutritionDto = {
	calories?: number;
	protein?: number;
	carbs?: number;
	fat?: number;
};

export type RecipeCardDto = {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	prepTime: number;
	cookTime: number;
	servings: number;
	difficulty: RecipeDifficulty;
	tags: string[];
	featured: boolean;
	forEvents: boolean;
	ingredientCount: number;
	availableProductCount: number;
};

export type RecipeDetailDto = RecipeCardDto & {
	ingredients: RecipeIngredientDto[];
	steps: RecipeStepDto[];
	nutrition: RecipeNutritionDto | null;
	createdAt: string;
	updatedAt: string;
};

export type RecipeIngredientInput = {
	id?: string;
	name: string;
	displayQuantity: string;
	position: number;
	articleId?: string | null;
	cartQuantity?: number | null;
};

export type RecipeStepInput = {
	id?: string;
	description: string;
	position: number;
};

export type RecipePostDto = {
	title: string;
	description: string;
	image: string;
	category: string;
	prepTime: number;
	cookTime: number;
	servings: number;
	difficulty: RecipeDifficulty;
	tags: string[];
	featured: boolean;
	forEvents: boolean;
	calories?: number | null;
	protein?: number | null;
	carbs?: number | null;
	fat?: number | null;
	ingredients: RecipeIngredientInput[];
	steps: RecipeStepInput[];
};

export type RecipePutDto = RecipePostDto & {
	id: string;
};

export type RecipeDeleteDto = {
	id: string;
	title: string;
	image: string;
};

export type RecipeListResponse = {
	recipes: RecipeCardDto[];
	total: number;
};

export type RecipeFilters = {
	category?: string;
	difficulty?: RecipeDifficulty;
	featured?: boolean;
	forEvents?: boolean;
	search?: string;
	tag?: string;
	excludeId?: string;
	limit?: number;
};

export type RecipeFormValues = RecipePostDto;

export type BulkCartItemInput = {
	articleId: string;
	quantity: number;
};

export type BulkCartResult = {
	added: Array<{ articleId: string; name: string; quantity: number }>;
	skipped: Array<{ articleId: string; reason: string }>;
	errors: Array<{ articleId: string; reason: string }>;
};
