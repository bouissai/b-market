'use client';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Order } from '@/types/order';

interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return <p>Aucune commande</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Articles</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.user.name}</TableCell>
            <TableCell>
              <Badge
                variant={
                  order.status === 'pending'
                    ? 'secondary'
                    : order.status === 'awaiting_payment'
                    ? 'info'
                    : order.status === 'completed'
                    ? 'success'
                    : order.status === 'cancelled'
                    ? 'destructive'
                    : 'default'
                }
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>
              <ul className="list-disc list-inside">
                {order.orderItems?.map((item, index) => (
                  <li key={index}>
                    {item.article.name} (x{item.quantity})
                  </li>
                ))}
              </ul>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
