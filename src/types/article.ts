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
	category?: Category;
	cartItems?: CartItem[];
	orderItems?: OrderItem[];
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
