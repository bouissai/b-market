'use client';

import { useOrders } from '@/hooks/useOrders';
import { OrderDetailsDTO } from '@/types/order';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { fetchOrderDetails } = useOrders();
  const [order, setOrder] = useState<OrderDetailsDTO>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    const getOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderDetails(id);
        setOrder(data);
      } catch {
        setError('Erreur lors de la récupération de la commande.');
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [id, fetchOrderDetails]);

  if (loading) return <p className="p-6">Chargement...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!order) return <p className="p-6">Commande introuvable</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Commande n°{order.id}</h1>
      <p className="mt-4">Client: {order.customerName}</p>
      <p className="mt-4">Total: {order.total} €</p>
      <p className="mt-4">Statut: {order.status}</p>
      <h2 className="text-xl font-bold mt-6">Produits</h2>
      <ul className="mt-4">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>{item.price} €</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
