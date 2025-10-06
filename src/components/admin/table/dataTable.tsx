'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { OrderStatus } from '@/types/order';
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DataTableProps<TData> {
	columns: ColumnDef<TData>[];
	data: TData[];
	filterColumn?: string;
	filterPlaceholder?: string;
	onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({
	columns,
	data,
	filterColumn,
	filterPlaceholder = 'Filtrer...',
	onRowClick,
}: DataTableProps<TData>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const searchParams = useSearchParams();
	const initialStatus = searchParams.get('status')?.toUpperCase() || 'ALL';
	const [activeStatus, setActiveStatus] = useState<string>(initialStatus);
	const pathname = usePathname();

	const table = useReactTable({
		data,
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
	});

	useEffect(() => {
		if (pathname === '/admin/orders' && table.getColumn('status')) {
			table
				.getColumn('status')
				?.setFilterValue(initialStatus === 'ALL' ? '' : initialStatus);
		}
	}, [table, initialStatus, pathname]);

	return (
		<>
			{filterColumn && (
				<div className="flex items-center py-4 gap-4">
					<Input
						className="max-w-sm"
						placeholder={filterPlaceholder}
						value={
							(table
								.getColumn(filterColumn)
								?.getFilterValue() as string) ?? ''
						}
						onChange={event => {
							table
								.getColumn(filterColumn)
								?.setFilterValue(event.target.value);
						}}
					/>

					{pathname === '/admin/orders' && (
						<Select
							value={activeStatus}
							onValueChange={value => {
								setActiveStatus(value);
								table
									.getColumn('status')
									?.setFilterValue(value === 'ALL' ? '' : value);
							}}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filtrer par statut" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ALL">
									Toutes les commandes
								</SelectItem>
								{Object.keys(OrderStatus).map(status => (
									<SelectItem key={status} value={status}>
										{OrderStatus[status as keyof typeof OrderStatus]
											?.status || status}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</div>
			)}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
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
							table.getRowModel().rows.map(row => (
								<TableRow
									onClick={() => onRowClick?.(row.original)}
									key={row.id}>
									{row.getVisibleCells().map(cell => (
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
									className="h-24 text-center">
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
					disabled={!table.getCanPreviousPage()}>
					Précédent
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}>
					Suivant
				</Button>
			</div>
		</>
	);
}
