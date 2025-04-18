import { CartItem } from '@/types/cart';
import { create } from 'zustand';
import { ArticleGetDto } from '@/types/article';
import { getSession } from 'next-auth/react';

type CartMergeOption = 'merge' | 'keep-db' | 'keep-local';

type CartStore = {
	cartItems: CartItem[];
	isLoading: boolean;
	error: string | null;
	totalCartItems: number;
	totalPrice: number;
	showMergePopup: boolean;

	setShowMergePopup: (show: boolean) => void;
	fetchCartItems: () => Promise<void>;
	addCartItem: (newItem: ArticleGetDto) => Promise<void>;
	removeFromCart: (item: ArticleGetDto) => Promise<void>;
	updateQuantity: (item: ArticleGetDto, quantity: number) => Promise<void>;
	handleMergeOption: (option: CartMergeOption) => void;
	clearCart: () => Promise<void>;
};

// Utilities
const getLocalCart = (): CartItem[] => {
	if (typeof window === 'undefined') return [];
	return JSON.parse(localStorage.getItem('cart') || '[]');
};

const syncCartToLocalStorage = (cartItems: CartItem[]) => {
	localStorage.setItem('cart', JSON.stringify(cartItems));
};

const calculateTotals = (cartItems: CartItem[]) => {
	const totalCartItems = cartItems.reduce((sum, item) => sum + 1, 0);
	const totalPrice = cartItems.reduce(
		(sum, item) => sum + item.article.price * item.quantity,
		0,
	);
	return { totalCartItems, totalPrice };
};

export const useCartStore = create<CartStore>((set, get) => ({
	cartItems: [],
	isLoading: false,
	error: null,
	totalCartItems: 0,
	totalPrice: 0,
	showMergePopup: false,

	setShowMergePopup: show => set({ showMergePopup: show }),

	fetchCartItems: async () => {
		let cartItems: CartItem[] = [];
		const session = await getSession();

		if (session) {
			try {
				const response = await fetch(`/api/carts/${session.user?.id}`);
				if (!response.ok)
					throw new Error('Failed to fetch cart items from API');
				cartItems = await response.json();
			} catch (error) {
				console.error('Error fetching cart items:', error);
			}
		} else {
			cartItems = getLocalCart();
		}

		const { totalCartItems, totalPrice } = calculateTotals(cartItems);
		set({ cartItems, totalCartItems, totalPrice });
	},

	addCartItem: async newItem => {
		const session = await getSession();
		const { cartItems, updateQuantity } = get();

		// Vérifie si l'article est déjà dans le panier
		const existingItem = cartItems.find(
			item => item.article.id === newItem.id,
		);

		if (existingItem) {
			// 🔁 L'article est déjà là → on incrémente la quantité
			await updateQuantity(newItem, existingItem.quantity + 1);
			return;
		}

		if (session) {
			try {
				const response = await fetch('/api/cart', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ articleId: newItem.id, quantity: 1 }),
				});
				if (!response.ok) throw new Error('Failed to add item to cart');
				await get().fetchCartItems(); // Rafraîchit le panier
			} catch (error) {
				console.error('Error adding to cart:', error);
			}
		} else {
			const localCart = getLocalCart();
			localCart.push({ article: newItem, quantity: 1 });
			syncCartToLocalStorage(localCart);
		}
		await get().fetchCartItems();
	},

	updateQuantity: async (item, quantity) => {
		const session = await getSession();

		if (quantity <= 0) {
			await get().removeFromCart(item);
			return;
		}

		if (session) {
			try {
				const response = await fetch('/api/carts', {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ articleId: item.id, quantity }),
				});
				if (!response.ok) throw new Error('Failed to update item quantity');
				await get().fetchCartItems();
			} catch (error) {
				console.error('Error updating cart item:', error);
			}
		} else {
			const updatedCart = getLocalCart().map(cartItem => {
				if (cartItem.article.id === item.id) {
					return { ...cartItem, quantity };
				}
				return cartItem;
			});

			syncCartToLocalStorage(updatedCart);
		}
		await get().fetchCartItems();
	},

	removeFromCart: async item => {
		const session = await getSession();

		if (session) {
			try {
				const response = await fetch(`/api/cart/${item.id}`, {
					method: 'DELETE',
				});
				if (!response.ok)
					throw new Error('Failed to remove item from cart');
				await get().fetchCartItems();
			} catch (error) {
				console.error('Error removing from cart:', error);
			}
		} else {
			const updatedCart = getLocalCart().filter(
				cartItem => cartItem.article.id !== item.id,
			);
			syncCartToLocalStorage(updatedCart);
		}
		await get().fetchCartItems();
	},

	handleMergeOption: async option => {
		console.log(`Handling merge option: ${option}`);
		// TODO: implement merge logic
		set({ showMergePopup: false });
	},

	clearCart: async () => {
		const session = await getSession();

		if (session) {
			try {
				const response = await fetch(`/api/carts/${session.user?.id}`, {
					method: 'DELETE',
				});
				if (!response.ok) throw new Error('Failed to clear cart');
				await get().fetchCartItems();
			} catch (error) {
				console.error('Error clearing cart:', error);
			}
		} else {
			localStorage.removeItem('cart');
		}
		await get().fetchCartItems();
	},
}));
