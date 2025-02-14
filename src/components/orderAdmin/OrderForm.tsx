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

export default function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
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
// 'use client';

// import { Button } from '@/components/ui/button';
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from '@/components/ui/command';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Check, ChevronsUpDown } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useFieldArray, useForm } from 'react-hook-form';
// import { z } from 'zod';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// const availableProducts: Product[] = [
//   { id: 'prod1', name: 'Laptop', price: 999.99 },
//   { id: 'prod2', name: 'Smartphone', price: 599.99 },
//   { id: 'prod3', name: 'Headphones', price: 149.99 },
//   { id: 'prod4', name: 'Tablet', price: 399.99 },
//   { id: 'prod5', name: 'Smartwatch', price: 249.99 },
//   { id: 'prod6', name: 'Headphones2', price: 149.99 },
//   { id: 'prod7', name: 'Tablet2', price: 399.99 },
//   { id: 'prod8', name: 'Smartwatch2', price: 249.99 },
// ];

// interface OrderFormProps {
//   onSubmit: (order: OrderFormValues) => Promise<void>;
//   onCancel: () => void;
// }

// const OrderSchema = z.object({
//   userName: z.string().nonempty('User name is required'),
//   total: z.number().nonnegative('Total must be a non-negative number'),
//   orderItems: z
//     .array(
//       z.object({
//         articleName: z.string().nonempty('Article name is required'),
//         quantity: z
//           .number()
//           .int()
//           .positive('Quantity must be a positive integer'),
//       }),
//     )
//     .nonempty('At least one item is required'),
// });

// type OrderFormValues = z.infer<typeof OrderSchema>;

// export default function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
//   const [open, setOpen] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState<string>('');

//   const form = useForm<OrderFormValues>({
//     resolver: zodResolver(OrderSchema),
//     defaultValues: {
//       userName: '',
//       total: 0,
//       orderItems: [],
//     },
//   });

//   const {
//     fields: itemFields,
//     append,
//     remove,
//   } = useFieldArray({
//     control: form.control,
//     name: 'orderItems',
//   });

//   const handleAddItem = () => {
//     const productToAdd = availableProducts.find(
//       (p) => p.id === selectedProductId,
//     );
//     if (productToAdd) {
//       append({ articleName: productToAdd.name, quantity: 1 });
//       setSelectedProductId('');
//       setOpen(false);
//       calculateTotal();
//     }
//   };

//   const calculateTotal = () => {
//     const total = form.getValues().orderItems.reduce((sum, item) => {
//       const product = availableProducts.find(
//         (p) => p.name === item.articleName,
//       );
//       return sum + item.quantity * (product?.price || 0);
//     }, 0);
//     form.setValue('total', total);
//   };

//   useEffect(() => {
//     calculateTotal();
//   }, [form.watch('orderItems'), form.getValues]);

//   const onFormSubmit = async (data: OrderFormValues) => {
//     try {
//       await onSubmit(data);
//       form.reset();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="userName"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>User Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter user name" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="orderItems"
//           render={() => (
//             <FormItem>
//               <FormLabel>Order Items</FormLabel>
//               <FormControl>
//                 <div className="flex flex-col space-y-2">
//                   <Popover open={open} onOpenChange={setOpen}>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         role="combobox"
//                         aria-expanded={open}
//                         className="w-full justify-between"
//                       >
//                         {selectedProductId
//                           ? availableProducts.find(
//                               (product) => product.id === selectedProductId,
//                             )?.name
//                           : 'Select a product...'}
//                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-full p-0">
//                       <Command>
//                         <CommandInput placeholder="Search product..." />
//                         <CommandList>
//                           <CommandEmpty>No product found.</CommandEmpty>
//                           <CommandGroup>
//                             {availableProducts.map((product) => (
//                               <CommandItem
//                                 key={product.id}
//                                 value={product.name}
//                                 onSelect={() => {
//                                   setSelectedProductId(
//                                     product.id === selectedProductId
//                                       ? ''
//                                       : product.id,
//                                   );
//                                   setOpen(false);
//                                 }}
//                               >
//                                 <Check
//                                   className={cn(
//                                     'mr-2 h-4 w-4',
//                                     selectedProductId === product.id
//                                       ? 'opacity-100'
//                                       : 'opacity-0',
//                                   )}
//                                 />
//                                 {product.name} - ${product.price.toFixed(2)}
//                               </CommandItem>
//                             ))}
//                           </CommandGroup>
//                         </CommandList>
//                       </Command>
//                     </PopoverContent>
//                   </Popover>
//                   <Button
//                     type="button"
//                     onClick={handleAddItem}
//                     disabled={!selectedProductId}
//                   >
//                     Add Selected Product
//                   </Button>
//                 </div>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {itemFields.map((field, index) => (
//           <FormField
//             key={field.id}
//             control={form.control}
//             name={`orderItems.${index}.quantity`}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>
//                   {form.getValues().orderItems[index].articleName}
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(Number.parseInt(e.target.value));
//                       calculateTotal();
//                     }}
//                     min={1}
//                   />
//                 </FormControl>
//                 <FormDescription>
//                   Price: $
//                   {availableProducts
//                     .find(
//                       (p) =>
//                         p.name ===
//                         form.getValues().orderItems[index].articleName,
//                     )
//                     ?.price.toFixed(2)}
//                 </FormDescription>
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   onClick={() => {
//                     remove(index);
//                     calculateTotal();
//                   }}
//                 >
//                   Remove
//                 </Button>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         ))}

//         <FormField
//           control={form.control}
//           name="total"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Total</FormLabel>
//               <FormControl>
//                 <div className="text-lg font-bold">
//                   ${Number(field.value).toFixed(2)}
//                 </div>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="flex justify-between">
//           <Button type="button" variant="outline" onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button type="submit">Create Order</Button>
//         </div>
//       </form>
//     </Form>
//   );
// }
