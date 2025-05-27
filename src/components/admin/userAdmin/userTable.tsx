'use client';

import { DataTable } from '@/components/admin/table/dataTable';
import { Button } from '@/components/ui/button';
import { User, UserDelete, UserPut } from '@/types/user';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserTableProps {
	data: User[];
	onEdit: (user: UserPut) => void;
	onDelete: (user: UserDelete) => void;
}

export function UserTable({ data, onEdit, onDelete }: UserTableProps) {
	const router = useRouter();

	function handleRowClick(row: User): void {
		router.push(`/admin/users/${row.id}`);
	}

	const columns: ColumnDef<User>[] = [
		{
			accessorKey: 'firstname',
			header: 'Prénom',
		},
		{
			accessorKey: 'lastname',
			header: 'Nom',
		},
		{
			accessorKey: 'email',
			header: 'Email',
		},
		{
			accessorKey: 'phone',
			header: 'Téléphone',
			cell: ({ row }) => row.original.phone || 'Non renseigné',
		},
		{
			accessorKey: 'createdAt',
			header: 'Date de création',
			cell: ({ row }) =>
				new Date(row.original.createdAt).toLocaleDateString(),
		},
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => {
				const user = row.original;
				return (
					<div className="flex space-x-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => onEdit(user)}>
							<Pencil className="w-4 h-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => onDelete(user)}>
							<Trash className="w-4 h-4 text-red-500" />
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<DataTable
			columns={columns}
			data={data}
			filterColumn="lastname"
			filterPlaceholder="Filtrer par nom..."
			onRowClick={row => handleRowClick(row)}
		/>
	);
}
