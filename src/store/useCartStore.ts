import { CartItem } from '@/types/cart';
import { create } from 'zustand';

type CartStore = {
	cartItems: CartItem[];
	isLoading: boolean;
	error: string | null;
	totalCartItems: number;
	fetchCartItems: () => Promise<void>;
	addCartItem: (newItem: CartItem) => Promise<void>;
	removeCartItem: (itemId: string) => Promise<void>;
	updateQuantity: (itemId: string, quantity: number) => Promise<void>;
	clearCart: () => Promise<void>;
};

export const useCartStore = create<CartStore>((set, get) => ({
	cartItems: [],
	isLoading: false,
	error: null,
	totalCartItems: 0,

	// Fetch cart items from the API
	fetchCartItems: async () => {
		console.log('Fetching cart items...');

		// set({ isLoading: true, error: null });

		// try {
		// 	const response = await fetch('/api/cart');

		// 	if (!response.ok) throw new Error('Failed to fetch cart items');

		// 	const data = await response.json();

		// 	set({
		// 		cartItems: data.cartItems,
		// 		totalCartItems: data.total,
		// 		isLoading: false,
		// 	});
		// } catch (error) {
		// 	set({
		// 		error: error instanceof Error ? error.message : 'An error occurred',
		// 		isLoading: false,
		// 	});
		// }
	},

	addCartItem: async (newItem: CartItem) => {
		console.log('Adding item to cart...');
		// set({ isLoading: true, error: null });

		// try {
		//     const response = await fetch('/api/cart', {
		//         method: 'POST',
		//         headers: {
		//             'Content-Type': 'application/json',
		//         },
		//         body: JSON.stringify(newItem),
		//     });

		//     if (!response.ok) throw new Error('Failed to add item to cart');

		//     const data = await response.json();

		//     set({
		//         cartItems: [...get().cartItems, data.cartItem],
		//         totalCartItems: get().totalCartItems + 1,
		//         isLoading: false,
		//     });
		// } catch (error) {
		//     set({
		//         error: error instanceof Error ? error.message : 'An error occurred',
		//         isLoading: false,
		//     });
		// }
	},

	removeCartItem: async (itemId: string) => {
		console.log('Deleting item from cart...');
		// set({ isLoading: true, error: null });

		// try {
		//     const response = await fetch(`/api/cart/${itemId}`, {
		//         method: 'DELETE',
		//     });

		//     if (!response.ok) throw new Error('Failed to delete item from cart');

		//     set({
		//         cartItems: get().cartItems.filter(item => item.id !== itemId),
		//         totalCartItems: get().totalCartItems - 1,
		//         isLoading: false,
		//     });
		// } catch (error) {
		//     set({
		//         error: error instanceof Error ? error.message : 'An error occurred',
		//         isLoading: false,
		//     });
		// }
	},

	updateQuantity: async (itemId: string, quantity: number) => {
		console.log('Updating item quantity in cart...');
		// set({ isLoading: true, error: null });
	},

	clearCart: async () => {
		console.log('Clearing cart...');
		// set({ isLoading: true, error: null });

		// try {
		//     const response = await fetch('/api/cart/clear', {
		//         method: 'DELETE',
		//     });

		//     if (!response.ok) throw new Error('Failed to clear cart');

		//     set({
		//         cartItems: [],
		//         totalCartItems: 0,
		//         isLoading: false,
		//     });
		// } catch (error) {
		//     set({
		//         error: error instanceof Error ? error.message : 'An error occurred',
		//         isLoading: false,
		//     });
		// }
	},
}));
