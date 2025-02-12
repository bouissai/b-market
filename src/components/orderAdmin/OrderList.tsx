"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"

interface OrderItem {
  productId: string
  quantity: number
}

interface Order {
  id: string
  userId: string
  status: string
  orderItems: OrderItem[]
}

interface OrderListProps {
  orders: Order[]
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
}

export default function OrderList({ orders, setOrders }: OrderListProps) {
  const [orderData, setOrderData] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }
        const data = await response.json()
        setOrderData(data)
        setOrders(data)
      } catch (err) {
        console.error("Error fetching orders:", err)
      }
    }

    fetchOrders()
  }, [setOrders])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order List</CardTitle>
      </CardHeader>
      <CardContent>
        {orderData.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === "shipped" ? "success" : "default"}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {order.orderItems.map((item, index) => (
                        <li key={index}>
                          {item.productId} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

