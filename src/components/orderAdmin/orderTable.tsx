"use client"

import { Button } from "@/components/ui/button"
import { Order } from "@/types/order"
import { ColumnDef, useReactTable } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Badge } from "../ui/badge"
import { DataTable } from "../table/dataTable"

interface OrderTableProps {
    data: Order[]
    onEdit: (Order: Order) => void
    onDelete: (Order: Order) => void
}

export function OrderTable({data, onEdit, onDelete}: OrderTableProps) {
    
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



  return (
    <DataTable 
        columns={columns} 
        data={data} 
        filterColumn="user"
        filterPlaceholder="Filtrer par client..."
    />
)

}