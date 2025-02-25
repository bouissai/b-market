"use client"

import { DataTable } from "@/components/table/dataTable"
import { Button } from "@/components/ui/button"
import { Category } from "@/types/article"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash } from "lucide-react"

interface CategoryTableProps {
    data: Category[]
    onEdit: (Category: Category) => void
    onDelete: (Category: Category) => void
}

export function CategoryTable({ data, onEdit, onDelete }: CategoryTableProps) {
    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nom
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            header: "Action",
            id: 'actions',
            cell: ({ row }) => {
                const category = row.original
                return (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(category)}
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(category)}
                        >
                            <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                    </>
                )
            },
        },
    ]

    return (
        <DataTable
            columns={columns}
            data={data}
            filterColumn="name"
            filterPlaceholder="Filtrer par nom..."
        />
    )
}
