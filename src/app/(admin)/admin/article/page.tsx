'use client';

import { ArticleForm } from "@/components/admin/articleAdmin/articleForm";
import { ArticleTable } from "@/components/admin/articleAdmin/articleTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useArticleStore } from "@/store/useArticleStore";
import { Loader2 } from 'lucide-react';
import { useEffect } from "react";

export default function ArticlePage() {
  const { toast } = useToast();
  const {
    articles,
    isLoading,
    error,
    selectedArticle,
    mode,
    setSelectedArticle,
    addArticle,
    fetchArticles,
    updateArticle,
    deleteArticle,
  } = useArticleStore();

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const handleDelete = async () => {
    const success = await deleteArticle();
    if (success) {
      toast({
        title: 'Succès',
        description: 'Article supprimé avec succès',
      });
    }
    setSelectedArticle(null, null); // 🔥 Réinitialisation après suppression
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des Articles</CardTitle>
          <Button
            onClick={() => setSelectedArticle(null, "new")}
          >
            Ajouter un article
          </Button>
        </CardHeader>
        <CardContent>
          <ArticleTable
            data={articles}
            onEdit={(article) => setSelectedArticle(article, "edit")}
            onDelete={(article) => setSelectedArticle(article, "delete")}
          />
        </CardContent>
      </Card>

      {/* Formulaire de création / modification */}
      {(mode === "edit" || mode === "new") && (
        <ArticleForm
          article={selectedArticle}
          onCloseAction={() => setSelectedArticle(null, null)}
          onSaveAction={(newArticle) => {
            if (selectedArticle) {
              updateArticle(newArticle);
            } else {
              addArticle(newArticle);
            }
            setSelectedArticle(null, null);
          }}
        />
      )}

      {/* Dialogue de suppression */}
      <AlertDialog
        open={mode === "delete" && selectedArticle !== null}
        onOpenChange={() => setSelectedArticle(null, null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer cet article ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera
              définitivement l&#39;article.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
