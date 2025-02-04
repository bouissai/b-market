"use client"

import {useState} from "react"
import {Loader2, Pencil, Trash} from "lucide-react"
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
import {toast} from "@/hooks/use-toast";
import {Article} from "@/types/article";

export default function ArticlePage() {
    const {articles, isLoading, error, addArticle, updateArticle, deleteArticle} = useArticles()
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
    const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)

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
            await deleteArticle(articleToDelete.id)
            setArticleToDelete(null)
            toast({
                title: "Succès",
                description: "Article supprimé avec succès",
            })
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Prix</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead>Unité</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {articles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell>{article.name}</TableCell>
                                    <TableCell>{article.price.toFixed(2)} €</TableCell>
                                    <TableCell>{article.categoryName}</TableCell>
                                    <TableCell>{article.unit}</TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {isFormOpen && (
                <ArticleForm
                    article={selectedArticle}
                    onClose={() => setIsFormOpen(false)}
                    onSave={(newArticle) => {
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

