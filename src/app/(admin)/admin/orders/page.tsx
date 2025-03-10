'use client';

import { Suspense } from 'react';
import OrdersManagementContent from './OrdersManagementContent';

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersManagementContent />
    </Suspense>
  );
}