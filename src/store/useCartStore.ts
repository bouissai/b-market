import { CartGetDto, CartItem } from '@/types/cart';
import { create } from 'zustand';
import { ArticleGetDto } from '@/types/article';
import { getSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';

export type CartMergeOption = 'merge' | 'db' | 'local';

type CartStore = {
	cartItems: CartItem[];
	localCart: CartItem[];
	remoteCart: CartItem[];
	isLoading: boolean;
	error: string | null;
	totalCartItems: number;
	totalPrice: number;
	showMergePopup: boolean;

	setShowMergePopup: (show: boolean) => void;
	fetchCartItems: () => Promise<void>;
	addCartItem: (newItem: Partial<ArticleGetDto>) => Promise<void>;
	removeFromCart: (item: Partial<ArticleGetDto>) => Promise<void>;
	updateQuantity: (
		item: Partial<ArticleGetDto>,
		quantity: number,
	) => Promise<void>;
	handleMergeOption: (option: CartMergeOption, mergedCart: CartItem[]) => void;
	clearCart: () => Promise<void>;
};

export const useCartStore = create<CartStore>((set, get) => ({
	cartItems: [],
	localCart: [],
	remoteCart: [],
	isLoading: false,
	error: null,
	totalCartItems: 0,
	totalPrice: 0,
	showMergePopup: false,

	setShowMergePopup: show => set({ showMergePopup: show }),

	fetchCartItems: async () => {
		const setStoreState = set;
		const session = await getSession();

		// Chargement du panier local une seule fois
		const localCart = getLocalCart();

		if (session) {
			const response = await fetch(`/api/carts/${session.user?.id}`);
			const remoteCart: CartGetDto = await response.json();

			switch (response.status) {
				case 401:
					toast({
						title: 'Accès non autorisé',
						description: 'Accès non autorisé pour cet utilisateur',
						variant: 'destructive',
					});
					return;
				case 404:
					toast({
						title: 'Panier introuvable',
						description: 'Panier introuvable pour cet utilisateur',
						variant: 'destructive',
					});
					return;
				case 500:
					toast({
						title: 'Erreur serveur',
						description:
							'Erreur serveur lors de la récupération du panier',
						variant: 'destructive',
					});
					return;
			}

			// Vérification et gestion des conflits
			const conflictDetected = resolveCartConflict(
				localCart,
				remoteCart.cartItems,
				setStoreState,
			);

			if (conflictDetected) {
				return; // Gestion des conflits terminée
			}

			// Aucun conflit détecté, mise à jour avec le panier distant
			const { totalCartItems, totalPrice } = calculateTotals(
				remoteCart.cartItems,
			);
			setStoreState({
				cartItems: remoteCart.cartItems,
				totalCartItems,
				totalPrice,
				localCart: [],
				remoteCart: [],
			});
		} else {
			// Aucun utilisateur connecté, utilisation du panier local
			const { totalCartItems, totalPrice } = calculateTotals(localCart);
			setStoreState({
				cartItems: localCart,
				totalCartItems,
				totalPrice,
				localCart: [],
				remoteCart: [],
			});
		}
	},

	addCartItem: async newItem => {
		const { cartItems, updateQuantity } = get();

		// Vérifie si l'article est déjà dans le panier
		const existingItem = cartItems.find(
			item => item.article.id === newItem.id,
		);

		if (existingItem) {
			// 🔁 L'article est déjà là → on incrémente la quantité
			await updateQuantity(newItem, existingItem.quantity + 1);
			return;
		} else {
			await updateQuantity(newItem, 1);
			return;
		}
	},

	updateQuantity: async (item, quantity) => {
		if (quantity <= 0) {
			await get().removeFromCart(item);
			return;
		}

		const session = await getSession();

		if (session) {
			const response = await fetch('/api/carts/items', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					articleId: item.id,
					quantity,
					userId: session.user?.id,
				}),
			});
			if (!response.ok) {
				const errorMessages = {
					400: 'Quantité invalide ou article introuvable',
					403: 'Action pas autorisée pour cet utilisateur',
					500: 'Erreur serveur lors de la mise à jour du panier',
				};
				toast({
					title: 'Erreur',
					description:
						errorMessages[
							response.status as keyof typeof errorMessages
						] || 'Erreur inconnue',
					variant: 'destructive',
				});
				return;
			}

			//TODO : enlever le toast et mettre autre chose (anim..)
			toast({
				title: 'Article mis à jour',
				description:
					"La quantité de l'article a été mise à jour avec succès",
			});
		} else {
			// Mise à jour côté local
			const localCart = getLocalCart();
			let itemFound = false;

			const updatedCart = localCart.map(cartItem => {
				if (cartItem.article.id === item.id) {
					itemFound = true;
					return { ...cartItem, quantity }; // Met à jour la quantité
				}
				return cartItem; // Garde les autres articles inchangés
			});

			if (!itemFound) {
				// Ajoute l'article à la fin si non trouvé
				updatedCart.push({
					article: item,
					quantity,
				});
			}

			syncCartToLocalStorage(updatedCart);
		}
		await get().fetchCartItems();
	},

	removeFromCart: async item => {
		const session = await getSession();

		if (session) {
			const response = await fetch(`/api/carts/items`, {
				method: 'DELETE',
				body: JSON.stringify({
					articleId: item.id,
					userId: session.user?.id,
				}),
			});
			switch (response.status) {
				case 200:
					toast({
						title: 'Article supprimé',
						description: 'Article supprimé du panier avec succès',
					});
					break;
				case 400:
					toast({
						title: 'Erreur lors de la suppression',
						description: 'Article introuvable ou erreur de session',
						variant: 'destructive',
					});
					break;
				case 403:
					toast({
						title: 'Erreur de session',
						description: 'Action pas autorisée pour cet utilisateur',
						variant: 'destructive',
					});
					break;
				case 500:
					toast({
						title: 'Erreur serveur',
						description:
							"Une erreur est survenue lors de la suppression de l'article",
						variant: 'destructive',
					});
					break;
				default:
					break;
			}
		} else {
			const updatedCart = getLocalCart().filter(
				cartItem => cartItem.article.id !== item.id,
			);
			syncCartToLocalStorage(updatedCart);
		}
		await get().fetchCartItems();
	},

	clearCart: async () => {
		const session = await getSession();

		if (session) {
			const response = await fetch(`/api/carts`, {
				method: 'DELETE',
				body: JSON.stringify({
					userId: session.user?.id,
				}),
			});

			switch (response.status) {
				case 200:
					toast({
						title: 'Panier vidé',
						description: 'Le panier a été vidé avec succès',
					});
					break;
				case 400:
					toast({
						title: 'Erreur lors de la suppression',
						description: 'Panier introuvable',
						variant: 'destructive',
					});
					break;
				case 403:
					toast({
						title: 'Erreur de session',
						description: 'Action pas autorisée pour cet utilisateur',
						variant: 'destructive',
					});
					break;
				case 500:
					toast({
						title: 'Erreur serveur',
						description:
							'Une erreur est survenue lors de la suppression du panier',
						variant: 'destructive',
					});
					break;
				default:
					break;
			}
		} else {
			localStorage.removeItem('cart');
		}
		await get().fetchCartItems();
	},

	handleMergeOption: async (
		option: CartMergeOption,
		mergedCarts: CartItem[],
	) => {
		switch (option) {
			case 'merge':
				try {
					await overwriteRemoteCart(mergedCarts);
				} catch (error: any) {
					toast({
						title: 'Erreur lors de la mise à jour du panier',
						description: error.message,
						variant: 'destructive',
					});
				}
				break;
			case 'db':
				set({ cartItems: get().remoteCart });
				break;
			case 'local':
				try {
					await overwriteRemoteCart(getLocalCart());
				} catch (error: any) {
					toast({
						title: 'Erreur lors de la mise à jour du panier',
						description: error.message,
						variant: 'destructive',
					});
				}
				break;
			default:
				break;
		}
		localStorage.removeItem('cart');
		await get().fetchCartItems();
		set({ showMergePopup: false });
	},
}));

// Utilities
const getLocalCart = (): CartItem[] => {
	if (typeof window === 'undefined') return [];
	return JSON.parse(localStorage.getItem('cart') || '[]');
};

const syncCartToLocalStorage = (cartItems: CartItem[]) => {
	localStorage.setItem('cart', JSON.stringify(cartItems));
};

const calculateTotals = (cartItems: CartItem[]) => {
	const totalCartItems = cartItems.reduce((sum, _) => sum + 1, 0);
	const totalPrice = cartItems.reduce(
		(sum, item) => sum + (item.article.price ?? 0) * item.quantity,
		0,
	);
	return { totalCartItems, totalPrice };
};

// services/cartService.ts - Ajouter cette fonction
export const resolveCartConflict = (
	localCart: CartItem[],
	remoteCart: CartItem[],
	setStoreState: (state: any) => void,
): boolean => {
	if (localCart.length > 0 && remoteCart.length > 0) {
		setStoreState({
			showMergePopup: true,
			localCart,
			remoteCart,
		});
		return true; // Conflit détecté
	}
	return false; // Pas de conflit
};

const overwriteRemoteCart = async (newCartItems: CartItem[]): Promise<void> => {
	//TODO: resoudre le pb d'ordre des articles qui bug quand on les remplace
	const session = await getSession();

	if (!session) {
		console.error(
			"Utilisateur non connecté. Impossible d'écraser le panier.",
		);
		toast({
			title: 'Erreur lors du remplacement du panier connecté',
			description: 'Connectez-vous pour écraser le panier.',
			variant: 'destructive',
		});
		return;
	}

	const response = await fetch(`/api/carts/replace`, {
		method: 'PATCH',
		body: JSON.stringify({
			userId: session.user?.id,
			cartItems: newCartItems,
		}),
	});

	if (!response.ok) {
		throw { message: response.statusText, status: response.status };
	}

	toast({
		title: 'Panier mis à jour',
		description: 'Le panier a été mis à jour avec succès',
	});
};
