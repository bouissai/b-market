'use client';

import type { RecipeCardDto } from '@/types/recipe';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, Star, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';

type RecipeCardProps = {
	recipe: RecipeCardDto;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
	const totalTime = recipe.prepTime + recipe.cookTime;

	const formatTime = (minutes: number) => {
		if (minutes < 60) return `${minutes} min`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case 'facile':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
			case 'moyen':
				return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
			case 'difficile':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
		}
	};

	return (
		<Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md group">
			<Link
				href={`/recipes/${recipe.id}`}
				className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
				aria-label={`Voir la recette ${recipe.title}`}>
				<div className="relative aspect-video overflow-hidden">
					<Image
						src={recipe.image || '/images/no-img.png'}
						alt={recipe.title}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						className="object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					<div className="absolute top-2 left-2 flex gap-1">
						{recipe.featured && (
							<Badge className="bg-primary text-primary-foreground text-xs gap-1">
								<Star className="h-3 w-3" aria-hidden="true" />
								Recommandée
							</Badge>
						)}
						{recipe.forEvents && (
							<Badge variant="info" className="text-xs gap-1">
								<PartyPopper className="h-3 w-3" aria-hidden="true" />
								Événement
							</Badge>
						)}
					</div>
				</div>

				<CardContent className="p-4">
					<div className="flex flex-wrap gap-2 mb-2">
						{recipe.tags.slice(0, 3).map(tag => (
							<Badge key={tag} variant="pending" className="text-xs">
								{tag}
							</Badge>
						))}
						<Badge
							className={cn(
								'text-xs',
								getDifficultyColor(recipe.difficulty),
							)}>
							{recipe.difficulty}
						</Badge>
					</div>

					<h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
					<p className="text-sm text-muted-foreground line-clamp-2 mb-4">
						{recipe.description}
					</p>

					<div className="flex flex-wrap gap-4 text-sm">
						<div className="flex items-center gap-1">
							<Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
							<span>{formatTime(totalTime)}</span>
						</div>
						<div className="flex items-center gap-1">
							<Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
							<span>{recipe.servings} pers.</span>
						</div>
						<div className="flex items-center gap-1">
							<ChefHat className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
							<span>{recipe.ingredientCount} ingrédients</span>
						</div>
					</div>
				</CardContent>

				<CardFooter className="p-4 pt-0">
					<Button className="w-full" tabIndex={-1}>
						Voir la recette
					</Button>
				</CardFooter>
			</Link>
		</Card>
	);
}
