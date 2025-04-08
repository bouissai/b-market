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

const getLocalCartAndItem = (
	itemId: string,
): { localCart: CartItem[]; exists: boolean; item?: CartItem } => {
	const localCart: CartItem[] = JSON.parse(
		localStorage.getItem('cart') || '[]',
	);
	const item = localCart.find(
		(cartItem: CartItem) => cartItem.article.id === itemId,
	);
	return { localCart, exists: !!item, item };
};

export const useCartStore = create<CartStore>((set, get) => ({
	cartItems: [],
	isLoading: false,
	error: null,
	totalCartItems: 0,
	totalPrice: 0,

	fetchCartItems: async () => {
		const session = await getSession();
		if (session) {
			console.log('User is logged in, fetching cart items from API...');
		} else {
			const localCart: CartItem[] = JSON.parse(
				localStorage.getItem('cart') || '[]',
			);
			set({
				cartItems: localCart,
				totalCartItems: localCart.reduce(
					(sum, item) => sum + item.quantity,
					0,
				),
				totalPrice: localCart.reduce(
					(sum, item) => sum + item.article.price * item.quantity,
					0,
				),
			});
		}
	},

	addCartItem: async (newItem: ArticleGetDto) => {
		const session = await getSession();
		if (session) {
			console.log('User is logged in, adding item to API cart...');
		} else {
			const { localCart, exists, item } = getLocalCartAndItem(newItem.id);
			if (exists && item) {
				item.quantity += 1;
			} else {
				localCart.push({ article: newItem, quantity: 1 });
			}
			localStorage.setItem('cart', JSON.stringify(localCart));
			set({
				cartItems: localCart,
				totalCartItems: localCart.reduce(sum => sum + 1, 0),
				totalPrice: localCart.reduce(
					(sum, item) => sum + item.article.price * item.quantity,
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
		} else {
			const {
				localCart,
				exists,
				item: existingItem,
			} = getLocalCartAndItem(item.id);
			if (exists && existingItem) {
				localCart.splice(localCart.indexOf(existingItem), 1);
			}
			localStorage.setItem('cart', JSON.stringify(localCart));
			set({
				cartItems: localCart,
				totalCartItems: localCart.reduce(sum => sum + 1, 0),
				totalPrice: localCart.reduce(
					(sum, item) => sum + item.article.price * item.quantity,
					0,
				),
			});
		}
	},

	updateQuantity: async (item: ArticleGetDto, quantity: number) => {
		console.log('Updating item quantity in cart...');
		const session = await getSession();
		let totalCartItems = get().totalCartItems;

		if (session) {
			console.log(
				'User is logged in, updating item quantity in API cart...',
			);
		} else {
			const {
				localCart,
				exists,
				item: existingItem,
			} = getLocalCartAndItem(item.id);
			if (exists && existingItem) {
				if (quantity <= 0) {
					localCart.splice(localCart.indexOf(existingItem), 1);
					totalCartItems--;
				} else {
					existingItem.quantity = quantity;
				}
				localStorage.setItem('cart', JSON.stringify(localCart));
				set({
					cartItems: localCart,
					totalCartItems: totalCartItems,
					totalPrice: localCart.reduce(
						(sum, item) => sum + item.article.price * item.quantity,
						0,
					),
				});
			}
		}
	},

	clearCart: async () => {
		console.log('Clearing cart...');
	},
}));
