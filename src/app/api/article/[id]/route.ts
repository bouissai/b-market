import { prisma } from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { ArticleGetDto } from '@/types/article';
import { NextRequest, NextResponse } from 'next/server';

// Récupérer un article par ID
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const id = (await params).id;

		// Vérification si l'ID est valide
		if (!id) {
			return NextResponse.json(
				{ message: "L'ID de l'article est requis" },
				{ status: 400 },
			);
		}

		// Recherche de l'article
		const article = await prisma.article.findUnique({
			where: { id },
		});

		if (!article) {
			return NextResponse.json(
				{ message: 'Article not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json(article, { status: 200 });
	} catch (error) {
		console.error('Failed to fetch article:', error);
		return NextResponse.json(
			{ message: 'Failed to fetch article' },
			{ status: 500 },
		);
	}
}

// Mettre à jour un article par ID
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const id = (await params).id;

		if (!id) {
			return NextResponse.json(
				{ message: "L'ID de l'article est requis" },
				{ status: 400 },
			);
		}

		const body = await request.json();
		// Vérifier si l'article existe
		const existingArticle = await prisma.article.findUnique({
			where: { id },
		});

		if (!existingArticle) {
			return NextResponse.json(
				{ message: 'Article introuvable' },
				{ status: 404 },
			);
		}

		// Validation des champs autorisés
		const { name, image, description, price, unit, categoryName } = body;

		if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
			console.error(`❌ Le prix doit être un nombre positif`);
			return NextResponse.json(
				{ message: 'Le prix doit être un nombre positif' },
				{ status: 400 },
			);
		}

		// Vérifier si une catégorie valide est fournie
		let category;
		if (categoryName) {
			category = await prisma.category.findUnique({
				where: { name: categoryName },
			});

			if (!category) {
				console.error(`❌ La catégorie '${categoryName}' n'existe pas`);
				return NextResponse.json(
					{ message: `La catégorie '${categoryName}' n'existe pas` },
					{ status: 400 },
				);
			}
		}

		// Vérifier si un autre article avec le même nom existe déjà
		if (name && name !== existingArticle.name) {
			const articleWithSameName = await prisma.article.findFirst({
				where: {
					name,
					id: { not: id }, // Vérifie que l'article trouvé n'est pas celui qu'on met à jour
				},
			});

			if (articleWithSameName) {
				console.error(
					`❌ Le nom '${name}' existe déjà sur un autre article`,
				);
				return NextResponse.json(
					{ message: `Le nom '${name}' existe déjà sur un autre article` },
					{ status: 409 }, // 409 Conflict
				);
			}
		}

		// Mettre à jour l'article
		const updatedArticle = await prisma.article.update({
			where: { id },
			data: {
				name: name ?? existingArticle.name,
				image: image ?? existingArticle.image,
				description: description ?? existingArticle.description,
				price: price ?? existingArticle.price,
				unit: unit ?? existingArticle.unit,
				category: category ? { connect: { id: category.id } } : undefined,
			},
			include: {
				category: {
					select: { name: true },
				},
			},
		});

		const articleGetDto: ArticleGetDto = {
			id: updatedArticle.id,
			name: updatedArticle.name,
			unit: updatedArticle.unit,
			price: updatedArticle.price,
			image: updatedArticle.image,
			description: updatedArticle.description || '',
			categoryId: updatedArticle.categoryId,
			categoryName: updatedArticle.category.name,
		};

		return NextResponse.json(articleGetDto, { status: 200 });
	} catch (error) {
		console.error("Erreur lors de la mise à jour de l'article:", error);

		if (error instanceof PrismaClientKnownRequestError) {
			return NextResponse.json(
				{ message: 'Erreur de base de données' },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{ message: 'Erreur serveur lors de la mise à jour.' },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const id = (await params).id;
		// 1️⃣ Vérification de l'ID
		if (!id) {
			console.error('❌ ID manquant !');
			return NextResponse.json(
				{ message: "L'ID de l'article est requis" },
				{ status: 400 },
			);
		}

		// 2️⃣ Vérifier si l'article existe
		const existingArticle = await prisma.article.findUnique({
			where: { id },
		});

		if (!existingArticle) {
			console.error('❌ Article introuvable !');
			return NextResponse.json(
				{ message: 'Article introuvable' },
				{ status: 404 },
			);
		}

		// 3️⃣ Vérifier si l'article est utilisé dans une commande via OrderItem
		const linkedOrderItems = await prisma.orderItem.findFirst({
			where: {
				articleId: id, // Vérifie si cet article est utilisé dans une commande
			},
		});

		if (linkedOrderItems) {
			return NextResponse.json(
				{
					message:
						"Impossible de supprimer l'article : Il est utilisé dans une commande.",
				},
				{ status: 400 },
			);
		}

		// 4️⃣ Vérifier si l'article est dans un panier
		const linkedCartItems = await prisma.cartItem.findFirst({
			where: {
				articleId: id, // Vérifie si l'article est présent dans un panier
			},
		});

		if (linkedCartItems) {
			return NextResponse.json(
				{
					message:
						"Impossible de supprimer l'article : Il est présent dans un panier.",
				},
				{ status: 400 },
			);
		}

		// Suppression de l'article
		await prisma.article.delete({
			where: { id },
		});

		return NextResponse.json(
			{ message: 'Article supprimé avec succès' },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Erreur lors de la suppression de l'article:", error);

		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === 'P2025') {
				return NextResponse.json(
					{ message: 'Article introuvable' },
					{ status: 404 },
				);
			}
			return NextResponse.json(
				{ message: 'Erreur de base de données' },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{ message: 'Erreur serveur lors de la suppression.' },
			{ status: 500 },
		);
	}
}
