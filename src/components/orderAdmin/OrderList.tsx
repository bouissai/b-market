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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Order } from '@/types/order';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ArrowUpDown } from "lucide-react";

interface OrderListProps {
  orders: Order[];
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'Order ID',
  },
  {
    accessorKey: 'user',
    header: 'Client',
    cell: ({ row }) => row.original.user.name,
    filterFn: (row, id, value) => {
      return row.original.user.name.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'pending'
              ? 'secondary'
              : status === 'awaiting_payment'
              ? 'info'
              : status === 'completed'
              ? 'success'
              : status === 'cancelled'
              ? 'destructive'
              : 'default'
          }
        >
          {status}
        </Badge>
      );
    },
    sortingFn: (rowA, rowB) => {
      const statusOrder = {
        'pending': 1,
        'awaiting_payment': 2,
        'completed': 3,
        'cancelled': 4
      };
      const statusA = rowA.original.status;
      const statusB = rowB.original.status;
      return statusOrder[statusA as keyof typeof statusOrder] - statusOrder[statusB as keyof typeof statusOrder];
    },
  },
  {
    accessorKey: 'orderItems',
    header: 'Articles',
    cell: ({ row }) => {
      const orderItems = row.original.orderItems;
      return (
        <div className="flex flex-col gap-1">
          {orderItems?.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="font-medium">{item.article.name}</span>
              <span className="text-muted-foreground">
                ({item.quantity} {item.article.unit})
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{item.price}€</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between items-center text-sm font-semibold">
            <span>Total</span>
            <span>{row.original.total.toFixed(2)}€</span>
          </div>
        </div>
      );
    },
  },
];

export default function OrderList({ orders }: OrderListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    filterFns: {
      fuzzy: (row, columnId, value, addMeta) => {
        const itemValue = row.getValue(columnId);
        return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
      },
    },
  });

  if (orders.length === 0) {
    return <p>Aucune commande</p>;
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrer par client..."
          value={(table.getColumn('user')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('user')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
