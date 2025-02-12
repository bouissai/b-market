"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Order } from "@/types/order"

interface OrderListProps {
    orders: Order[];
  }
  
  export default function OrderList({ orders }: OrderListProps) {

    console.log('orders liste : ',orders);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des commandes</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
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
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === "shipped" ? "secondary" : "default"}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {order.orderItems?.map((item, index) => (
                        <li key={index}>
                          {item.orderId} (x{item.quantity})
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

