'use client';

import OrderForm from '@/components/orderAdmin/OrderForm';
import { OrderTable } from '@/components/orderAdmin/orderTable';
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
import { OrderFormValues, OrdersSaveDTO } from '@/types/order';
import { useState } from 'react';

export default function OrdersManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { orders, saveOrder } = useOrders();

  const handleOnsubmit = async (values: OrderFormValues) => {
    const newOrder: OrdersSaveDTO = {
      userId: values.userId,
      total: values.total,
      status: 'PENDING',
      orderItems: values.orderItems.map((item) => ({
        articleId: item.articleId,
        price: item.price,
        quantity: item.quantity,
      })),
    };
    await saveOrder(newOrder, 'POST', '/api/orders');
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des commandes</CardTitle>
          <div className="flex justify-between items-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Nouvelle commande</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Nouvelle commande</DialogTitle>
                </DialogHeader>
                <OrderForm
                  onSubmit={(values) => handleOnsubmit(values)}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <OrderTable
            data={orders}
            onEdit={(order) => {}}
            onDelete={(category) => {}}
          ></OrderTable>
        </CardContent>
      </Card>
    </div>
  );
}
