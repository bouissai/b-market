'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '../../ui/scroll-area';
import { Check, ChevronsUpDown, Trash2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../ui/command';
import { useArticleStore } from '@/store/useArticleStore';
import { useUserStore } from '@/store/useUserStore';
import { OrderFormValues, OrderItemSchema, OrderSchema } from '@/types/order';

interface OrderFormProps {
  onSubmit: (values: OrderFormValues) => Promise<void>;
  onCancel: () => void;
}

export function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
  const { articles, fetchArticles } = useArticleStore();
  const { users, fetchUsers } = useUserStore();
  const [selectedArticlesIds, setSelectedArticlesIds] = useState<string[]>([]);
  const [clientPopoverOpen, setClientPopoverOpen] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
    defaultValues: { total: 0, orderItems: [], note: "" },
  });

  const { fields: itemFields, remove, append } = useFieldArray({
    control: form.control,
    name: 'orderItems',
  });

  const watchedOrderItems = useWatch({ control: form.control, name: 'orderItems' });

  const computedTotal = useMemo(() => watchedOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [watchedOrderItems]);

  useEffect(() => {
    form.setValue('total', computedTotal);
  }, [computedTotal, form]);

  useEffect(() => {
    fetchArticles();
    fetchUsers();
  }, []);

  const handleArticleSelect = useCallback((articleId: string) => {
    const isSelected = selectedArticlesIds.includes(articleId);

    if (isSelected) {
      setSelectedArticlesIds((prev) => prev.filter((id) => id !== articleId));
      remove(form.getValues().orderItems.findIndex((item) => item.articleId === articleId));
    } else {
      const articleToAdd = articles.find((a) => a.id === articleId);
      if (articleToAdd) {
        setSelectedArticlesIds((prev) => [...prev, articleId]);
        append({
          articleId: articleToAdd.id,
          articleName: articleToAdd.name,
          quantity: 1,
          unit: articleToAdd.unit,
          price: articleToAdd.price,
        });
      }
    }
  }, [selectedArticlesIds, articles, form, remove, append]);

  return (
    <div className="w-full h-full">
      <ScrollArea className="w-full h-70 box-border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 box-border px-1">
            <FormField control={form.control} name="userId" render={({ field }) => (
              <FormItem className="w-full flex flex-col">
                <FormLabel>Client</FormLabel>
                <Popover open={clientPopoverOpen} onOpenChange={setClientPopoverOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" role="combobox">
                        {field.value ? users.find((u) => u.id === field.value)?.name || "Sélectionner un client" : "Sélectionner un client"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandInput placeholder="Rechercher un client..." />
                      <CommandList>
                        <CommandEmpty>Aucun client trouvé.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem key={user.id} onSelect={() => { form.setValue('userId', user.id); setClientPopoverOpen(false); }}>
                              {user.name} - {user.email}
                              <Check className={user.id === field.value ? 'opacity-100' : 'opacity-0'} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="note" render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl><Textarea {...field} placeholder="Ajouter un commentaire..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
              <Button type="submit">Valider</Button>
            </DialogFooter>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
}

export default OrderForm;
