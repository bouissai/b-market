'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/store/useCartStore';
import type { RecipeIngredientDto } from '@/types/recipe';
import type { ArticleGetDto } from '@/types/article';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

type RecipeCartButtonProps = {
	ingredients: RecipeIngredientDto[];
};

export default function RecipeCartButton({
	ingredients,
}: RecipeCartButtonProps) {
	const { addRecipeItems } = useCartStore();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	const availableIngredients = ingredients.filter(
		i => i.available && i.article && i.cartQuantity,
	);
	const totalIngredients = ingredients.length;
	const availableCount = availableIngredients.length;

	const handleAddToCart = async () => {
		if (availableCount === 0 || isLoading) return;

		setIsLoading(true);
		try {
			const items = availableIngredients.map(ing => ({
				article: {
					id: ing.article!.id,
					name: ing.article!.name,
					unit: ing.article!.unit,
					price: ing.article!.price,
					image: ing.article!.image,
					description: '',
					categoryId: '',
					categoryName: ing.article!.categoryName,
				} satisfies ArticleGetDto,
				quantity: ing.cartQuantity!,
			}));

			const result = await addRecipeItems(items);

			const unavailable = ingredients.filter(i => !i.available);

			let description = '';
			if (result.added.length > 0) {
				description += result.added
					.map(a => `${a.name} (×${a.quantity})`)
					.join(', ');
			}
			if (unavailable.length > 0) {
				description += `\nNon ajoutés : ${unavailable.map(i => i.name).join(', ')}`;
			}
			if (result.errors.length > 0) {
				description += `\nErreurs : ${result.errors.map(e => e.reason).join(', ')}`;
			}

			toast({
				title:
					result.added.length > 0
						? 'Produits ajoutés au panier'
						: 'Aucun produit ajouté',
				description: description || undefined,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="print:hidden">
			<Button
				className="w-full mt-6 gap-2"
				onClick={handleAddToCart}
				disabled={availableCount === 0 || isLoading}
				aria-busy={isLoading}>
				<ShoppingCart className="h-4 w-4" aria-hidden="true" />
				{isLoading
					? 'Ajout en cours...'
					: 'Ajouter les produits disponibles au panier'}
			</Button>
			<p className="text-xs text-muted-foreground text-center mt-2">
				{availableCount > 0
					? `${availableCount} produit${availableCount > 1 ? 's' : ''} disponible${availableCount > 1 ? 's' : ''} sur ${totalIngredients} ingrédient${totalIngredients > 1 ? 's' : ''}`
					: 'Aucun ingrédient de cette recette n\'est disponible dans notre catalogue'}
			</p>
		</div>
	);
}
