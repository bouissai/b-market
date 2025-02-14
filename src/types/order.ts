import { z } from "zod";

export interface Order {
    id: string;
    userId: string;
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    orderItems?: OrderItem[]; // Optionnel si vous ne chargez pas cette relation
}

export interface OrderItem {
    id: string;
    orderId: string;
    articleId: string;
    quantity: number;
    price: number;
}

export const OrderSchema = z.object({
    userName: z.string().nonempty("Le nom d'utilisateur est requis"),
    total: z.number().nonnegative("Le total doit être un nombre non négatif"),
    orderItems: z
      .array(
        z.object({
          articleName: z.string().nonempty("Le nom de l'article est requis"),
          quantity: z.number().int().positive("La quantité doit être un entier positif"),
        }),
      )
      .nonempty("Au moins un article est requis"),
  })