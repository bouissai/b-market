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
              <div className="flex flex-col gap-1">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{item.article.name}</span>
                    <span className="text-muted-foreground">
                      ({item.quantity} {item.article.unit})
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{item.price}€</span>
                  </div>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
