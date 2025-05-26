import { z } from 'zod';

const OrderItemSchema = z.object({
	articleId: z.string().nonempty("L'identifiant de l'article est requis"),
	articleName: z.string().nonempty("Le nom de l'article est requis"),
	price: z.number().nonnegative('Le prix doit être un nombre non négatif'),
	quantity: z
		.number()
		.int()
		.positive('La quantité doit être un entier positif'),
	unit: z.string().nonempty("L'unité est requise"),
});

export const OrderSchema = z.object({
	userId: z.string().nonempty("L'identifiant de l'utilisateur est requis"),
	firstname: z.string(),
	lastname: z.string(),
	email: z.string().email("L'adresse email est invalide"),
	phone: z.string(),
	total: z.number().nonnegative('Le total doit être un nombre non négatif'),
	note: z.string(),
	orderItems: z
		.array(OrderItemSchema)
		.nonempty('Au moins un article est requis'),
});

export type OrderFormValues = z.infer<typeof OrderSchema>;

export type OrderItemSchema = z.infer<typeof OrderItemSchema>;

export interface OrderDetailsDTO {
	id: number;
	customerName: string;
	customerEmail: string;
	customerPhone?: string;
	date: Date;
	total: number;
	status: string;
	note: string | null;
	items: OrderItemDTO[];
}

interface OrderItemDTO {
	id: string;
	name: string;
	quantity: number;
	price: number;
	articleId?: string;
}

export interface orderDTO {
	id: number;
	customerName: string;
	total: number;
	nbArticles: number;
	status: keyof typeof OrderStatus;
}

export interface OrderSaveDTO {
	userId: string;
	total: number;
	note: string;
	status: keyof typeof OrderStatus;
	orderItems: OrderItemSaveDTO[];
	firstname?: string;
	lastname?: string;
	email?: string;
	phone?: string;
}

interface OrderItemSaveDTO {
	articleId: string;
	quantity: number;
	price: number;
}

export const OrderStatus = {
	PENDING: { status: 'En attente', color: 'pending', order: 1 },
	PREPARING: { status: 'En préparation', color: 'state', order: 2 },
	PENDING_PAYMENT: {
		status: 'En attente de paiement',
		color: 'info',
		order: 3,
	},
	CONFIRMED: { status: 'Confirmée', color: 'success', order: 4 },
	CANCELLED: { status: 'Annulée', color: 'destructive', order: 5 },
};
export type OrderStatusKey = keyof typeof OrderStatus;
