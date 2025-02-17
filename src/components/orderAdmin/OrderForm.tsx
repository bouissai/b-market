'use client';

import { Button } from '@/components/ui/button';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useArticles } from '@/hooks/useArticles';
import { cn } from '@/lib/utils';
import { OrderSchema } from '@/types/order';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { ScrollArea } from '../ui/scroll-area';

// Define the structure for each order item
interface OrderItem {
  articleId: string;
  articleName: string;
  quantity: number;
  unit: string;
  price: number;
}

// Define the structure of the form's data
interface OrderFormValues {
  userName: string;
  orderItems: OrderItem[];
  total: number;
}

// Define the component props
interface OrderFormProps {
  onSubmit: (values: z.infer<typeof OrderSchema>) => Promise<void>;
  onCancel: () => void;
}

export function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
  const { articles } = useArticles();
  // Track IDs of selected articles for UI feedback
  const [selectedArticlesIds, setSelectedArticlesIds] = useState<string[]>([]);

  // Initialize react-hook-form with default values and a zod resolver
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      userName: "",
      total: 0,
      orderItems: [],
    },
  });

  // useFieldArray manages the dynamic orderItems array
  const { fields: itemFields, remove, append } = useFieldArray({
    control: form.control,
    name: "orderItems",
  });

  // useWatch to track changes in orderItems for calculating the total
  const watchedOrderItems = useWatch({
    control: form.control,
    name: "orderItems",
  });

  // Compute the total order price using useMemo for performance optimization.
  // This recalculates only when watchedOrderItems change.
  const computedTotal = useMemo(() => {
    if (!watchedOrderItems || watchedOrderItems.length === 0) return 0;
    return watchedOrderItems.reduce((sum: number, item: OrderItem) => {
      return sum + item.price * item.quantity;
    }, 0);
  }, [watchedOrderItems]);

  // Whenever computedTotal changes, update the form value for total.
  useEffect(() => {
    form.setValue("total", computedTotal);
  }, [computedTotal, form]);

  // Handle selecting or deselecting an article
  const handleArticleSelect = useCallback(
    (articleId: string) => {
      // Check if the article is already selected
      const isSelected = selectedArticlesIds.includes(articleId);

      if (isSelected) {
        // Deselect: remove from selectedArticlesIds and remove from orderItems array
        setSelectedArticlesIds((prev) => prev.filter((id) => id !== articleId));
        const index = form.getValues().orderItems.findIndex(
          (item) => item.articleId === articleId
        );
        if (index !== -1) {
          remove(index);
        }
      } else {
        // Find the article details from the articles list
        const articleToAdd = articles.find((a) => a.id === articleId);
        if (articleToAdd) {
          // Add the article to selectedArticlesIds for UI indication
          setSelectedArticlesIds((prev) => [...prev, articleId]);
          // Create a new order item with a default quantity of 1
          const newOrderItem: OrderItem = {
            articleId: articleToAdd.id,
            articleName: articleToAdd.name,
            quantity: 1,
            unit: articleToAdd.unit,
            price: articleToAdd.price,
          };
          // Append the new item using useFieldArray's append method
          append(newOrderItem);
        } else {
          // Error handling: Log if the article is not found
          console.error(`Article with id ${articleId} not found.`);
        }
      }
    },
    [selectedArticlesIds, articles, form, remove, append]
  );

  return (
    <div className="w-full h-full">
      {/* Main ScrollArea for the entire form */}
      <ScrollArea className="w-full h-70">
        {/* Form wrapper integrated with react-hook-form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* User name input field */}
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input placeholder="Hafid" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Article selection field */}
            <FormField
              control={form.control}
              name="orderItems"
              render={() => (
                <FormItem className="flex flex-col">
                  <FormLabel>Articles</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between">
                        Selectionné produit...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Chercher produit..." />
                        <CommandList>
                          <CommandEmpty>No product found.</CommandEmpty>
                          <CommandGroup>
                            {articles.map((article) => (
                              <CommandItem
                                key={article.id}
                                value={article.name}
                                onSelect={() => handleArticleSelect(article.id)}
                              >
                                {/* Show checkmark if the article is selected */}
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedArticlesIds.includes(article.id) ? "opacity-100" : "opacity-0"
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

            {/* Scrollable list of selected order items */}
            <ScrollArea className="w-full h-80">
              <div className="space-y-2">
                {itemFields.map((field, index) => {
                  // Retrieve the current item values
                  const item = form.getValues().orderItems[index];
                  const itemTotal = item.price * item.quantity;

                  return (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`orderItems.${index}.quantity`}
                      render={({ field: quantityField }) => (
                        <FormItem>
                          <div className="flex justify-between items-center gap-x-4 p-2 border rounded-md">
                            {/* Display article name */}
                            <div className="w-1/4 font-medium">{item.articleName}</div>
                            <div className="flex items-center gap-x-2">
                              <FormControl>
                                {/* Quantity input */}
                                <Input
                                  type="number"
                                  {...quantityField}
                                  onChange={(e) => {
                                    // Parse input ensuring a valid number (minimum 1)
                                    let newValue = Number.parseInt(e.target.value);
                                    if (isNaN(newValue) || newValue < 1) {
                                      newValue = 1;
                                    }
                                    quantityField.onChange(newValue);
                                  }}
                                  min={1}
                                  className="w-20"
                                />
                              </FormControl>
                              {/* Display unit */}
                              <span className="w-12">{item.unit}</span>
                            </div>
                            <div className="flex items-center gap-x-4">
                              {/* Display price per unit */}
                              <span className="text-sm text-gray-500">
                                {item.price.toFixed(2)}€/{item.unit}
                              </span>
                              {/* Display total price for the current item */}
                              <div className="w-24 text-right font-medium">
                                {itemTotal.toFixed(2)}€
                              </div>
                            </div>
                            {/* Remove item button */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // Remove article from selected list and order items
                                setSelectedArticlesIds((prev) =>
                                  prev.filter((id) => id !== item.articleId)
                                );
                                remove(index);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormItem>
                      )}
                    />
                  );
                })}
              </div>
            </ScrollArea>

            {/* Display total price of the order */}
            {itemFields.length > 0 && (
              <div className="flex justify-end items-center gap-x-2 pt-4 border-t">
                <span className="font-medium">Total:</span>
                <span className="text-lg font-bold">
                  {computedTotal.toFixed(2)}€
                </span>
              </div>
            )}

            {/* Footer with Cancel and Submit buttons */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Nouvelle commande</Button>
            </DialogFooter>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
}

export default OrderForm;
