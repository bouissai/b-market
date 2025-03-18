'use client';

import { CategoryForm } from '@/components/admin/categoryAdmin/categoryForm';
import { CategoryTable } from '@/components/admin/categoryAdmin/categoryTable';
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
import { useCategoryStore } from '@/store/useCategoryStore';
import { Category } from '@/types/category';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function CategoryPage() {
  const { toast } = useToast();
  const {
    categories,
    isLoading,
    selectedCategory,
    mode,
    isFormOpen,
    fetchCategories,
    setSelectedCategory,
    setIsFormOpen,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleDelete = async () => {
    const success = await deleteCategory();
    if (success) {
      toast({
        title: 'Succès',
        description: 'Catégorie supprimée avec succès',
      });
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des Catégories</CardTitle>
          <Button
            onClick={() => {
              setIsFormOpen(true);
              setSelectedCategory(null, 'new');
            }}
          >
            Ajouter une catégorie
          </Button>
        </CardHeader>
        <CardContent>
          <CategoryTable
            data={categories}
            onEdit={(category) => {
              setIsFormOpen(true);
              setSelectedCategory(category, 'edit');
            }}
            onDelete={(category) => {
              setSelectedCategory(category, 'delete');
            }}
          />
        </CardContent>
      </Card>

      {isFormOpen && (
        <CategoryForm
          category={selectedCategory}
          onCloseAction={() => setIsFormOpen(false)}
          onSaveAction={(newCategory: Category) => {
            if (mode === 'edit') {
              updateCategory(newCategory);
            } else {
              addCategory(newCategory);
            }
            setIsFormOpen(false);
          }}
        />
      )}
      <AlertDialog
        open={mode === 'delete'}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedCategory(null, null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer cette catégorie ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera
              définitivement la catégorie.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCategory(null, null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}