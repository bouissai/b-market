'use client';

import type { RecipeCardDto, RecipeDifficulty } from '@/types/recipe';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RecipeGrid from '@/components/site/recipe/recipe-grid';
import RecipeFilters, {
	type RecipeFilterState,
} from '@/components/site/recipe/recipe-filters';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChefHat, Clock, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useQueryState } from 'nuqs';

type RecipesPageClientProps = {
	recipes: RecipeCardDto[];
};

function applyFilters(
	recipes: RecipeCardDto[],
	filters: RecipeFilterState,
	forEvents: boolean,
): RecipeCardDto[] {
	return recipes.filter(recipe => {
		if (recipe.forEvents !== forEvents) return false;

		if (
			filters.search &&
			!recipe.title.toLowerCase().includes(filters.search.toLowerCase()) &&
			!recipe.description.toLowerCase().includes(filters.search.toLowerCase())
		) {
			return false;
		}

		if (
			filters.difficulties.length > 0 &&
			!filters.difficulties.includes(recipe.difficulty)
		) {
			return false;
		}

		if (
			filters.categories.length > 0 &&
			!filters.categories.includes(recipe.category)
		) {
			return false;
		}

		if (filters.featuredOnly && !recipe.featured) {
			return false;
		}

		return true;
	});
}

export default function RecipesPageClient({ recipes }: RecipesPageClientProps) {
	const [search, setSearch] = useQueryState('search', { defaultValue: '' });
	const [difficulties, setDifficulties] = useQueryState('difficulty', {
		defaultValue: '',
	});
	const [categories, setCategories] = useQueryState('category', {
		defaultValue: '',
	});
	const [featuredOnly, setFeaturedOnly] = useQueryState('featured', {
		defaultValue: '',
	});
	const [tab, setTab] = useQueryState('tab', { defaultValue: 'general' });

	const filters: RecipeFilterState = useMemo(
		() => ({
			search: search ?? '',
			difficulties: (difficulties
				? difficulties.split(',').filter(Boolean)
				: []) as RecipeDifficulty[],
			categories: categories ? categories.split(',').filter(Boolean) : [],
			featuredOnly: featuredOnly === 'true',
		}),
		[categories, difficulties, featuredOnly, search],
	);

	const availableCategories = useMemo(
		() => [...new Set(recipes.map(r => r.category))],
		[recipes],
	);

	const generalRecipes = useMemo(
		() => applyFilters(recipes, filters, false),
		[recipes, filters],
	);

	const eventRecipes = useMemo(
		() => applyFilters(recipes, filters, true),
		[recipes, filters],
	);

	const handleDifficultyToggle = (difficulty: RecipeDifficulty) => {
		const current = filters.difficulties;
		const next = current.includes(difficulty)
			? current.filter(d => d !== difficulty)
			: [...current, difficulty];
		setDifficulties(next.length > 0 ? next.join(',') : null);
	};

	const handleCategoryToggle = (category: string) => {
		const current = filters.categories;
		const next = current.includes(category)
			? current.filter(c => c !== category)
			: [...current, category];
		setCategories(next.length > 0 ? next.join(',') : null);
	};

	const handleReset = () => {
		setSearch(null);
		setDifficulties(null);
		setCategories(null);
		setFeaturedOnly(null);
	};

	return (
		<>
			<section className="bg-muted/30 py-4 box-border">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl">
						<h1 className="text-3xl md:text-4xl font-bold mb-4">
							Nos Recettes
						</h1>
						<p className="text-muted-foreground mb-6">
							Découvrez notre sélection de recettes délicieuses préparées
							avec nos viandes de qualité. De l&apos;entrée au plat principal,
							pour le quotidien ou pour vos événements spéciaux.
						</p>
						<div className="flex flex-wrap gap-4">
							<div className="flex items-center gap-2 bg-background rounded-full px-4 py-2 text-sm">
								<ChefHat className="h-4 w-4 text-primary" aria-hidden="true" />
								<span>Recettes testées et approuvées</span>
							</div>
							<div className="flex items-center gap-2 bg-background rounded-full px-4 py-2 text-sm">
								<Clock className="h-4 w-4 text-primary" aria-hidden="true" />
								<span>Temps de préparation précis</span>
							</div>
							<div className="flex items-center gap-2 bg-background rounded-full px-4 py-2 text-sm">
								<Users className="h-4 w-4 text-primary" aria-hidden="true" />
								<span>Portions adaptables</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-12 box-border">
				<div className="container mx-auto px-4">
					<Tabs
						value={tab ?? 'general'}
						onValueChange={value => setTab(value)}
						className="space-y-8">
						<TabsList>
							<TabsTrigger value="general">
								Recettes du quotidien
							</TabsTrigger>
							<TabsTrigger value="events">
								Recettes pour événements
							</TabsTrigger>
						</TabsList>

						<TabsContent value="general" className="space-y-8">
							<div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
								<RecipeFilters
									filters={filters}
									availableCategories={availableCategories}
									onSearchChange={setSearch}
									onDifficultyToggle={handleDifficultyToggle}
									onCategoryToggle={handleCategoryToggle}
									onFeaturedToggle={checked =>
										setFeaturedOnly(checked ? 'true' : null)
									}
									onReset={handleReset}
								/>
								<div className="space-y-8">
									<div>
										<h2 className="text-2xl font-semibold mb-6">
											Recettes du quotidien
										</h2>
										<RecipeGrid
											recipes={generalRecipes}
											emptyMessage="Aucune recette ne correspond à vos critères. Essayez de réinitialiser les filtres."
										/>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="events" className="space-y-8">
							<div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
								<RecipeFilters
									filters={filters}
									availableCategories={availableCategories}
									onSearchChange={setSearch}
									onDifficultyToggle={handleDifficultyToggle}
									onCategoryToggle={handleCategoryToggle}
									onFeaturedToggle={checked =>
										setFeaturedOnly(checked ? 'true' : null)
									}
									onReset={handleReset}
								/>
								<div className="space-y-8">
									<div>
										<h2 className="text-2xl font-semibold mb-6">
											Recettes pour vos événements
										</h2>
										<p className="text-muted-foreground mb-6">
											Des recettes parfaites pour vos grandes tablées, fêtes
											et célébrations.
										</p>
										<RecipeGrid
											recipes={eventRecipes}
											emptyMessage="Aucune recette événement ne correspond à vos critères."
										/>
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</section>

			<section className="py-12">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-2xl font-bold mb-4">
						Besoin d&apos;inspiration pour un événement spécial ?
					</h2>
					<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
						Consultez notre page événements pour découvrir nos services de
						viande sur mesure pour vos mariages, fêtes religieuses et autres
						célébrations.
					</p>
					<Button asChild size="lg">
						<Link href="/events">Découvrir nos services événements</Link>
					</Button>
				</div>
			</section>
		</>
	);
}
