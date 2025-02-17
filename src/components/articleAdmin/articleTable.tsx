"use client"

import {Article} from "@/types/article"
import {ColumnDef} from "@tanstack/react-table"
import {Button} from "@/components/ui/button"
import {ArrowUpDown, Pencil, Trash} from "lucide-react"
import { DataTable } from "../table/dataTable"

interface ArticleTableProps {
    data: Article[]
    onEdit: (article: Article) => void
    onDelete: (article: Article) => void
}

export function ArticleTable({data, onEdit, onDelete}: ArticleTableProps) {

    const columns: ColumnDef<Article>[] = [
        {
            accessorKey: 'name',
            header: ({column}) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nom
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                )
            },
        },
        {
            accessorKey: 'price',
            header: ({column}) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Prix
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                )
            },
            cell: ({row}) => `${row.getValue<number>('price').toFixed(2)} €`,
        },
        {
            accessorKey: 'categoryName',
            header: ({column}) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Catégorie
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                )
            },
        },
        {
            accessorKey: 'unit',
            header: 'Unité',
        },
        {
            id: 'actions',
            cell: ({row}) => {
                const article = row.original
                return (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                onEdit(article)
                            }}
                        >
                            <Pencil className="w-4 h-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(article)}>
                            <Trash className="w-4 h-4 text-red-500"/>
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