import { toast } from "@/hooks/use-toast";
import { OrderDetailsDTO, ordersDTO, OrdersSaveDTO } from "@/types/order";
import { create } from "zustand";

type OrderStore = {
    orders: ordersDTO[];
    orderDetails: OrderDetailsDTO | null;
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    fetchOrderDetails: (id: number) => Promise<void>;
    addOrder: (newOrder: ordersDTO) => void;
    init: () => void
    updateOrder: (updatedOrder: ordersDTO) => void;
    saveOrder: (order: OrdersSaveDTO, method: "POST" | "PUT", url: string) => Promise<ordersDTO | void>;
    deleteOrder: (id: number) => Promise<boolean>;
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
            const response = await fetch("/api/orders");
            if (!response.ok) throw new Error("Erreur lors du chargement des commandes");
            const data = await response.json();
            set({ orders: data, isLoading: false });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Une erreur est survenue", isLoading: false });
        }
    },

    init: async () => {
        if (get().orders.length === 0) { // ✅ Évite de refetch si déjà chargé
            await get().fetchOrders();
        }
    },



    fetchOrderDetails: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/orders/${id}`);
            if (!response.ok) throw new Error("Erreur lors de la récupération de la commande");
            const data = await response.json();
            set({ orderDetails: data, isLoading: false }); // 🔥 Mise à jour globale du store
        } catch (error) {
            set({ error: "Commande introuvable", isLoading: false });
        }
    },

    addOrder: (newOrder) => set((state) => ({ orders: [...state.orders, newOrder] })),

    updateOrder: (updatedOrder) =>
        set((state) => ({
            orders: state.orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
        })),

    saveOrder: async (order, method, url) => {
        set({ isSubmitting: true });
        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order),
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la sauvegarde de la commande`);
            }

            const savedOrder = await response.json();

            if (method === "POST") {
                get().addOrder(savedOrder);
            } else {
                get().updateOrder(savedOrder);
            }

            return savedOrder;
        } catch (err) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la création de la commande",
                variant: "destructive",
            });
        } finally {
            set({ isSubmitting: false });
        }
    },

    deleteOrder: async (id) => {
        try {
            const response = await fetch(`/api/orders/${id}`, { method: "DELETE" });

            if (!response.ok) {
                toast({
                    title: "Erreur",
                    description: "Une erreur est survenue lors de la suppression",
                    variant: "destructive",
                });
                return false;
            }

            set((state) => ({
                orders: state.orders.filter((order) => order.id !== id),
                orderDetails: null,
            }));
            return true;
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la suppression",
                variant: "destructive",
            });
            return false;
        }
    },
}));
