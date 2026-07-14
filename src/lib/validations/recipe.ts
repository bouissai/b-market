import { z } from 'zod';

export const recipeDifficultySchema = z.enum(['facile', 'moyen', 'difficile']);

export const recipeIngredientInputSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().min(1, 'Le nom de l\'ingrédient est requis'),
		displayQuantity: z.string().min(1, 'La quantité affichée est requise'),
		position: z.number().int().positive('La position doit être positive'),
		articleId: z.string().nullable().optional(),
		cartQuantity: z.number().int().positive().nullable().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.articleId) {
			if (!data.cartQuantity || data.cartQuantity < 1) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						'La quantité panier doit être un entier strictement positif lorsqu\'un article est lié',
					path: ['cartQuantity'],
				});
			}
		} else if (data.cartQuantity != null) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'La quantité panier ne doit pas être définie sans article lié',
				path: ['cartQuantity'],
			});
		}
	});

export const recipeStepInputSchema = z.object({
	id: z.string().optional(),
	description: z.string().min(1, 'Le texte de l\'étape est requis'),
	position: z.number().int().positive('La position doit être positive'),
});

export const recipePostSchema = z.object({
	title: z.string().min(1, 'Le titre est requis'),
	description: z.string().min(1, 'La description est requise'),
	image: z.string().min(1, 'L\'image est requise'),
	category: z.string().min(1, 'La catégorie est requise'),
	prepTime: z.number().int().min(0, 'Le temps de préparation doit être positif ou nul'),
	cookTime: z.number().int().min(0, 'Le temps de cuisson doit être positif ou nul'),
	servings: z.number().int().positive('Le nombre de portions doit être strictement positif'),
	difficulty: recipeDifficultySchema,
	tags: z.array(z.string()).default([]),
	featured: z.boolean().default(false),
	forEvents: z.boolean().default(false),
	calories: z.number().int().positive().nullable().optional(),
	protein: z.number().int().positive().nullable().optional(),
	carbs: z.number().int().positive().nullable().optional(),
	fat: z.number().int().positive().nullable().optional(),
	ingredients: z
		.array(recipeIngredientInputSchema)
		.min(1, 'Au moins un ingrédient est requis'),
	steps: z.array(recipeStepInputSchema).min(1, 'Au moins une étape est requise'),
});

export const recipePutSchema = recipePostSchema.extend({
	id: z.string().min(1, 'L\'identifiant est requis'),
});

export const recipeQuerySchema = z.object({
	category: z.string().optional(),
	difficulty: recipeDifficultySchema.optional(),
	featured: z
		.enum(['true', 'false'])
		.optional()
		.transform(v => (v === undefined ? undefined : v === 'true')),
	forEvents: z
		.enum(['true', 'false'])
		.optional()
		.transform(v => (v === undefined ? undefined : v === 'true')),
	search: z.string().optional(),
	tag: z.string().optional(),
	excludeId: z.string().optional(),
	limit: z.coerce.number().int().positive().max(100).optional(),
});

export const bulkCartItemsSchema = z.object({
	items: z
		.array(
			z.object({
				articleId: z.string().min(1),
				quantity: z.number().int().positive().max(99),
			}),
		)
		.min(1, 'Au moins un article est requis'),
});

export type RecipePostInput = z.infer<typeof recipePostSchema>;
export type RecipePutInput = z.infer<typeof recipePutSchema>;
export type RecipeQueryInput = z.infer<typeof recipeQuerySchema>;
