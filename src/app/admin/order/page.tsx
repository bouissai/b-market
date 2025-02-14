'use client';

import OrderForm from '@/components/orderAdmin/OrderForm';
import OrderList from '@/components/orderAdmin/OrderList';
import { Button } from '@/components/ui/button';
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
    // <div className="p-6">
    //   <Card>
    //     <CardHeader className="flex flex-row items-center justify-between">
    //       <CardTitle>Gestion des commandes</CardTitle>
    //       <div className="flex justify-between items-center">
    //         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    //           <DialogTrigger asChild>
    //             <Button>Create New Order</Button>
    //           </DialogTrigger>
    //           <DialogContent className="sm:max-w-[425px]">
    //             <DialogHeader>
    //               <DialogTitle>Create New Order</DialogTitle>
    //             </DialogHeader>
    //             <OrderForm
    //               // onSubmit={handleCreateOrder}
    //               // onCancel={() => setIsDialogOpen(false)}
    //             />
    //           </DialogContent>
    //         </Dialog>
    //       </div>
    //     </CardHeader>
    //     <CardContent>
    //       <OrderList orders={orders} />
    //     </CardContent>
    //   </Card>
    //   <OrderForm
    //   // onSubmit={async (values) => {
    //   //   console.log('submit', values);
    //   //   return Promise.resolve();
    //   // }}
    //   // onCancel={() => setIsDialogOpen(false)}
    //   />
    // </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Order</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
            </DialogHeader>
            <OrderForm
              onSubmit={async (order) => {
                // handle order submission
                console.log(order);
                return Promise.resolve();
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <OrderList orders={orders} />
    </div>
  );
}
