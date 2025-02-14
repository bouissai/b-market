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

export const articles: Article[] = [
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
