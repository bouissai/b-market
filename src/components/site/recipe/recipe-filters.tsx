'use client';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RecipeDifficulty } from '@/types/recipe';
import { Search } from 'lucide-react';

export type RecipeFilterState = {
	search: string;
	difficulties: RecipeDifficulty[];
	categories: string[];
	featuredOnly: boolean;
};

type RecipeFiltersProps = {
	filters: RecipeFilterState;
	availableCategories: string[];
	onSearchChange: (value: string) => void;
	onDifficultyToggle: (difficulty: RecipeDifficulty) => void;
	onCategoryToggle: (category: string) => void;
	onFeaturedToggle: (checked: boolean) => void;
	onReset: () => void;
};

const DIFFICULTIES: { id: RecipeDifficulty; label: string }[] = [
	{ id: 'facile', label: 'Facile' },
	{ id: 'moyen', label: 'Moyen' },
	{ id: 'difficile', label: 'Difficile' },
];

export default function RecipeFilters({
	filters,
	availableCategories,
	onSearchChange,
	onDifficultyToggle,
	onCategoryToggle,
	onFeaturedToggle,
	onReset,
}: RecipeFiltersProps) {
	const hasActiveFilters =
		filters.search.length > 0 ||
		filters.difficulties.length > 0 ||
		filters.categories.length > 0 ||
		filters.featuredOnly;

	return (
		<div className="space-y-6">
			<div>
				<h3 className="font-medium mb-4">Filtres</h3>
				<div className="relative mb-4">
					<Search
						className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
						aria-hidden="true"
					/>
					<Input
						type="search"
						placeholder="Rechercher une recette..."
						className="pl-8"
						value={filters.search}
						onChange={e => onSearchChange(e.target.value)}
						aria-label="Rechercher une recette"
					/>
				</div>
				<Button
					variant="outline"
					size="sm"
					className="w-full"
					onClick={onReset}
					disabled={!hasActiveFilters}>
					Réinitialiser les filtres
				</Button>
			</div>

			<Accordion type="multiple" defaultValue={['difficulty', 'category']}>
				<AccordionItem value="featured">
					<AccordionTrigger>Mise en avant</AccordionTrigger>
					<AccordionContent>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="featured-only"
								checked={filters.featuredOnly}
								onCheckedChange={checked =>
									onFeaturedToggle(checked === true)
								}
							/>
							<Label htmlFor="featured-only">Recettes recommandées</Label>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="difficulty">
					<AccordionTrigger>Difficulté</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-2">
							{DIFFICULTIES.map(({ id, label }) => (
								<div key={id} className="flex items-center space-x-2">
									<Checkbox
										id={`difficulty-${id}`}
										checked={filters.difficulties.includes(id)}
										onCheckedChange={() => onDifficultyToggle(id)}
									/>
									<Label htmlFor={`difficulty-${id}`}>{label}</Label>
								</div>
							))}
						</div>
					</AccordionContent>
				</AccordionItem>

				{availableCategories.length > 0 && (
					<AccordionItem value="category">
						<AccordionTrigger>Catégorie</AccordionTrigger>
						<AccordionContent>
							<div className="space-y-2">
								{availableCategories.map(category => (
									<div
										key={category}
										className="flex items-center space-x-2">
										<Checkbox
											id={`cat-${category}`}
											checked={filters.categories.includes(category)}
											onCheckedChange={() => onCategoryToggle(category)}
										/>
										<Label htmlFor={`cat-${category}`} className="capitalize">
											{category.replace('-', ' ')}
										</Label>
									</div>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				)}
			</Accordion>
		</div>
	);
}
