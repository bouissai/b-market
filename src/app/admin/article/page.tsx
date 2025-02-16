"use client"

import {useState} from "react"
import {Loader2, Pencil, Trash, ArrowUpDown} from "lucide-react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {useArticles} from "@/hooks/useArticles"
import {ArticleForm} from "@/components/articleForm"
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
import {Article} from "@/types/article"
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

export default function ArticlePage() {
    const {toast} = useToast()
    const {articles, isLoading, error, addArticle, updateArticle, deleteArticle} = useArticles()
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
    const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

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
                                setIsFormOpen(true)
                                setSelectedArticle(article)
                            }}
                        >
                            <Pencil className="w-4 h-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setArticleToDelete(article)}>
                            <Trash className="w-4 h-4 text-red-500"/>
                        </Button>
                    </>
                )
            },
        },
    ]

    const table = useReactTable({
        data: articles,
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

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    const handleDelete = async () => {
        if (articleToDelete) {
            const success = await deleteArticle(articleToDelete.id);
            if (success) {
                toast({
                    title: "Succès",
                    description: "Article supprimé avec succès",
                });
            }
            setArticleToDelete(null);
        }
    }

    return (
        <div className="p-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gestion des Articles</CardTitle>
                    <Button
                        onClick={() => {
                            setIsFormOpen(true)
                            setSelectedArticle(null)
                        }}
                    >
                        Ajouter un article
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

            {/* Forms and Dialogs */}
            {isFormOpen && (
                <ArticleForm
                    article={selectedArticle}
                    onCloseAction={() => setIsFormOpen(false)}
                    onSaveAction={(newArticle) => {
                        if (selectedArticle) {
                            updateArticle(newArticle)
                        } else {
                            addArticle(newArticle)
                        }
                        setIsFormOpen(false)
                    }}
                />
            )}
            <AlertDialog open={!!articleToDelete} onOpenChange={() => setArticleToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet article ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Cela supprimera définitivement l&#39;article.
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

