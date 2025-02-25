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
import { useCategories } from '@/hooks/useCategories';
import type { Article } from '@/types/article';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  price: z.number().min(0, 'Le prix doit être positif'),
  categoryName: z.string().min(1, 'La catégorie est requise'),
  unit: z.string().min(1, "L'unité est requise"),
});

interface ArticleFormProps {
  article?: Article | null;
  onCloseAction: () => void;
  onSaveAction: (data: Article) => void;
}

export function ArticleForm({
  article,
  onCloseAction,
  onSaveAction,
}: ArticleFormProps) {
  const { toast } = useToast();
  const { categories } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: article || {
      name: '',
      price: 0,
      categoryName: '',
      unit: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const method = article ? 'PATCH' : 'POST';
      const url = article ? `/api/article/${article.id}` : '/api/article';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorResponse = await response.json(); // Récupérer l'objet d'erreur
        throw {
          status: response.status,
          message: errorResponse.message || 'Erreur inconnue',
        };
      }
      const data = await response.json();
      onSaveAction(data);
      toast({
        title: 'Succès',
        description: article
          ? 'Article modifié avec succès'
          : 'Article ajouté avec succès',
      });
      onCloseAction();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: '' + (error?.message || 'Une erreur est survenue'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onCloseAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {article ? "Modifier l'article" : 'Ajouter un article'}
          </DialogTitle>
          <DialogDescription></DialogDescription>
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
                        if (value === '' || isNaN(parsedValue)) {
                          field.onChange(0);
                        } else {
                          field.onChange(parsedValue);
                        }
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
                    {/*<Input placeholder="Catégorie" {...field} />*/}
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Enregistrement...'
                : article
                ? 'Modifier'
                : 'Ajouter'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
