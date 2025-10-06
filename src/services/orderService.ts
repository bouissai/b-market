import { prisma } from '@/lib/prisma';
import { OrderDetailsDTO, orderDTO, OrderStatus } from '@/types/order';

// Récupérer toutes les commandes et les formatter en `ordersDTO`
export async function getAllOrders(): Promise<orderDTO[]> {
	try {
		const orders = await prisma.order.findMany({
			include: {
				items: true,
				user: true,
			},
		});

		return orders.map(order => {
			return {
				id: order.id,
				customerName: order.user.firstname + ' ' + order.user.lastname,
				total: order.total,
				nbArticles: order.items.length,
				status: order.status as keyof typeof OrderStatus,
			};
		});
	} catch {
		throw new Error('Impossible de récupérer les commandes.');
	}
}

// Récupérer une commande par ID et retourner un `OrderDetailsDTO`
export async function getOrderById(
	id: number,
): Promise<OrderDetailsDTO | null> {
	try {
		const order = await prisma.order.findUnique({
			where: { id },
			include: {
				items: {
					include: {
						article: true,
					},
				},
				user: true,
				promoCode: true,
			},
		});

		if (!order) {
			return null;
		}

		return {
			id: order.id,
			userId: order.userId,
			customerName: order.firstname + ' ' + order.lastname,
			customerEmail: order.email,
			customerPhone: order.phone ?? 'Non renseigné', // Utiliser le champ phone du modèle
			date: order.createdAt,
			total: order.total,
			status: (order.status as keyof typeof OrderStatus) || '',
			note: order.note,
			promoDiscount: order.promoCode?.discount ?? null,
			items: order.items.map(item => ({
				id: item.id,
				image: item.article?.image,
				name: item.article?.name ?? 'Article inconnu',
				quantity: item.quantity,
				price: item.price,
			})),
		};
	} catch (error) {
		console.error(
			`❌ [getOrderById] Erreur lors de la récupération de la commande avec ID ${id}:`,
			error,
		);
		throw new Error('Impossible de récupérer la commande.');
	}
}

// Mise à jour du statut d'une commande
export async function updateOrderStatus(
	orderId: number,
	newStatus: 'pending' | 'awaiting_payment' | 'completed' | 'cancelled',
) {
	return prisma.order.update({
		where: { id: orderId },
		data: { status: newStatus },
	});
}

interface OrderItemInput {
	articleId: string;
	quantity: number;
	price: number;
}

// Création d'une commande avec formatage DTO
export async function createOrder(
	userId: string,
	status: keyof typeof OrderStatus,
	note: string,
	orderItems: OrderItemInput[],
	firstname: string,
	lastname: string,
	email: string,
	phone: string,
	total: number,
	promoCodeId: string | null,
): Promise<OrderDetailsDTO> {
	return await prisma.$transaction(async tx => {
		// 1. Créer la commande
		const newOrder = await tx.order.create({
			data: {
				userId,
				status,
				note,
				total,
				firstname,
				lastname,
				email,
				phone,
				promoCodeId,
				items: {
					create: orderItems.map(item => ({
						articleId: item.articleId,
						quantity: item.quantity,
						price: item.price,
					})),
				},
			},
			include: {
				items: {
					include: {
						article: true,
					},
				},
				user: true,
				promoCode: true,
			},
		});

		return {
			id: newOrder.id,
			userId: newOrder.userId,
			customerName: newOrder.user.firstname + ' ' + newOrder.user.lastname,
			customerEmail: newOrder.user.email,
			customerPhone: newOrder.phone,
			date: newOrder.createdAt,
			total: newOrder.total,
			status: newOrder.status as keyof typeof OrderStatus,
			note: newOrder.note,
			promoDiscount: newOrder.promoCode?.discount ?? null,
			items: newOrder.items.map(item => ({
				id: item.id,
				name: item.article.name,
				quantity: item.quantity,
				price: item.price,
			})),
		};
	});
}

// Suppression d'une commande
export async function deleteOrder(id: number): Promise<void> {
	await prisma.order.delete({ where: { id } });
}

// Récupération des commandes d'un utilisateur

/**
 * 🔵 Récupérer toutes les commandes d'un utilisateur
 * @param userId - ID de l'utilisateur
 * @returns Liste des commandes de l'utilisateur ou une erreur
 */
export async function getOrdersByUserId(
	userId: string,
): Promise<OrderDetailsDTO[]> {
	try {
		if (!userId) {
			throw new Error("L'ID de l'utilisateur est requis.");
		}

		// Vérifier si l'utilisateur existe
		const userExists = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!userExists) {
			throw new Error(`Aucun utilisateur trouvé avec l'ID: ${userId}`);
		}

		// Récupérer les commandes

		const orders = await prisma.order.findMany({
			where: { userId },
			include: {
				items: {
					include: {
						article: true,
					},
				},
				promoCode: true,
			},
		});

		return orders.map(order => {
			return {
				id: order.id,
				userId: order.userId,
				customerName: order.firstname + ' ' + order.lastname,
				customerEmail: order.email,
				date: order.createdAt,
				note: order.note,
				promoDiscount: order.promoCode?.discount ?? null,
				total: order.total,
				nbArticles: order.items.length,
				status: order.status as keyof typeof OrderStatus,
				items: order.items.map(item => ({
					id: item.id,
					name: item.article.name,
					image: item.article.image ?? '/placeholder.svg',
					quantity: item.quantity,
					price: item.price,
				})),
			};
		});
	} catch (error) {
		console.error(
			`❌ [getOrdersByUserId] Erreur lors de la récupération des commandes pour l'utilisateur ${userId} :`,
			error,
		);

		throw new Error(
			"Impossible de récupérer les commandes. Vérifiez l'ID utilisateur et réessayez.",
		);
	}
}
