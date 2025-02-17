"use client"

import { ArticleForm } from "@/components/articleAdmin/articleForm"
import { ArticleTable } from "@/components/articleAdmin/articleTable"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useArticles } from "@/hooks/useArticles"
import { Article } from "@/types/article"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export default function ArticlePage() {
    const {toast} = useToast()
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
                    <ArticleTable 
                        data={articles}
                        onEdit={(article) => {
                            setIsFormOpen(true)
                            setSelectedArticle(article)
                        }}
                        onDelete={setArticleToDelete}
                    />
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

