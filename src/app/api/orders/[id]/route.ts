import { prisma } from '@/lib/prisma';
import { getOrderById } from '@/services/orderService'; // Assurez-vous d'importer correctement votre service
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guards';

// 🔴 DELETE → Supprimer une commande avec ses `OrderItems`
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const adminCheck = await requireAdmin();
	if (adminCheck instanceof NextResponse) {
		return adminCheck;
	}

	try {
		const id = (await params).id;
		const numericId = Number(id);

		if (isNaN(numericId)) {
			return NextResponse.json(
				{ message: "L'ID de la commande est invalide" },
				{ status: 400 },
			);
		}

		const OrderItemsDeleted = prisma.orderItem.deleteMany({
			where: {
				orderId: numericId, // Utilisation du nombre
			},
		});

		const orderDeleted = prisma.order.delete({
			where: { id: numericId }, // Utilisation du nombre
		});

		await prisma.$transaction([OrderItemsDeleted, orderDeleted]);

		return NextResponse.json(
			{ message: 'Commande supprimée avec succès' },
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			'❌ [DELETE] Erreur lors de la suppression de la commande :',
			error,
		);
		return NextResponse.json(
			{ message: 'Erreur serveur lors de la suppression' },
			{ status: 500 },
		);
	}
}

// 🔵 GET → Récupérer une commande avec ses `OrderItems`
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const adminCheck = await requireAdmin();
	if (adminCheck instanceof NextResponse) {
		return adminCheck;
	}

	try {
		const id = (await params).id;
		const numericId = Number(id);

		if (isNaN(numericId)) {
			return NextResponse.json(
				{ message: "L'ID de la commande est invalide" },
				{ status: 400 },
			);
		}

		const order = await getOrderById(numericId);
		if (!order) {
			return NextResponse.json(
				{ message: 'Commande introuvable' },
				{ status: 404 },
			);
		}

		return NextResponse.json(order, { status: 200 });
	} catch (error) {
		console.error(
			'❌ [GET] Erreur lors de la récupération de la commande :',
			error,
		);
		return NextResponse.json(
			{ message: 'Erreur serveur lors de la récupération' },
			{ status: 500 },
		);
	}
}
export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const adminCheck = await requireAdmin();
	if (adminCheck instanceof NextResponse) {
		return adminCheck;
	}

	try {
		const { id } = await params;
		const numericId = Number(id);

		if (isNaN(numericId)) {
			return NextResponse.json(
				{ message: "L'ID de la commande est invalide" },
				{ status: 400 },
			);
		}

		let body;
		try {
			body = await req.json();
			if (!body || typeof body !== 'object') {
				return NextResponse.json(
					{ message: 'Le corps de la requête est invalide' },
					{ status: 400 },
				);
			}
		} catch {
			return NextResponse.json(
				{ message: 'JSON du body invalide ou vide' },
				{ status: 400 },
			);
		}

		const { status, note, updates = [] } = body;

		const existingOrder = await prisma.order.findUnique({
			where: { id: numericId },
		});

		if (!existingOrder) {
			return NextResponse.json(
				{ message: 'Commande introuvable' },
				{ status: 404 },
			);
		}

		for (const update of updates) {
			const { action, articleId: orderItemId, quantity } = update;

			if (!orderItemId) {
				return NextResponse.json(
					{ message: `articleId manquant dans une des actions` },
					{ status: 400 },
				);
			}

			if (action === 'add') {
				if (quantity == null) {
					return NextResponse.json(
						{
							message: `Champs manquants pour 'add' (nécessite 'quantity')`,
						},
						{ status: 400 },
					);
				}
			} else if (action === 'update') {
				if (quantity == null) {
					return NextResponse.json(
						{
							message: `Champs manquants pour 'update' (nécessite 'quantity')`,
						},
						{ status: 400 },
					);
				}
			}

			try {
				if (action === 'update' || action === 'delete') {
					const orderItem = await prisma.orderItem.findUnique({
						where: { id: orderItemId },
					});

					if (!orderItem) {
						return NextResponse.json(
							{
								message: `Aucun OrderItem trouvé avec l'ID ${orderItemId}`,
							},
							{ status: 404 },
						);
					}

					if (action === 'update') {
						await prisma.orderItem.update({
							where: { id: orderItemId },
							data: { quantity },
						});
					} else if (action === 'delete') {
						await prisma.orderItem.delete({
							where: { id: orderItemId },
						});
					}
				} else if (action === 'add') {
					const article = await prisma.article.findUnique({
						where: { id: orderItemId },
					});

					if (!article) {
						return NextResponse.json(
							{ message: `Article introuvable : ${orderItemId}` },
							{ status: 404 },
						);
					}

					await prisma.orderItem.upsert({
						where: {
							orderId_articleId: {
								orderId: numericId,
								articleId: orderItemId,
							},
						},
						update: {
							quantity: {
								increment: quantity,
							},
						},
						create: {
							orderId: numericId,
							articleId: orderItemId,
							quantity,
							price: article.price,
						},
					});
				}
			} catch (itemError) {
				console.error(`❌ Erreur avec l'item ${orderItemId} :`, itemError);
				return NextResponse.json(
					{
						message: `Erreur lors de l'action '${action}' sur l'élément ${orderItemId}`,
						detail:
							itemError instanceof Error ? itemError.message : itemError,
					},
					{ status: 400 },
				);
			}
		}

		const orderItems = await prisma.orderItem.findMany({
			where: { orderId: numericId },
			select: { price: true, quantity: true },
		});

		const newTotal = orderItems.reduce((sum: number, item: { price: number; quantity: number }) => {
			return sum + item.price * item.quantity;
		}, 0);

		const updatedOrder = await prisma.order.update({
			where: { id: numericId },
			data: {
				status,
				note,
				total: newTotal,
				updatedAt: new Date(),
			},
		});

		return NextResponse.json(updatedOrder, { status: 200 });
	} catch (error) {
		console.error('❌ [PATCH] Erreur générale :', error);
		return NextResponse.json(
			{ message: 'Erreur serveur lors de la mise à jour' },
			{ status: 500 },
		);
	}
}
