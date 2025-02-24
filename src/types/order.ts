import { z } from 'zod';

const OrderItemSchema = z.object({
  articleId: z.string().nonempty("L'identifiant de l'article est requis"),
  articleName: z.string().nonempty("Le nom de l'article est requis"),
  price: z.number().nonnegative('Le prix doit être un nombre non négatif'),
  quantity: z
    .number()
    .int()
    .positive('La quantité doit être un entier positif'),
  unit: z.string().nonempty('L\'unité est requise'),
});

export const OrderSchema = z.object({
  userId: z.string().nonempty("L'identifiant de l'utilisateur est requis"),
  total: z.number().nonnegative('Le total doit être un nombre non négatif'),
  orderItems: z
    .array(OrderItemSchema)
    .nonempty('Au moins un article est requis'),
});

export type OrderFormValues = z.infer<typeof OrderSchema>;

export type OrderItemSchema = z.infer<typeof OrderItemSchema>;

export interface OrderDetailsDTO {
  id: string;
  customerName: string;
  total: number;
  status: string;
  items: OrderItemDTO[];
}

interface OrderItemDTO {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ordersDTO {
  id: string;
  customerName: string;
  total: number;
  nbArticles: number;
  status: string;
}

export interface ordersPostDTO {
  customerName: string;
  total: number;
  status: string;
}
