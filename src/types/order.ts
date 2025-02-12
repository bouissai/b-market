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

export const OrderShema = z.object({
    userId : z.string().nonempty(),
    total: z.number().nonnegative(),
    status: z.string().nonempty(),
    createdAt: z.date(),
    updatedAt: z.date(),
    orderItems: z.array(z.object({
        articleId: z.string().nonempty(),
        quantity: z.number().nonnegative(),
        price: z.number().nonnegative(),
    }))
});