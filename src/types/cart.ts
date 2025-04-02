import { ArticleGetDto } from './article';

export type CartItem = {
	article: ArticleGetDto;
	quantity: number;
};
