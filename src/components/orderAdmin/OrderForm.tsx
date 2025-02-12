'use client';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OrderShema } from '@/types/order';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface OrderFormProps {
  onSubmit: (values: z.infer<typeof OrderShema>) => Promise<void>;
  onCancel: () => void;
}

export default function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
  const form = useForm<z.infer<typeof OrderShema>>({
    resolver: zodResolver(OrderShema), // Apply the zodResolver
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User id</FormLabel>
              <FormControl>
                <Input placeholder="Hafid" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User id</FormLabel>
              <FormControl>
                <Input placeholder="En cours" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
