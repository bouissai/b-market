'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/hooks/useOrders';
import { OrderDetailsDTO } from '@/types/order';
import { Pen, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { fetchOrderDetails, deleteOrder } = useOrders();
  const [order, setOrder] = useState<OrderDetailsDTO>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();

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

  const handleEdit = () => {
    // TODO
  };

  const handleDelete = async () => {
    if (!id || typeof id !== 'string') return;

    const success = await deleteOrder(id);
    if (success) {
      router.push(`/admin/orders`);
      toast({
        title: 'Succès',
        description: 'Commande supprimée avec succès',
      });
    }
  };

  if (loading) return <p className="p-6">Chargement...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!order) return <p className="p-6">Commande introuvable</p>;

  return (
    <div className="p-6">
      <div className="flex gap-x-2 items-center">
        <h1 className="text-2xl font-bold">Commande n°{order.id}</h1>
        <Button onClick={handleEdit} variant="outline" size={'icon'}>
          <Pen />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size={'icon'}>
              <Trash />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Êtes-vous sûr de vouloir supprimer cette commande ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cela annulera
                définitivement la commande.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-700"
                onClick={handleDelete}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <p className="mt-4">Client: {order.customerName}</p>
      <p className="mt-4">Total: {order.total} €</p>
      <p className="mt-4">Statut: {order.status}</p>
      <h2 className="text-xl font-bold mt-6">Produits</h2>
      <ul className="mt-4">
        {order.items?.map((item) => (
          <li key={item.id} className="flex">
            <span>
              {item.name} {item.price} € x {item.quantity}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
