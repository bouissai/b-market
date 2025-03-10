'use client';

import { Button } from '@/components/ui/button';
import { ordersDTO, OrderStatus } from '@/types/order';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import OrderStatusBadge from './badge';
import { DataTable } from '@/components/admin/table/dataTable';

interface OrderTableProps {
  data: ordersDTO[];
  onEdit: (Order: ordersDTO) => void;
  onDelete: (Order: ordersDTO) => void;
}

export function OrderTable({ data, onEdit, onDelete }: OrderTableProps) {
  const router = useRouter();

  function handleRowClick(row: ordersDTO): void {
    router.push(`/admin/orders/${row.id}`);
  }

  const columns: ColumnDef<ordersDTO>[] = [
    {
      accessorKey: 'id',
      header: 'Numéro de commande',
    },
    {
      accessorFn: (row) => row.customerName,
      id: 'customerName',
      header: 'Client',
      cell: ({ row }) => row.original.customerName,
      enableColumnFilter: true,
      filterFn: (row, _columnId, value) => {
        const customerName : string = row.getValue('customerName'); // On récupère la valeur correcte        
        return customerName.toLowerCase().includes(value.toLowerCase());
      },
    },    
    {
      accessorKey: 'nbArticles',
      header: `Nombre d'articles `,
      cell: ({ row }) => row.original.nbArticles,
      filterFn: (row, value) => {
        return row.original.nbArticles.toString() === value;
      },
    },
    {
      accessorKey: 'total',
      header: 'Prix total',
      cell: ({ row }) => row.original.total + ' €',
      filterFn: (row, value) => {
        return row.original.total.toString() === value;
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <OrderStatusBadge status={row.original.status} />;
      },
      sortingFn: (rowA, rowB) => {
        const statusA = rowA.original.status;
        const statusB = rowB.original.status;
        
        return (OrderStatus[statusA]?.order ?? 0) - (OrderStatus[statusB]?.order ?? 0);
      },
      filterFn: (row, _columnId, value) => {
        if (!value) return true;
        return row.original.status === value;
      }
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="customerName"
      filterPlaceholder="Filtrer par client..."
      onRowClick={(row) => handleRowClick(row)}
    />
  );
}
