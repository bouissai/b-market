import { toast } from '@/hooks/use-toast';
import { OrderDetailsDTO, orderDTO, OrderSaveDTO } from '@/types/order';
import { create } from 'zustand';

type OrderStore = {
	orders: orderDTO[];
	orderDetails: OrderDetailsDTO | null;
	isLoading: boolean;
	isSubmitting: boolean;
	error: string | null;
	fetchOrders: () => Promise<void>;
	fetchOrderDetails: (id: number) => Promise<void>;
	addOrder: (newOrder: orderDTO) => void;
	init: () => void;
	updateOrder: (updatedOrder: orderDTO) => void;
	saveOrder: (order: OrderSaveDTO) => Promise<orderDTO>;
	deleteOrder: (id: number) => Promise<boolean>;
	updateOrderDetails: (
		id: number,
		payload: {
			status?: string;
			note?: string;
			updates?: {
				action: 'add' | 'update' | 'delete';
				articleId: string;
				quantity?: number;
			}[];
		},
	) => Promise<boolean>;
};

export const useOrderStore = create<OrderStore>((set, get) => ({
	orders: [],
	orderDetails: null,
	isLoading: true,
	isSubmitting: false,
	error: null,

	fetchOrders: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await fetch('/api/orders');
			if (!response.ok)
				throw new Error('Erreur lors du chargement des commandes');
			const data = await response.json();
			set({ orders: data, isLoading: false });
		} catch (err) {
			set({
				error:
					err instanceof Error ? err.message : 'Une erreur est survenue',
				isLoading: false,
			});
		}
	},

	init: async () => {
		if (get().orders.length === 0) {
			// ✅ Évite de refetch si déjà chargé
			await get().fetchOrders();
		}
	},

	fetchOrderDetails: async id => {
		set({ isLoading: true, error: null });
		try {
			const response = await fetch(`/api/orders/${id}`);
			if (!response.ok)
				throw new Error('Erreur lors de la récupération de la commande');
			const data = await response.json();
			set({ orderDetails: data, isLoading: false }); // 🔥 Mise à jour globale du store
		} catch (error) {
			set({ error: 'Commande introuvable', isLoading: false });
		}
	},

	addOrder: newOrder =>
		set(state => ({ orders: [...state.orders, newOrder] })),

	updateOrder: updatedOrder =>
		set(state => ({
			orders: state.orders.map(o =>
				o.id === updatedOrder.id ? updatedOrder : o,
			),
		})),

	saveOrder: async (order: OrderSaveDTO) => {
		set({ isSubmitting: true });
		try {
			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(order),
			});

			if (!response.ok) {
				throw new Error(await response.text());
			}

			const savedOrder = await response.json();
			get().addOrder(savedOrder);

			toast({
				title: 'Commande créée',
				description: 'Votre commande a été enregistrée avec succès',
			});

			return savedOrder;
		} catch (err) {
			toast({
				title: 'Erreur',
				description:
					err instanceof Error
						? err.message
						: 'Une erreur est survenue lors de la création de la commande',
				variant: 'destructive',
			});
			throw err;
		} finally {
			set({ isSubmitting: false });
		}
	},

	deleteOrder: async id => {
		try {
			const response = await fetch(`/api/orders/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				toast({
					title: 'Erreur',
					description: 'Une erreur est survenue lors de la suppression',
					variant: 'destructive',
				});
				return false;
			}

			set(state => ({
				orders: state.orders.filter(order => order.id !== id),
				orderDetails: null,
			}));
			return true;
		} catch (error) {
			toast({
				title: 'Erreur',
				description: 'Une erreur est survenue lors de la suppression',
				variant: 'destructive',
			});
			return false;
		}
	},
	updateOrderDetails: async (id, payload) => {
		set({ isSubmitting: true });
		try {
			const response = await fetch(`/api/orders/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});
			console.log(JSON.stringify(payload));
			if (!response.ok) {
				const data = await response.json();
				toast({
					title: 'Erreur',
					description:
						data.message || 'Échec de la mise à jour de la commande',
					variant: 'destructive',
				});
				return false;
			}

			const updated = await response.json();

			set(state => ({
				orders: state.orders.map(o => (o.id === updated.id ? updated : o)),
				orderDetails: updated,
			}));

			toast({
				title: 'Commande mise à jour',
				description: 'La commande a été modifiée avec succès',
			});

			return true;
		} catch (error) {
			toast({
				title: 'Erreur',
				description: 'Impossible de mettre à jour la commande',
				variant: 'destructive',
			});
			return false;
		} finally {
			set({ isSubmitting: false });
		}
	},
}));
