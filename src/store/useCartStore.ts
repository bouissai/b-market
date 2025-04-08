import { CartItem } from '@/types/cart';
import { create } from 'zustand';
import { ArticleGetDto } from '@/types/article';
import { getSession } from 'next-auth/react';

type CartStore = {
	cartItems: CartItem[];
	isLoading: boolean;
	error: string | null;
	totalCartItems: number;
	totalPrice: number;
	fetchCartItems: () => Promise<void>;
	addCartItem: (newItem: ArticleGetDto) => Promise<void>;
	removeFromCart: (item: ArticleGetDto) => Promise<void>;
	updateQuantity: (item: ArticleGetDto, quantity: number) => Promise<void>;
	clearCart: () => Promise<void>;
};

export const useCartStore = create<CartStore>((set, get) => ({
	cartItems: [],
	isLoading: false,
	error: null,
	totalCartItems: 0,
	totalPrice: 0,

	// Fetch cart items from the API
	fetchCartItems: async () => {
		const session = await getSession();
		if (session) {
			console.log('User is logged in, fetching cart items from API...');

			// Utilisateur connecté : récupérer les articles depuis l'API
			// try {
			// 	const response = await fetch('/api/cart');
			// 	if (!response.ok) throw new Error('Failed to fetch cart items');
			// 	const data = await response.json();
			// 	set({
			// 		cartItems: data,
			// 		totalCartItems: data.reduce((sum, item) => sum + item.quantity, 0),
			// 	});
			// } catch (error) {
			// 	console.error('Error fetching cart items:', error);
			// }
		} else {
			console.log(
				'User is NOT logged in, fetching cart items from localStorage...',
			);

			// Utilisateur non connecté : récupérer les articles depuis le localStorage
			const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
			set({
				cartItems: localCart,
				totalCartItems: localCart.reduce(
					(sum: number, item: CartItem) => sum + item.quantity,
					0,
				),
				totalPrice: localCart.reduce(
					(sum: number, item: CartItem) =>
						sum + item.article.price * item.quantity,
					0,
				),
			});
		}
	},

	addCartItem: async (newItem: ArticleGetDto) => {
		const session = await getSession();
		if (session) {
			console.log('User is logged in, adding item to API cart...');
			// Utilisateur connecté : ajouter à la base de données
			// try {
			// 	const response = await fetch('/api/cart', {
			// 		method: 'POST',
			// 		headers: {
			// 			'Content-Type': 'application/json',
			// 		},
			// 		body: JSON.stringify({ articleId: newItem.id }),
			// 	});
			// 	if (!response.ok) throw new Error('Failed to add item to cart');
			// 	await get().fetchCartItems(); // Rafraîchir le panier
			// } catch (error) {
			// 	console.error('Error adding item to cart:', error);
			// }
		} else {
			console.log(
				'User is NOT logged in, adding item to localStorage cart...',
			);
			// Utilisateur non connecté : ajouter au localStorage
			const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
			const existingItem = localCart.find(
				(item: CartItem) => item.article.id === newItem.id,
			);
			if (existingItem) {
				existingItem.quantity += 1;
			} else {
				localCart.push({ article: newItem, quantity: 1 });
			}
			localStorage.setItem('cart', JSON.stringify(localCart));
			set({
				cartItems: localCart,
				totalCartItems: localCart.reduce(
					(sum: number, item: CartItem) => sum + item.quantity,
					0,
				),
				totalPrice: localCart.reduce(
					(sum: number, item: CartItem) =>
						sum + item.article.price * item.quantity,
					0,
				),
			});
		}
	},

	removeFromCart: async (item: ArticleGetDto) => {
		console.log('Deleting item from cart...');

		const session = await getSession();
		if (session) {
			console.log('User is logged in, deleting item from API cart...');
			// Utilisateur connecté : supprimer de la base de données
		} else {
			console.log(
				'User is NOT logged in, deleting item from localStorage cart...',
			);
			// Utilisateur non connecté : supprimer du localStorage
			const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
			const existingItem = localCart.find(
				(cartItem: CartItem) => cartItem.article.id === item.id,
			);
			if (existingItem) {
				localCart.splice(localCart.indexOf(existingItem), 1);
			}
			localStorage.setItem('cart', JSON.stringify(localCart));
			set({
				cartItems: localCart,
				totalCartItems: localCart.reduce(
					(sum: number, item: CartItem) => sum + item.quantity,
					0,
				),
				totalPrice: localCart.reduce(
					(sum: number, item: CartItem) =>
						sum + item.article.price * item.quantity,
					0,
				),
			});
		}
	},

	updateQuantity: async (item: ArticleGetDto, quantity: number) => {
		console.log('Updating item quantity in cart...');

		const session = await getSession();
		if (session) {
			console.log(
				'User is logged in, updating item quantity in API cart...',
			);
			// Utilisateur connecté : mettre à jour la quantité dans la base de données
		} else {
			console.log(
				'User is NOT logged in, updating item quantity in localStorage cart...',
			);
			// Utilisateur non connecté : mettre à jour la quantité dans le localStorage
			const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
			const existingItem = localCart.find(
				(cartItem: CartItem) => cartItem.article.id === item.id,
			);
			if (existingItem) {
				if (quantity <= 0) {
					localCart.splice(localCart.indexOf(existingItem), 1);
				} else {
					existingItem.quantity = quantity;
				}
			}
			localStorage.setItem('cart', JSON.stringify(localCart));
			set({
				cartItems: localCart,
				totalCartItems: localCart.reduce(
					(sum: number, item: CartItem) => sum + item.quantity,
					0,
				),
				totalPrice: localCart.reduce(
					(sum: number, item: CartItem) =>
						sum + item.article.price * item.quantity,
					0,
				),
			});
		}
	},

	clearCart: async () => {
		console.log('Clearing cart...');
	},
}));
