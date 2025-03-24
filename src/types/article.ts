import { CartItem, OrderItem } from '@prisma/client';
import { Category } from './category';

export interface Article {
  id: string;
  name: string;
  unit: string;
  price: number;
  image: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category?: Category; // Optionnel si vous ne chargez pas la relation
  cartItems?: CartItem[]; // Optionnel si vous ne chargez pas cette relation
  orderItems?: OrderItem[]; // Optionnel si vous ne chargez pas cette relation
}

export interface ArticleGetDto {
  id: string;
  name: string;
  unit: string;
  price: number;
  image: string;
  description: string;
  categoryId: string;
  categoryName: string;
}

export interface ArticlePostDto {
  name: string;
  unit: string;
  price: number;
  image: string;
  description: string;
  categoryId: string;
}

export interface ArticlePutDto {
  id: string;
  name?: string;
  unit?: string;
  price?: number;
  image: string;
  description?: string;
  categoryName?: string;
}

export interface ArticleDeleteDto {
  id: string;
  name: string;
  image: string;
}