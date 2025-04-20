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
	handleMergeOption: (option: CartMergeOption) => void;
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
			});
		} else {
			// Aucun utilisateur connecté, utilisation du panier local
			const { totalCartItems, totalPrice } = calculateTotals(localCart);
			setStoreState({ cartItems: localCart, totalCartItems, totalPrice });
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
			console.log('Article non trouvé dans le panier, ajout en cours...');
			await updateQuantity(newItem, 1);
			return;
		}
	},

	updateQuantity: async (item, quantity) => {
		const session = await getSession();

		if (quantity <= 0) {
			await get().removeFromCart(item);
			return;
		}

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
			switch (response.status) {
				case 200:
					// TODO : remplacer toast par une animation
					toast({
						title: 'Article ajouté',
						description: 'Article ajouté au panier avec succès',
					});
					break;
				case 400:
					toast({
						title: "Erreur lors de l'ajout au panier",
						description: 'Quantité invalide ou article introuvable',
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
							'Une erreur est survenue lors de la mise à jour du panier',
						variant: 'destructive',
					});
					break;
				default:
					break;
			}
			await get().fetchCartItems();
		} else {
			// Traitement local (pas de session)
			const localCart = getLocalCart();

			// Trouver l'article dans le panier
			const existingItemIndex = localCart.findIndex(
				cartItem => cartItem.article.id === item.id,
			);

			if (existingItemIndex !== -1) {
				// Si l'article existe, mettre à jour sa quantité
				localCart[existingItemIndex].quantity = quantity;
			} else {
				// Si l'article n'existe pas, l'ajouter avec une quantité de 1
				localCart.push({
					article: item,
					quantity: 1,
				});
			}

			syncCartToLocalStorage(localCart);
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
			await get().fetchCartItems();
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

			await get().fetchCartItems();
		} else {
			localStorage.removeItem('cart');
		}
		await get().fetchCartItems();
	},

	handleMergeOption: async option => {
		console.log(`Handling merge option: ${option}`);
		switch (option) {
			case 'merge':
				//TODO : merge
				break;
			case 'db':
				set({ cartItems: get().remoteCart });
				break;
			case 'local':
				//TODO : finir
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
		console.log('modal merge popup');
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
