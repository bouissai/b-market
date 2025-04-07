import { Article } from './article';

export interface Category {
	id: string;
	name: string;
	image: string;
	description?: string;
	featured: boolean;
	createdAt: Date;
	updatedAt: Date;
	articles?: Article[];
}
