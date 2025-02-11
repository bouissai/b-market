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