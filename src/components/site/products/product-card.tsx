import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArticleGetDto } from '@/types/article';
import { useState } from 'react';
import { Loading } from '@/components/loading';

type ProductCardProps = {
	article: ArticleGetDto;
	onAddToCart: (article: ArticleGetDto) => Promise<void>;
};

export function ProductCard({ article, onAddToCart }: ProductCardProps) {
	const [isLoadingAddCartItem, setIslLoadingAddCartItem] = useState(false);
	return (
		<Card key={article.id} className="overflow-hidden">
			<div className="aspect-video relative">
				<Image
					src={article.image}
					alt={article.name}
					loading="lazy"
					quality={75}
					fill
					className="object-cover"
				/>
			</div>
			<CardHeader>
				<CardTitle className="flex justify-between items-center">
					<span>{article.name}</span>
					<span className="text-lg font-bold">
						{article.price.toFixed(2)}€ / {article.unit}
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">{article.description}</p>
				<Badge className="mt-2">{article.categoryName}</Badge>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button
					disabled={isLoadingAddCartItem}
					onClick={() => {
						setIslLoadingAddCartItem(true);
						onAddToCart(article).finally(() =>
							setIslLoadingAddCartItem(false),
						);
					}}>
					{isLoadingAddCartItem ? <Loading /> : 'Ajouter au panier'}
				</Button>
			</CardFooter>
		</Card>
	);
}
