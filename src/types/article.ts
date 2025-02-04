export interface Article {
    id: string;
    name: string;
    unit: string;
    price: number;
    image: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    categoryName: string;
    category?: Category; // Optionnel si vous ne chargez pas la relation
    cartItems?: CartItem[]; // Optionnel si vous ne chargez pas cette relation
    orderItems?: OrderItem[]; // Optionnel si vous ne chargez pas cette relation
}

export interface Category {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    articles?: Article[]; // Optionnel si vous ne chargez pas cette relation
}

export interface CartItem {
    id: string;
    cartId: string;
    articleId: string;
    article?: Article; // Optionnel si vous ne chargez pas cette relation
    quantity: number;
}

export interface OrderItem {
    id: string;
    orderId: string;
    articleId: string;
    article?: Article; // Optionnel si vous ne chargez pas cette relation
    quantity: number;
    price: number;
}
