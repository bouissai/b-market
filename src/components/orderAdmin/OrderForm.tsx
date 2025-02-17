'use client';

import { Button } from '@/components/ui/button';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { DialogFooter } from '@/components/ui/dialog';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useArticles } from '@/hooks/useArticles';
import { cn } from '@/lib/utils';
import { Article } from '@/types/article';
import { OrderSchema } from '@/types/order';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, GrabIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

interface OrderFormProps {
  onSubmit: (values: z.infer<typeof OrderSchema>) => Promise<void>;
  onCancel: () => void;
}

export function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
  const { articles } = useArticles();
  const [open, setOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article>();

  const form = useForm<z.infer<typeof OrderSchema>>({
    resolver: zodResolver(OrderSchema), // Apply the zodResolver
  });

  const {
    fields: itemFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'orderItems',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User name</FormLabel>
              <FormControl>
                <Input placeholder="Hafid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="orderItems"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>Articles</FormLabel>
              <Popover>
                <div className='flex flex-row gap-x-2'>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedArticle
                          ? articles.find(
                              (article) => article.id === selectedArticle.id,
                            )?.name
                          : 'Sélectionner un article...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      if (selectedArticle) {
                        append({articleId: selectedArticle.id, articleName: selectedArticle.name, quantity: 1 });
                        setSelectedArticle(undefined);
                      }
                    }}
                    disabled={!selectedArticle}>Ajouter l'article</Button>
                </div>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search product..." />
                    <CommandList>
                      <CommandEmpty>No product found.</CommandEmpty>
                      <CommandGroup>
                        {articles.map((article) => (
                          <CommandItem
                            key={article.id}
                            onSelect={() => {
                              setSelectedArticle(
                                article.id === selectedArticle?.id
                                  ? undefined
                                  : article,
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedArticle?.id === article.id
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {article.name} - {article.price.toFixed(2)}€
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {itemFields.map((field, index) => (
          <div key={field.id} className="flex flex-row gap-x-4">
            {field.articleName}
            <Button 
              size="icon"
              onClick={remove.bind(null, index)}>
                <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {/* <FormField
          control={form.control}
          name="total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total</FormLabel>
              <FormControl>
                <Input disabled defaultValue={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Order</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
