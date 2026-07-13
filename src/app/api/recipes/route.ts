import { recipeQuerySchema, recipePostSchema } from '@/lib/validations/recipe';
import { requireAdmin } from '@/lib/helpers/requireAdmin';
import {
	createRecipe,
	getRecipes,
} from '@/services/recipeService';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const params = Object.fromEntries(searchParams.entries());
		const result = recipeQuerySchema.safeParse(params);

		if (!result.success) {
			return NextResponse.json(
				{
					message: 'Paramètres de requête invalides',
					errors: result.error.format(),
				},
				{ status: 400 },
			);
		}

		const data = await getRecipes(result.data);

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error('[GET /api/recipes] Erreur:', error);
		return NextResponse.json(
			{ message: 'Échec de la récupération des recettes' },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const adminCheck = await requireAdmin();
		if (adminCheck.error) return adminCheck.error;

		let body: unknown;
		try {
			body = await req.json();
		} catch {
			return NextResponse.json(
				{ message: 'Format JSON invalide' },
				{ status: 400 },
			);
		}

		const result = recipePostSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json(
				{
					message: 'Données invalides',
					errors: result.error.format(),
				},
				{ status: 400 },
			);
		}

		const recipe = await createRecipe(result.data);

		revalidatePath('/recipes');
		revalidatePath(`/recipes/${recipe.id}`);
		revalidatePath('/admin/recipes');

		return NextResponse.json(recipe, { status: 201 });
	} catch (error) {
		console.error('[POST /api/recipes] Erreur:', error);

		if (error instanceof Error) {
			if (error.message.includes('introuvables')) {
				return NextResponse.json({ message: error.message }, { status: 400 });
			}
		}

		return NextResponse.json(
			{ message: 'Échec de la création de la recette' },
			{ status: 500 },
		);
	}
}
