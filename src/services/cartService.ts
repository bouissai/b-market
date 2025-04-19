import { Cart } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CartGetDto } from '@/types/cart';

export async function updateCart(
	userId: string,
	articleId: string,
	quantity: number,
): Promise<Cart> {
	try {
		// Check if the cart already exists for the user
		const existingCart = await prisma.cart.findUnique({
			where: { userId },
		});

		if (!existingCart) {
			// If the cart doesn't exist, create a new one
			return await prisma.cart.create({
				data: {
					userId,
					cartItems: {
						create: { articleId, quantity },
					},
				},
			});
		}

		// If the cart exists, update it
		return await prisma.cart.update({
			where: { userId },
			data: { cartItems: { create: { articleId, quantity } } },
		});
	} catch (error) {
		throw new Error("Erreur lors de la modification d'un panier");
	}
}

export async function getCartByUserId(
	userId: string,
): Promise<CartGetDto | null> {
	try {
		const cartClient = await prisma.cart.findUnique({
			where: { userId },
			include: {
				cartItems: {
					include: {
						article: {
							select: {
								id: true,
								name: true,
								price: true,
								image: true,
								unit: true,
							},
						},
					},
				},
			},
		});

		if (!cartClient) {
			return null;
		}

		return {
			id: cartClient.id,
			userId: cartClient.userId,
			cartItems: cartClient.cartItems.map(cartItem => ({
				article: {
					id: cartItem.article.id,
					name: cartItem.article.name,
					price: cartItem.article.price,
					image: cartItem.article.image,
					unit: cartItem.article.unit,
				},
				quantity: cartItem.quantity,
			})),
		};
	} catch (error) {
		console.error(
			`[getCartByUserId] Erreur lors de la récupération du panier avec user ID ${userId}`,
			error,
		);
		throw new Error('Impossible de récupérer le panier.');
	}
}
