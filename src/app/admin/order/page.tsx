'use client';

import OrderForm from '@/components/orderAdmin/OrderForm';
import OrderList from '@/components/orderAdmin/OrderList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useOrders } from '@/hooks/useOrders';
import { useState } from 'react';

export default function OrdersManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { orders } = useOrders();

  console.log(orders);

  if (!Array.isArray(orders)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des commandes</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Ajouter une commande</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter une commande</DialogTitle>
              </DialogHeader>
              <OrderForm
                onSubmit={async (values) => {
                  console.log('submit', values);
                  return Promise.resolve();
                }}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <OrderList orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}
