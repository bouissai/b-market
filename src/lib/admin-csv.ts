import { prisma } from '@/lib/prisma';
import { parseCsv, toCsv } from '@/lib/csv';
import { recipePostSchema, type RecipePostInput } from '@/lib/validations/recipe';
import { z } from 'zod';

const ARTICLE_HEADERS = [
	'id',
	'name',
	'unit',
	'price',
	'image',
	'description',
	'categoryId',
	'categoryName',
];

const RECIPE_HEADERS = [
	'id',
	'title',
	'description',
	'image',
	'category',
	'prepTime',
	'cookTime',
	'servings',
	'difficulty',
	'tags',
	'featured',
	'forEvents',
	'calories',
	'protein',
	'carbs',
	'fat',
	'ingredients_json',
	'steps_json',
];

export type CsvImportMode = 'preview' | 'commit';

export type CsvImportReport<TPreview> = {
	created: number;
	updated: number;
	skipped: number;
	errors: Array<{ row: number; message: string }>;
	rows: TPreview[];
};

type ArticlePreview = {
	row: number;
	action: 'create' | 'update' | 'skip';
	id: string;
	name: string;
	categoryName: string;
};

type RecipePreview = {
	row: number;
	action: 'create' | 'update' | 'skip';
	id: string;
	title: string;
	ingredientCount: number;
	stepCount: number;
};

const articleImportSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, 'Le nom est requis'),
	unit: z.string().min(1, "L'unité est requise"),
	price: z.coerce.number().positive('Le prix doit être positif'),
	image: z.string().optional(),
	description: z.string().optional(),
	categoryId: z.string().optional(),
	categoryName: z.string().optional(),
});

function assertHeaders(
	actual: string[],
	expected: string[],
	errors: Array<{ row: number; message: string }>,
) {
	for (const header of expected) {
		if (!actual.includes(header)) {
			errors.push({ row: 1, message: `Colonne manquante: ${header}` });
		}
	}
}

function parseBoolean(value: string) {
	return ['true', '1', 'oui', 'yes'].includes(value.trim().toLowerCase());
}

function parseOptionalNumber(value: string) {
	if (!value.trim()) return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export async function exportArticlesCsv() {
	const articles = await prisma.article.findMany({
		orderBy: { name: 'asc' },
		include: { category: { select: { name: true } } },
	});

	return toCsv(
		ARTICLE_HEADERS,
		articles.map(article => ({
			id: article.id,
			name: article.name,
			unit: article.unit,
			price: article.price,
			image: article.image,
			description: article.description ?? '',
			categoryId: article.categoryId,
			categoryName: article.category.name,
		})),
	);
}

export function articleCsvTemplate() {
	return toCsv(ARTICLE_HEADERS, [
		{
			id: '',
			name: 'Entrecôte exemple',
			unit: 'kg',
			price: '24.9',
			image: '/images/no-img.png',
			description: 'Description courte',
			categoryId: '',
			categoryName: 'Boeuf',
		},
	]);
}

export async function importArticlesCsv(
	content: string,
	mode: CsvImportMode,
): Promise<CsvImportReport<ArticlePreview>> {
	const parsed = parseCsv(content);
	const errors: Array<{ row: number; message: string }> = parsed.errors.map(
		message => ({ row: 0, message }),
	);
	assertHeaders(parsed.headers, ARTICLE_HEADERS, errors);

	const categories = await prisma.category.findMany({
		select: { id: true, name: true },
	});
	const categoryById = new Map(categories.map(category => [category.id, category]));
	const categoryByName = new Map(
		categories.map(category => [category.name.toLowerCase(), category]),
	);
	const existingArticles = await prisma.article.findMany({
		select: { id: true, name: true },
	});
	const existingById = new Map(existingArticles.map(article => [article.id, article]));
	const existingNameSet = new Set(
		existingArticles.map(article => article.name.toLowerCase()),
	);
	const seenIds = new Set<string>();
	const seenNames = new Set<string>();
	const rows: ArticlePreview[] = [];
	const operations: Array<{
		action: 'create' | 'update';
		id?: string;
		data: {
			name: string;
			unit: string;
			price: number;
			image: string;
			description: string;
			categoryId: string;
		};
	}> = [];

	parsed.rows.forEach((row, index) => {
		const rowNumber = index + 2;
		const result = articleImportSchema.safeParse(row);
		if (!result.success) {
			errors.push({
				row: rowNumber,
				message: result.error.issues.map(issue => issue.message).join(', '),
			});
			rows.push({
				row: rowNumber,
				action: 'skip',
				id: row.id ?? '',
				name: row.name ?? '',
				categoryName: row.categoryName ?? '',
			});
			return;
		}

		const data = result.data;
		const id = data.id?.trim();
		const nameKey = data.name.toLowerCase();

		if (id && seenIds.has(id)) {
			errors.push({ row: rowNumber, message: `Identifiant dupliqué: ${id}` });
			rows.push({
				row: rowNumber,
				action: 'skip',
				id,
				name: data.name,
				categoryName: data.categoryName ?? '',
			});
			return;
		}
		if (seenNames.has(nameKey)) {
			errors.push({
				row: rowNumber,
				message: `Nom dupliqué dans le fichier: ${data.name}`,
			});
			rows.push({
				row: rowNumber,
				action: 'skip',
				id: id ?? '',
				name: data.name,
				categoryName: data.categoryName ?? '',
			});
			return;
		}

		if (id) seenIds.add(id);
		seenNames.add(nameKey);

		const category = data.categoryId
			? categoryById.get(data.categoryId)
			: data.categoryName
				? categoryByName.get(data.categoryName.toLowerCase())
				: null;

		if (!category) {
			errors.push({
				row: rowNumber,
				message:
					'Catégorie introuvable. Renseignez categoryId ou un categoryName existant.',
			});
			rows.push({
				row: rowNumber,
				action: 'skip',
				id: id ?? '',
				name: data.name,
				categoryName: data.categoryName ?? '',
			});
			return;
		}

		const existing = id ? existingById.get(id) : null;
		if (!existing && existingNameSet.has(nameKey)) {
			errors.push({
				row: rowNumber,
				message:
					'Un article existe déjà avec ce nom. Exportez les articles pour récupérer son id avant mise à jour.',
			});
			rows.push({
				row: rowNumber,
				action: 'skip',
				id: id ?? '',
				name: data.name,
				categoryName: category.name,
			});
			return;
		}

		const action: 'create' | 'update' = existing ? 'update' : 'create';
		const operation = {
			action,
			id,
			data: {
				name: data.name,
				unit: data.unit,
				price: data.price,
				image: data.image ?? '/images/no-img.png',
				description: data.description ?? '',
				categoryId: category.id,
			},
		};
		operations.push(operation);
		rows.push({
			row: rowNumber,
			action,
			id: id ?? '',
			name: data.name,
			categoryName: category.name,
		});
	});

	if (mode === 'commit' && errors.length === 0) {
		await prisma.$transaction(
			operations.map(operation =>
				operation.action === 'update' && operation.id
					? prisma.article.update({
							where: { id: operation.id },
							data: operation.data,
						})
					: prisma.article.create({ data: operation.data }),
			),
		);
	}

	return {
		created: operations.filter(operation => operation.action === 'create').length,
		updated: operations.filter(operation => operation.action === 'update').length,
		skipped: rows.filter(row => row.action === 'skip').length,
		errors,
		rows,
	};
}

export async function exportRecipesCsv() {
	const recipes = await prisma.recipe.findMany({
		orderBy: { updatedAt: 'desc' },
		include: {
			ingredients: { orderBy: { position: 'asc' } },
			steps: { orderBy: { position: 'asc' } },
		},
	});

	return toCsv(
		RECIPE_HEADERS,
		recipes.map(recipe => ({
			id: recipe.id,
			title: recipe.title,
			description: recipe.description,
			image: recipe.image,
			category: recipe.category,
			prepTime: recipe.prepTime,
			cookTime: recipe.cookTime,
			servings: recipe.servings,
			difficulty: recipe.difficulty,
			tags: recipe.tags.join(', '),
			featured: recipe.featured,
			forEvents: recipe.forEvents,
			calories: recipe.calories ?? '',
			protein: recipe.protein ?? '',
			carbs: recipe.carbs ?? '',
			fat: recipe.fat ?? '',
			ingredients_json: JSON.stringify(
				recipe.ingredients.map(ingredient => ({
					name: ingredient.name,
					displayQuantity: ingredient.displayQuantity,
					position: ingredient.position,
					articleId: ingredient.articleId,
					cartQuantity: ingredient.cartQuantity,
				})),
			),
			steps_json: JSON.stringify(
				recipe.steps.map(step => ({
					description: step.description,
					position: step.position,
				})),
			),
		})),
	);
}

export function recipeCsvTemplate() {
	return toCsv(RECIPE_HEADERS, [
		{
			id: '',
			title: 'Bavette aux échalotes',
			description: 'Recette simple pour valoriser une belle pièce de viande.',
			image: '/images/no-img.png',
			category: 'plat-principal',
			prepTime: '15',
			cookTime: '10',
			servings: '4',
			difficulty: 'facile',
			tags: 'boeuf, rapide',
			featured: 'false',
			forEvents: 'false',
			calories: '',
			protein: '',
			carbs: '',
			fat: '',
			ingredients_json:
				'[{"name":"Bavette","displayQuantity":"800 g","position":1,"articleId":null,"cartQuantity":null}]',
			steps_json:
				'[{"description":"Saisir la viande dans une poêle chaude.","position":1}]',
		},
	]);
}

function parseJsonArray(value: string, row: number, label: string) {
	try {
		const parsed: unknown = JSON.parse(value);
		if (!Array.isArray(parsed)) {
			return { value: null, error: `Ligne ${row}: ${label} doit être un tableau JSON.` };
		}
		return { value: parsed, error: null };
	} catch {
		return { value: null, error: `Ligne ${row}: ${label} n'est pas un JSON valide.` };
	}
}

export async function importRecipesCsv(
	content: string,
	mode: CsvImportMode,
): Promise<CsvImportReport<RecipePreview>> {
	const parsed = parseCsv(content, 200);
	const errors: Array<{ row: number; message: string }> = parsed.errors.map(
		message => ({ row: 0, message }),
	);
	assertHeaders(parsed.headers, RECIPE_HEADERS, errors);

	const existingRecipes = await prisma.recipe.findMany({
		select: { id: true, title: true },
	});
	const existingById = new Map(existingRecipes.map(recipe => [recipe.id, recipe]));
	const existingTitleSet = new Set(
		existingRecipes.map(recipe => recipe.title.toLowerCase()),
	);
	const seenIds = new Set<string>();
	const seenTitles = new Set<string>();
	const rows: RecipePreview[] = [];
	const operations: Array<{
		action: 'create' | 'update';
		id?: string;
		data: RecipePostInput;
	}> = [];

	parsed.rows.forEach((row, index) => {
		const rowNumber = index + 2;
		const id = row.id?.trim();
		const title = row.title?.trim() ?? '';
		const titleKey = title.toLowerCase();

		if (id && seenIds.has(id)) {
			errors.push({ row: rowNumber, message: `Identifiant dupliqué: ${id}` });
			rows.push({ row: rowNumber, action: 'skip', id, title, ingredientCount: 0, stepCount: 0 });
			return;
		}
		if (seenTitles.has(titleKey)) {
			errors.push({ row: rowNumber, message: `Titre dupliqué dans le fichier: ${title}` });
			rows.push({ row: rowNumber, action: 'skip', id: id ?? '', title, ingredientCount: 0, stepCount: 0 });
			return;
		}

		if (id) seenIds.add(id);
		if (titleKey) seenTitles.add(titleKey);

		const ingredients = parseJsonArray(
			row.ingredients_json ?? '',
			rowNumber,
			'ingredients_json',
		);
		const steps = parseJsonArray(row.steps_json ?? '', rowNumber, 'steps_json');

		if (ingredients.error || steps.error) {
			if (ingredients.error) errors.push({ row: rowNumber, message: ingredients.error });
			if (steps.error) errors.push({ row: rowNumber, message: steps.error });
			rows.push({ row: rowNumber, action: 'skip', id: id ?? '', title, ingredientCount: 0, stepCount: 0 });
			return;
		}

		const payload = recipePostSchema.safeParse({
			title,
			description: row.description ?? '',
			image: row.image || '/images/no-img.png',
			category: row.category || 'plat-principal',
			prepTime: Number(row.prepTime),
			cookTime: Number(row.cookTime),
			servings: Number(row.servings),
			difficulty: row.difficulty,
			tags: (row.tags ?? '')
				.split(',')
				.map(tag => tag.trim())
				.filter(Boolean),
			featured: parseBoolean(row.featured ?? ''),
			forEvents: parseBoolean(row.forEvents ?? ''),
			calories: parseOptionalNumber(row.calories ?? ''),
			protein: parseOptionalNumber(row.protein ?? ''),
			carbs: parseOptionalNumber(row.carbs ?? ''),
			fat: parseOptionalNumber(row.fat ?? ''),
			ingredients: ingredients.value,
			steps: steps.value,
		});

		if (!payload.success) {
			errors.push({
				row: rowNumber,
				message: payload.error.issues.map(issue => issue.message).join(', '),
			});
			rows.push({ row: rowNumber, action: 'skip', id: id ?? '', title, ingredientCount: 0, stepCount: 0 });
			return;
		}

		const existing = id ? existingById.get(id) : null;
		if (!existing && existingTitleSet.has(titleKey)) {
			errors.push({
				row: rowNumber,
				message:
					'Une recette existe déjà avec ce titre. Exportez les recettes pour récupérer son id avant mise à jour.',
			});
			rows.push({ row: rowNumber, action: 'skip', id: id ?? '', title, ingredientCount: 0, stepCount: 0 });
			return;
		}

		const action = existing ? 'update' : 'create';
		operations.push({ action, id, data: payload.data });
		rows.push({
			row: rowNumber,
			action,
			id: id ?? '',
			title,
			ingredientCount: payload.data.ingredients.length,
			stepCount: payload.data.steps.length,
		});
	});

	if (mode === 'commit' && errors.length === 0) {
		await prisma.$transaction(
			operations.map(operation => {
				const data = {
					title: operation.data.title,
					description: operation.data.description,
					image: operation.data.image,
					category: operation.data.category,
					prepTime: operation.data.prepTime,
					cookTime: operation.data.cookTime,
					servings: operation.data.servings,
					difficulty: operation.data.difficulty,
					tags: operation.data.tags,
					featured: operation.data.featured,
					forEvents: operation.data.forEvents,
					calories: operation.data.calories ?? null,
					protein: operation.data.protein ?? null,
					carbs: operation.data.carbs ?? null,
					fat: operation.data.fat ?? null,
					ingredients: {
						create: operation.data.ingredients.map((ingredient, position) => ({
							name: ingredient.name,
							displayQuantity: ingredient.displayQuantity,
							position: position + 1,
							articleId: ingredient.articleId ?? null,
							cartQuantity: ingredient.articleId
								? (ingredient.cartQuantity ?? null)
								: null,
						})),
					},
					steps: {
						create: operation.data.steps.map((step, position) => ({
							description: step.description,
							position: position + 1,
						})),
					},
				};

				return operation.action === 'update' && operation.id
					? prisma.recipe.update({
							where: { id: operation.id },
							data: {
								...data,
								ingredients: {
									deleteMany: {},
									create: data.ingredients.create,
								},
								steps: {
									deleteMany: {},
									create: data.steps.create,
								},
							},
						})
					: prisma.recipe.create({ data });
			}),
		);
	}

	return {
		created: operations.filter(operation => operation.action === 'create').length,
		updated: operations.filter(operation => operation.action === 'update').length,
		skipped: rows.filter(row => row.action === 'skip').length,
		errors,
		rows,
	};
}
