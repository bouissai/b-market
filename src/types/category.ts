import { Article } from './article';

export interface Category {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	articles?: Article[];
}
