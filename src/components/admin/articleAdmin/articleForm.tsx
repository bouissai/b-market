'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { extractPublicId } from '@/lib/helpers/extractPublicId';
import { useArticleStore } from '@/store/useArticleStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useImageStore } from '@/store/useImageStore';
import type { ArticleGetDto, ArticlePostDto, ArticlePutDto } from '@/types/article';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArticleImage } from './articleImage';

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  price: z.number().min(0, 'Le prix doit être positif'),
  categoryName: z.string().min(1, 'La catégorie est requise'),
  unit: z.string().min(1, "L'unité est requise"),
  description: z.string().optional(),
});

export function ArticleForm({
  article,
}: {
  article: ArticlePostDto | ArticlePutDto | null;
}) {
  const { toast } = useToast();
  const { categories, fetchCategories } = useCategoryStore();
  const { updateArticle, addArticle, setSelectedArticle } = useArticleStore();
  const { defaultImageUrl, deleteImage } = useImageStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(article?.image || '');

  // To manage uploading file if the form is submit or canceled
  const [hasNewImage, setHasNewImage] = useState(false);
  const [previousImageUrl, setPreviousImageUrl] = useState(
    article?.image || '',
  );
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  const trackUploadedImage = (url: string) => {
    setUploadedImageUrls((prev) => [...prev, url]);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: article || {
      name: '',
      price: 0,
      categoryName: '',
      unit: '',
      description: '',
    },
  });

  useEffect(() => {
    fetchCategories();

    if (article && 'id' in article) {
      // Réinitialise le formulaire
      form.reset({
        name: article.name,
        price: article.price,
        categoryName: article.categoryName,
        unit: article.unit,
        description: article.description,
      });

      setImageUrl(article.image || '');
    } else {
      // Valeurs par défaut si nouvel article
      form.reset({
        name: '',
        price: 0,
        categoryName: '',
        unit: '',
        description: '',
      });

      setImageUrl('');
    }
  }, [article, fetchCategories, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const isUpdate: boolean | null= article && 'id' in article ? !!article.id : null;
      let articleData: ArticlePostDto | ArticlePutDto;
      if (isUpdate && article && 'id' in article) {
        articleData = {
          id: article.id,
          name: values.name,
          unit: values.unit,
          price: values.price,
          image: imageUrl,
          description: values.description ?? '',
          categoryName: values.categoryName,
        };
        
        try {
          await updateArticle(articleData);
          
        } catch (error) {
          console.error("Erreur lors de la modification de l'article:", error);
          toast({
            title: 'Erreur',
            description: 'Une erreur est survenue lors de la modification',
            variant: 'destructive',
          });
        }
        
      } else {
        // Envoi d’un ArticlePostDto
        const selectedCategory = categories.find(
          (cat) => cat.name === values.categoryName,
        );
        articleData = {
          name: values.name,
          unit: values.unit,
          price: values.price,
          image: imageUrl,
          description: values.description ?? '',
          categoryId: selectedCategory?.id ?? '',
        };

        try {
          await addArticle(articleData);

        } catch (error) {
          console.error("Erreur lors de l'ajout de l'article:", error);
          toast({
            title: 'Erreur',
            description: 'Une erreur est survenue lors de l\'ajout',
            variant: 'destructive',
          });
        }
      }

      setSelectedArticle(null, null);

        // Supprimer les images intermédiaires (sauf imageUrl et default)
        const urlsToDelete = uploadedImageUrls.filter(
          (url) => url !== imageUrl && url !== defaultImageUrl,
        );
        for (const url of urlsToDelete) {
          const publicId = extractPublicId(url, defaultImageUrl);
          if (publicId) await deleteImage(publicId);
        }

        // Supprimer l'ancienne image si elle est différente de la nouvelle
        if (
          isUpdate &&
          article &&
          article.image !== imageUrl &&
          article.image !== defaultImageUrl
        ) {
          const publicId = extractPublicId(article.image, defaultImageUrl);
          if (publicId) await deleteImage(publicId);
        }



    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'article:", error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleCancel() {
    // Supprimer toutes les images uploadées sauf image d'origine
    const urlsToDelete = uploadedImageUrls.filter(
      (url) => url !== article?.image && url !== defaultImageUrl,
    );

    for (const url of urlsToDelete) {
      const publicId = extractPublicId(url, defaultImageUrl);
      if (publicId) await deleteImage(publicId);
    }

    // Supprimer la dernière image si elle n'était pas l'image d'origine
    // et si elle n’a pas déjà été supprimée ci-dessus
    if (
      imageUrl !== article?.image &&
      imageUrl !== defaultImageUrl &&
      !urlsToDelete.includes(imageUrl) // ✅ évite double suppression
    ) {
      const publicId = extractPublicId(imageUrl, defaultImageUrl);
      if (publicId) await deleteImage(publicId);
    }

    setSelectedArticle(null, null);
  }

  return (
    <Dialog open onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {article ? "Modifier l'article" : 'Ajouter un article'}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour {article ? 'modifier' : 'ajouter'}{' '}
            cet article
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'article" {...field} />
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
                    <Input placeholder="Description (facultative)" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Prix"
                      step="0.01"
                      min="0"
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        const parsedValue = Number.parseFloat(value);
                        field.onChange(
                          value === '' || isNaN(parsedValue) ? 0 : parsedValue,
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unité</FormLabel>
                  <FormControl>
                    <Input placeholder="Unité" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Composant de gestion d'image */}

            <ArticleImage
              imageUrl={imageUrl}
              setImageUrl={(url) => {
                if (url !== article?.image) {
                  setHasNewImage(true);
                }
                setPreviousImageUrl(imageUrl);
                setImageUrl(url);
              }}
              onUploadSuccess={trackUploadedImage} // ✅ nouvelle prop à ajouter
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Enregistrement...'
                  : article
                  ? 'Modifier'
                  : 'Ajouter'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
