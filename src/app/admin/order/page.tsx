"use client"

import OrderList from "@/components/orderAdmin/OrderList"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useOrders } from "@/hooks/useOrders"
import { useState } from "react"


export default function OrdersManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {orders} = useOrders();

  console.log(orders);

  if(!Array.isArray(orders)){
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4 px-3 box-border">
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
            {/* <OrderForm onSubmit={() => {console.log('submit')}} onCancel={() => setIsDialogOpen(false)} /> */}
          </DialogContent>
        </Dialog>
      </div>
      <OrderList orders={orders} />
    </div>
  )
}