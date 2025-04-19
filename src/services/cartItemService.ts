import { Cart } from '@prisma/client';
import { prisma } from '@/lib/prisma';

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

export async function removeCartItemByUserId(
	userId: string,
	articleId: string,
): Promise<Cart | null> {
	try {
		const cart = await getOrCreateCart(userId);
		const item = await getCartItem(cart.id, articleId);

		if (!item) return null;

		return await prisma.cart.update({
			where: { id: cart.id },
			data: {
				cartItems: {
					delete: { id: item.id },
				},
			},
		});
	} catch (error) {
		throw new Error("Erreur lors de la suppression de l'article du panier");
	}
}
