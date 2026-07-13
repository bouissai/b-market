'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { RecipeCardDto, RecipeDeleteDto } from '@/types/recipe';
import { Pencil, Trash } from 'lucide-react';

type RecipeTableProps = {
	data: RecipeCardDto[];
	onEdit: (recipe: RecipeCardDto) => void;
	onDelete: (recipe: RecipeDeleteDto) => void;
};

function formatTime(minutes: number) {
	if (minutes < 60) return `${minutes} min`;
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function RecipeTable({ data, onEdit, onDelete }: RecipeTableProps) {
	if (data.length === 0) {
		return (
			<div className="py-10 text-center text-sm text-muted-foreground">
				Aucune recette enregistrée.
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full min-w-[900px] text-sm">
				<thead>
					<tr className="border-b text-left">
						<th className="py-3 pr-4 font-medium">Image</th>
						<th className="py-3 pr-4 font-medium">Titre</th>
						<th className="py-3 pr-4 font-medium">Catégorie</th>
						<th className="py-3 pr-4 font-medium">Difficulté</th>
						<th className="py-3 pr-4 font-medium">Portions</th>
						<th className="py-3 pr-4 font-medium">Temps</th>
						<th className="py-3 pr-4 font-medium">Statuts</th>
						<th className="py-3 pr-4 text-right font-medium">Actions</th>
					</tr>
				</thead>
				<tbody>
					{data.map(recipe => (
						<tr key={recipe.id} className="border-b last:border-0">
							<td className="py-3 pr-4">
								<div className="relative h-14 w-20 overflow-hidden rounded-md bg-muted">
									<Image
										src={recipe.image || '/images/no-img.png'}
										alt={recipe.title}
										fill
										sizes="80px"
										className="object-cover"
									/>
								</div>
							</td>
							<td className="py-3 pr-4">
								<div className="font-medium">{recipe.title}</div>
								<div className="text-xs text-muted-foreground">
									{recipe.availableProductCount}/{recipe.ingredientCount} produits
								</div>
							</td>
							<td className="py-3 pr-4">{recipe.category}</td>
							<td className="py-3 pr-4 capitalize">{recipe.difficulty}</td>
							<td className="py-3 pr-4">{recipe.servings}</td>
							<td className="py-3 pr-4">
								{formatTime(recipe.prepTime + recipe.cookTime)}
							</td>
							<td className="py-3 pr-4">
								<div className="flex flex-wrap gap-1">
									{recipe.featured && <Badge>En avant</Badge>}
									{recipe.forEvents && <Badge variant="outline">Événement</Badge>}
									{!recipe.featured && !recipe.forEvents && (
										<span className="text-muted-foreground">Standard</span>
									)}
								</div>
							</td>
							<td className="py-3 pr-0 text-right">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onEdit(recipe)}
									aria-label={`Modifier ${recipe.title}`}>
									<Pencil className="h-4 w-4" aria-hidden="true" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() =>
										onDelete({
											id: recipe.id,
											title: recipe.title,
											image: recipe.image,
										})
									}
									aria-label={`Supprimer ${recipe.title}`}>
									<Trash className="h-4 w-4 text-red-500" aria-hidden="true" />
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
