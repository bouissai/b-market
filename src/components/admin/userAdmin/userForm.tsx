'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/store/useUserStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { UserPut, UserPost } from '@/types/user';

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+]?[0-9]{10,15}$/.test(val), {
      message: 'Numéro de téléphone invalide',
    }),
});

interface UserFormProps {
  user?: UserPut | null;
  onCloseAction: () => void;
  onSaveAction: (user: UserPut | UserPost) => Promise<void>;
}

export default function UserForm({
  user,
  onCloseAction,
  onSaveAction,
}: UserFormProps) {
  const { isSubmitting } = useUserStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone ?? '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (user) {
        await onSaveAction({ id: user.id, ...values });
      } else {
        await onSaveAction(values);
      }

      toast({
        title: 'Succès',
        description: user
          ? 'Utilisateur modifié avec succès'
          : 'Utilisateur ajouté avec succès',
      });
      onCloseAction();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Une erreur s'est produite lors de l'enregistrement.",
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open onOpenChange={onCloseAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {user ? "Modifier l'utilisateur" : 'Ajouter un utilisateur'}
          </DialogTitle>
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
                    <Input placeholder="Nom de l'utilisateur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email de l'utilisateur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="Téléphone (optionnel)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Enregistrement...'
                : user
                ? 'Modifier'
                : 'Ajouter'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
