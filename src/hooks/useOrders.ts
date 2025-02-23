import { useCallback, useEffect, useState } from 'react';
import { ordersDTO, OrderDetailsDTO } from '@/types/order';

export function useOrders() {
  const [orders, setOrders] = useState<ordersDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction générique pour éviter la répétition du fetch
  const apiRequest = useCallback(
    async (url: string, method: string = 'GET', body?: unknown) => {
      try {
        setError(null);
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || `Error ${response.status}`);
        }

        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [],
  );

  // Récupération des commandes
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest('/api/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Ajout et mise à jour des commandes en local
  const addOrder = useCallback((newOrder: ordersDTO) => {
    setOrders((prev) => [...prev, newOrder]);
  }, []);

  const updateOrder = useCallback((updatedOrder: ordersDTO) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
    );
  }, []);

  // Sauvegarde d'une commande (POST ou PUT)
  const saveOrder = useCallback(
    async (order: ordersDTO, method: 'POST' | 'PUT', url: string) => {
      setIsSubmitting(true);
      try {
        const savedOrder = await apiRequest(url, method, order);
        if (method === 'POST') {
          addOrder(savedOrder);
        } else {
          updateOrder(savedOrder);
        }
        return savedOrder;
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [apiRequest, addOrder, updateOrder],
  );

  // Suppression d'une commande
  const deleteOrder = useCallback(
    async (id: string) => {
      try {
        await apiRequest(`/api/orders/${id}`, 'DELETE');
        setOrders((prev) => prev.filter((order) => order.id !== id));
      } catch (err) {
        console.error(err);
      }
    },
    [apiRequest],
  );

  // Récupération des détails d'une commande
  const fetchOrderDetails = useCallback(
    async (id: string): Promise<OrderDetailsDTO> => {
      return await apiRequest(`/api/orders/${id}`);
    },
    [apiRequest],
  );

  return {
    orders,
    isLoading,
    isSubmitting,
    error,
    fetchOrders,
    fetchOrderDetails,
    addOrder,
    updateOrder,
    saveOrder,
    deleteOrder,
  };
}
