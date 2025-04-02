"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { extractPublicId } from "@/lib/helpers/extractPublicId";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useImageStore } from "@/store/useImageStore";
import { Category } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CategoryImage } from "./categoryImage";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  image: z.string().optional(),
  featured: z.boolean().optional(),
  description: z.string().optional()
});

interface CategoryFormProps {
  category?: Category | null;
  onCloseAction: () => void;
  onSaveAction: (data: Category) => void;
}

export function CategoryForm({ category, onCloseAction, onSaveAction }: CategoryFormProps) {
  const { saveCategory, isSubmitting } = useCategoryStore();
  const { toast } = useToast();
  const { defaultImageUrl, deleteImage } = useImageStore();
  const [imageUrl, setImageUrl] = useState(category?.image || "");
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  const trackUploadedImage = (url: string) => {
    setUploadedImageUrls((prev) => [...prev, url]);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      image: category?.image || defaultImageUrl,
      featured: category?.featured || false,
      description: category?.description || "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const method = category ? "PUT" : "POST";
      const url = category ? `/api/category/${category.id}` : "/api/category";

      const categoryData: Partial<Category> = category
        ? { ...category, ...values, image: imageUrl }
        : { ...values, image: imageUrl };

        const savedCategory = await saveCategory(categoryData as Category, method, url);

      // Nettoyage des images uploadées sauf celle gardée
      const urlsToDelete = uploadedImageUrls.filter(
        (url) => url !== imageUrl && url !== defaultImageUrl
      );
      for (const url of urlsToDelete) {
        const publicId = extractPublicId(url, defaultImageUrl);
        if (publicId) await deleteImage(publicId);
      }

      toast({
        title: "Succès",
        description:
          method === "PUT"
            ? "Catégorie modifiée avec succès"
            : "Catégorie ajoutée avec succès",
      });

      onSaveAction(savedCategory);
      onCloseAction();
    } catch (error: any) {
      let descriptionError = "Une erreur est survenue lors de l'enregistrement.";
      if (error.status === 409) {
        descriptionError = error.message || "Cette catégorie existe déjà.";
      }
      toast({
        title: "Erreur",
        description: descriptionError,
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    const urlsToDelete = uploadedImageUrls.filter(
      (url) => url !== category?.image && url !== defaultImageUrl
    );

    for (const url of urlsToDelete) {
      const publicId = extractPublicId(url, defaultImageUrl);
      if (publicId) await deleteImage(publicId);
    }

    if (
      imageUrl !== category?.image &&
      imageUrl !== defaultImageUrl &&
      !urlsToDelete.includes(imageUrl)
    ) {
      const publicId = extractPublicId(imageUrl, defaultImageUrl);
      if (publicId) await deleteImage(publicId);
    }

    onCloseAction();
  };

  return (
    <Dialog open onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Modifier la catégorie" : "Ajouter une catégorie"}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de la catégorie" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Description de la catégorie (facultatif)"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CategoryImage
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              onUploadSuccess={trackUploadedImage}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="mb-0">Mettre en avant (featured)</FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : category ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
