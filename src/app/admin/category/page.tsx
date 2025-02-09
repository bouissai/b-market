"use client"

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
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {useToast} from "@/hooks/use-toast"
import {useCategories} from "@/hooks/useCategories"
import {Category} from "@/types/article"
import {Loader2, Pencil, Trash} from "lucide-react"
import {useState} from "react"

export default function CategoryPage() {
    const {toast} = useToast()
    const {categories, isLoading, addCategory, updateCategory, deleteCategory} = useCategories()
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

    const handleDelete = async () => {
        if (!categoryToDelete) return;

        await deleteCategory(categoryToDelete.id).then(() => {
            toast({title: "Succès", description: "Catégorie supprimée avec succès"});
        }).catch((error) => {
                let errorMessage = "Une erreur est survenue lors de la suppression.";
                console.log(errorMessage);
                if (error.status === 400) {
                    errorMessage = "ID de catégorie manquant.";
                } else if (error.status === 404) {
                    errorMessage = "Erreur : La catégorie n'existe pas.";
                } else if (error.status === 409) {
                    errorMessage = "Cette catégorie contient des articles.";
                } else if (error.status === 500) {
                    errorMessage = "Erreur serveur. Réessayez plus tard.";
                }

                toast({
                    title: "Aïe caramba ! 🤠",
                    description: errorMessage,
                    variant: "destructive",
                });

            }
        ).finally(() => setCategoryToDelete(null))
    };


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

