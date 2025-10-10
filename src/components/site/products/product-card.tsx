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
		<div className="group cursor-pointer">
		  <div className="relative aspect-[3/4] overflow-hidden bg-muted/30 mb-4">
			<Image
			  src={article.image || "/placeholder.svg"}
			  alt={article.name}
			  fill
			  className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
			/>

		  </div>
		  <div className="space-y-2">
			<h3 className="font-sans text-lg md:text-xl font-light text-foreground tracking-wide text-balance">
			  {article.name}
			</h3>
			<p className="text-sm text-muted-foreground font-light line-clamp-2 leading-relaxed">{article.description}</p>
			<div className="flex items-baseline gap-2 pt-1">
			  <span className="text-xl md:text-2xl font-light text-foreground tracking-wide">{article.price}€</span>
			  <span className="text-sm text-muted-foreground font-light">/ {article.unit}</span>
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
			</div>
			
		  </div>
		</div>
	  )
}
