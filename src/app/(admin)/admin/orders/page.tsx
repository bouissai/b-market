'use client';

import OrdersManagementContent from '@/components/admin/orderAdmin/OrdersManagementContent';
import { Suspense } from 'react';

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersManagementContent />
    </Suspense> 
  );
}