import { Cart } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CartGetDto } from '@/types/cart';

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

export async function addOrUpdateCartItem(
	userId: string,
	articleId: string,
	quantity: number,
): Promise<Cart> {
	try {
		const cart = await getOrCreateCart(userId);
		const item = await getCartItem(cart.id, articleId);

		if (item) {
			return await updateCartItemQuantity(cart.id, item.id, quantity);
		} else {
			return await addCartItemToCart(cart.id, articleId, quantity);
		}
	} catch (error) {
		throw new Error("Erreur lors de la modification d'un panier");
	}
}

async function getOrCreateCart(userId: string): Promise<Cart> {
	const existingCart = await prisma.cart.findUnique({
		where: { userId },
	});
	if (existingCart) return existingCart;

	return await prisma.cart.create({
		data: {
			userId,
			cartItems: {
				create: [],
			},
		},
	});
}

async function getCartItem(cartId: string, articleId: string) {
	return await prisma.cartItem.findUnique({
		where: {
			cartId_articleId: {
				cartId,
				articleId,
			},
		},
	});
}

async function updateCartItemQuantity(
	cartId: string,
	itemId: string,
	quantity: number,
) {
	return await prisma.cart.update({
		where: { id: cartId },
		data: {
			cartItems: {
				update: {
					where: { id: itemId },
					data: { quantity },
				},
			},
		},
	});
}

async function addCartItemToCart(
	cartId: string,
	articleId: string,
	quantity: number,
) {
	return await prisma.cart.update({
		where: { id: cartId },
		data: {
			cartItems: {
				create: { articleId, quantity },
			},
		},
	});
}
