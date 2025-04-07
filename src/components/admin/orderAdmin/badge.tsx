import { OrderStatus, OrderStatusKey } from '@/types/order';
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface OrderProps {
  status: OrderStatusKey;
}

const OrderStatusBadge: React.FC<OrderProps> = ({ status }) => {
  const statusInfo = OrderStatus[status];
  if (!statusInfo) {
    return <Badge variant="default">Inconnu</Badge>;
  }
  return (
    <Badge
      variant={
        statusInfo.color as
          | 'pending'
          | 'info'
          | 'success'
          | 'destructive'
          | 'state'
          | 'default'
          | 'warning'
          | 'outline'
      }
    >
      {statusInfo.status}
    </Badge>
  );
};

export default OrderStatusBadge;
