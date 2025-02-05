"use client"

import {useState} from "react"
import {Loader2, Pencil, Trash} from "lucide-react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {useCategories} from "@/hooks/useCategories"
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
import {CategoryForm} from "@/components/categoryForm";
import {Category} from "@/types/article";

export default function CategoryPage() {
    const {toast} = useToast()
    const {categories, isLoading, error, addCategory, updateCategory, deleteCategory} = useCategories()
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

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
        if (categoryToDelete) {
            await deleteCategory(categoryToDelete.id)
            setCategoryToDelete(null)
            toast({
                title: "Succès",
                description: "Catégorie supprimée avec succès",
            })
        }
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>
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
                                        <Button variant="ghost" size="icon"
                                                onClick={() => setCategoryToDelete(category)}>
                                            <Trash className="w-4 h-4 text-red-500"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                            Cette action ne peut pas être annulée. Cela supprimera définitivement la catégorie et
                            pourrait affecter
                            les articles associés.
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

