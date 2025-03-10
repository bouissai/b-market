'use client';

import { DataTable } from '@/components/admin/table/dataTable';
import { User } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

interface UserTableProps {
  data: User[];
}

export function UserTable({ data }: UserTableProps) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Nom',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Rôle',
    },
    {
      accessorKey: 'createdAt',
      header: 'Date de création',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      filterPlaceholder="Filtrer par nom..."
    />
  );
}
