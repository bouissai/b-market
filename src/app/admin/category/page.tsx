"use client"

import {useState} from "react"
import {Loader2, Pencil, Trash, ArrowUpDown} from "lucide-react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {CategoryForm} from "@/components/categoryForm"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {useToast} from "@/hooks/use-toast"
import {Category} from "@/types/article"
import {useCategories} from "@/hooks/useCategories"
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
} from '@tanstack/react-table'
import {Input} from "@/components/ui/input"

export default function CategoryPage() {
    const {toast} = useToast()
    const {categories, isLoading, addCategory, updateCategory, deleteCategory} = useCategories()
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns: ColumnDef<Category>[] = [
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
            id: 'actions',
            cell: ({row}) => {
                const category = row.original
                return (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setIsFormOpen(true)
                                setSelectedCategory(category)
                            }}
                        >
                            <Pencil className="w-4 h-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setCategoryToDelete(category)}>
                            <Trash className="w-4 h-4 text-red-500"/>
                        </Button>
                    </>
                )
            },
        },
    ]

    const table = useReactTable({
        data: categories,
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
    })

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin"/>
            </div>
        )
    }

    const handleDelete = async () => {
        if (!categoryToDelete) return;

        await deleteCategory(categoryToDelete.id)
            .then(() => {
                toast({
                    title: "Succès",
                    description: "Catégorie supprimée avec succès",
                })
            })
            .catch((error) => {
                let errorMessage = "Une erreur est survenue lors de la suppression."
                if (error.status === 409) {
                    errorMessage = "Cette catégorie contient des articles."
                }
                toast({
                    title: "Erreur",
                    description: errorMessage,
                    variant: "destructive",
                })
            })
            .finally(() => setCategoryToDelete(null))
    }

    return (
        <div className="p-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gestion des Catégories</CardTitle>
                    <Button
                        onClick={() => {
                            setIsFormOpen(true)
                            setSelectedCategory(null)
                        }}
                    >
                        Ajouter une catégorie
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center py-4">
                        <Input
                            placeholder="Filtrer par nom..."
                            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                            onChange={(event) =>
                                table.getColumn('name')?.setFilterValue(event.target.value)
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
                </CardContent>
            </Card>

            {isFormOpen && (
                <CategoryForm
                    category={selectedCategory}
                    onCloseAction={() => setIsFormOpen(false)}
                    onSaveAction={(newCategory) => {
                        if (selectedCategory) {
                            updateCategory(newCategory)
                        } else {
                            addCategory(newCategory)
                        }
                        setIsFormOpen(false)
                    }}
                />
            )}
            <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette catégorie ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Cela supprimera définitivement la catégorie.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
