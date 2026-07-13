import { auth } from '@/lib/auth';
import { bulkCartItemsSchema } from '@/lib/validations/recipe';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import type { BulkCartResult } from '@/types/recipe';

export async function POST(req: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json(
				{ message: 'Authentification requise' },
				{ status: 401 },
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

		const parsed = bulkCartItemsSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					message: 'Données invalides',
					errors: parsed.error.format(),
				},
				{ status: 400 },
			);
		}

		const grouped = new Map<string, number>();
		for (const item of parsed.data.items) {
			const current = grouped.get(item.articleId) ?? 0;
			grouped.set(item.articleId, current + item.quantity);
		}

		const result: BulkCartResult = {
			added: [],
			skipped: [],
			errors: [],
		};

		const articleIds = [...grouped.keys()];
		const articles = await prisma.article.findMany({
			where: { id: { in: articleIds } },
			select: { id: true, name: true },
		});
		const articleMap = new Map(articles.map(a => [a.id, a]));

		for (const [articleId, quantity] of grouped) {
			const article = articleMap.get(articleId);
			if (!article) {
				result.errors.push({
					articleId,
					reason: 'Article introuvable',
				});
				continue;
			}

			if (quantity > 99) {
				result.errors.push({
					articleId,
					reason: 'Quantité maximale dépassée (99)',
				});
				continue;
			}

			try {
				await prisma.$transaction(async tx => {
					let cart = await tx.cart.findUnique({
						where: { userId: session.user!.id },
					});

					if (!cart) {
						cart = await tx.cart.create({
							data: { userId: session.user!.id },
						});
					}

					const existing = await tx.cartItem.findUnique({
						where: {
							cartId_articleId: {
								cartId: cart.id,
								articleId,
							},
						},
					});

					const newQuantity = (existing?.quantity ?? 0) + quantity;
					if (newQuantity > 99) {
						throw new Error('MAX_QUANTITY');
					}

					if (existing) {
						await tx.cartItem.update({
							where: { id: existing.id },
							data: { quantity: newQuantity },
						});
					} else {
						await tx.cartItem.create({
							data: {
								cartId: cart.id,
								articleId,
								quantity,
							},
						});
					}
				});

				result.added.push({
					articleId,
					name: article.name,
					quantity,
				});
			} catch (error) {
				if (error instanceof Error && error.message === 'MAX_QUANTITY') {
					result.errors.push({
						articleId,
						reason: 'Quantité maximale du panier dépassée (99)',
					});
				} else {
					result.errors.push({
						articleId,
						reason: 'Erreur lors de l\'ajout au panier',
					});
				}
			}
		}

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error('[POST /api/carts/items/bulk] Erreur:', error);
		return NextResponse.json(
			{ message: 'Erreur serveur lors de l\'ajout au panier' },
			{ status: 500 },
		);
	}
}
