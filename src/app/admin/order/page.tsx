'use client';

import OrderForm from '@/components/orderAdmin/orderForm';
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
import { useState } from 'react';

export default function OrdersManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { orders } = useOrders();

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des commandes</CardTitle>
          <div className="flex justify-between items-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create New Order</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
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
          </div>
        </CardHeader>
        <CardContent>
          
          <OrderTable
            data={orders}
            onEdit={(order) => {}}
            onDelete={(category) => {}}>
          </OrderTable>
        </CardContent>
      </Card>
      {/* <OrderForm
        onSubmit={async (values) => {
          console.log('submit', values);
          return Promise.resolve();
        }}
        onCancel={() => setIsDialogOpen(false)}
      /> */}
    </div>
  );
}
