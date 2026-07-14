import { requireAdmin } from '@/lib/helpers/requireAdmin';
import { extractPublicId } from '@/lib/helpers/extractPublicId';
import { recipePutSchema } from '@/lib/validations/recipe';
import {
	deleteRecipe,
	getRecipeById,
	updateRecipe,
} from '@/services/recipeService';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

const DEFAULT_IMAGE = '/images/no-img.png';

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function deleteCloudinaryImage(imageUrl: string) {
	const publicId = extractPublicId(imageUrl, DEFAULT_IMAGE);
	if (!publicId) return;

	try {
		await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		console.error('[recipes] Erreur suppression Cloudinary:', error);
	}
}

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ message: 'Identifiant de recette requis' },
				{ status: 400 },
			);
		}

		const recipe = await getRecipeById(id);

		if (!recipe) {
			return NextResponse.json(
				{ message: 'Recette introuvable' },
				{ status: 404 },
			);
		}

		return NextResponse.json(recipe, { status: 200 });
	} catch (error) {
		console.error('[GET /api/recipes/[id]] Erreur:', error);
		return NextResponse.json(
			{ message: 'Échec de la récupération de la recette' },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const adminCheck = await requireAdmin();
		if (adminCheck.error) return adminCheck.error;

		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ message: 'Identifiant de recette requis' },
				{ status: 400 },
			);
		}

		let body: unknown;
		try {
			body = await req.json();
		} catch {
			return NextResponse.json(
				{ message: 'Format JSON invalide' },
				{ status: 400 },
			);
		}

		const result = recipePutSchema.safeParse({ ...(body as object), id });
		if (!result.success) {
			return NextResponse.json(
				{
					message: 'Données invalides',
					errors: result.error.format(),
				},
				{ status: 400 },
			);
		}

		const existing = await getRecipeById(id);
		if (!existing) {
			return NextResponse.json(
				{ message: 'Recette introuvable' },
				{ status: 404 },
			);
		}

		const oldImage = existing.image;
		const recipe = await updateRecipe(result.data);

		if (oldImage !== recipe.image && oldImage !== DEFAULT_IMAGE) {
			await deleteCloudinaryImage(oldImage);
		}

		revalidatePath('/recipes');
		revalidatePath(`/recipes/${recipe.id}`);
		revalidatePath('/admin/recipes');

		return NextResponse.json(recipe, { status: 200 });
	} catch (error) {
		console.error('[PATCH /api/recipes/[id]] Erreur:', error);

		if (error instanceof Error) {
			if (error.message === 'NOT_FOUND') {
				return NextResponse.json(
					{ message: 'Recette introuvable' },
					{ status: 404 },
				);
			}
			if (error.message.includes('introuvables')) {
				return NextResponse.json({ message: error.message }, { status: 400 });
			}
		}

		return NextResponse.json(
			{ message: 'Échec de la mise à jour de la recette' },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const adminCheck = await requireAdmin();
		if (adminCheck.error) return adminCheck.error;

		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ message: 'Identifiant de recette requis' },
				{ status: 400 },
			);
		}

		const { image } = await deleteRecipe(id);

		revalidatePath('/recipes');
		revalidatePath(`/recipes/${id}`);
		revalidatePath('/admin/recipes');

		if (image !== DEFAULT_IMAGE) {
			await deleteCloudinaryImage(image);
		}

		return NextResponse.json(
			{ message: 'Recette supprimée avec succès' },
			{ status: 200 },
		);
	} catch (error) {
		console.error('[DELETE /api/recipes/[id]] Erreur:', error);

		if (error instanceof Error && error.message === 'NOT_FOUND') {
			return NextResponse.json(
				{ message: 'Recette introuvable' },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ message: 'Échec de la suppression de la recette' },
			{ status: 500 },
		);
	}
}
