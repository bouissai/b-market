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
import { cn } from '@/lib/utils';
import { Article } from '@/types/article';
import { OrderSchema } from '@/types/order';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

interface OrderFormProps {
  onSubmit: (values: z.infer<typeof OrderSchema>) => Promise<void>;
  onCancel: () => void;
}

const articles: Article[] = [
  {
    id: 'art1',
    name: 'Côte de bœuf',
    unit: 'kg',
    price: 29.99,
    image: 'https://example.com/cote-de-boeuf.jpg',
    description:
      'Une côte de bœuf tendre et savoureuse, idéale pour le barbecue.',
    createdAt: new Date('2024-01-10T10:00:00Z'),
    updatedAt: new Date('2024-02-01T12:00:00Z'),
    categoryName: 'Bœuf',
    category: {
      id: 'cat1',
      name: 'Bœuf',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    cartItems: [],
    orderItems: [],
  },
  {
    id: 'art2',
    name: 'Escalope de poulet',
    unit: 'kg',
    price: 12.5,
    image: 'https://example.com/escalope-poulet.jpg',
    description:
      'Escalopes de poulet maigres et savoureuses, parfaites pour vos plats.',
    createdAt: new Date('2024-01-15T08:30:00Z'),
    updatedAt: new Date('2024-02-02T14:00:00Z'),
    categoryName: 'Volaille',
    category: {
      id: 'cat2',
      name: 'Volaille',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    cartItems: [],
    orderItems: [],
  },
  {
    id: 'art3',
    name: 'Saucisses de Toulouse',
    unit: 'kg',
    price: 15.0,
    image: 'https://example.com/saucisses-toulouse.jpg',
    description:
      'Délicieuses saucisses de Toulouse, parfaites pour le barbecue ou les plats mijotés.',
    createdAt: new Date('2024-01-20T11:45:00Z'),
    updatedAt: new Date('2024-02-05T16:30:00Z'),
    categoryName: 'Porc',
    category: {
      id: 'cat3',
      name: 'Porc',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    cartItems: [],
    orderItems: [],
  },
];

export function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
  // const { articles } = useArticles();
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

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
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedProductId
                        ? articles.find(
                            (article) => article.id === selectedProductId,
                          )?.name
                        : 'Select product...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
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
                              setSelectedProductId(
                                article.id === selectedProductId
                                  ? ''
                                  : article.id,
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedProductId === article.id
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
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Order</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
