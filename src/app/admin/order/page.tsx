"use client"

import OrderForm from "@/components/orderAdmin/OrderForm"
import OrderList from "@/components/orderAdmin/OrderList"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

interface OrderItem {
  productId: string
  quantity: number
}

export default function OrdersManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [orders, setOrders] = useState([])

  const handleCreateOrder = async (orderData: { userId: string; status: string; orderItems: OrderItem[] }) => {
    try {
/*       const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create order")
      }

      const newOrder = await response.json()
      setOrders([...orders, newOrder])
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    } */

      setIsDialogOpen(false);
  }

  return (
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
            <OrderForm onSubmit={handleCreateOrder} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <OrderList orders={orders} setOrders={setOrders} />
    </div>
  )
}