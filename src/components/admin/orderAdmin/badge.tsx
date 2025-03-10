import { OrderStatus } from '@/types/order';
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface OrderProps {
  status: keyof typeof OrderStatus;
}

const OrderStatusBadge: React.FC<OrderProps> = ({ status }) => {
  const statusInfo = OrderStatus[status];

  return (
    <Badge
      variant={
        statusInfo.color as
          | 'secondary'
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
