import { ArticleGetDto } from './article';

export type CartItem = {
	article: Partial<ArticleGetDto>;
	quantity: number;
};

export type CartGetDto = {
	id: string;
	userId: string;
	cartItems: CartItem[];
};
