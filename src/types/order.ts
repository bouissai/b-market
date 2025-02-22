import { z } from "zod";

export interface Order {
    id: string;
    userId: string;
    user: {
        id: string;
        name: string;
    };
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
    article: {
        id: string;
        name: string;
        unit: string;
        // autres propriétés de l'article si nécessaire
    };
    quantity: number;
    price: number;
}

export const OrderSchema = z.object({
    userName: z.string().nonempty("Le nom d'utilisateur est requis"),
    total: z.number().nonnegative("Le total doit être un nombre non négatif"),
    orderItems: z
      .array(
        z.object({
          articleId: z.string().nonempty("L'id de l'article est requis"),
          articleName: z.string().nonempty("Le nom de l'article est requis"),
          quantity: z.number().int().positive("La quantité doit être un entier positif"),
        }),
      )
      .nonempty("Au moins un article est requis"),
  })

  export type OrderFormValues = z.infer<typeof OrderSchema>

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
