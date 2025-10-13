import type { Metadata } from 'next';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RecipeGrid from '@/components/site/recipe/recipe-grid';
import RecipeFilters from '@/components/site/recipe/recipe-filters';
import { Button } from '@/components/ui/button';
import { Bookmark, ChefHat, Clock, Users } from 'lucide-react';

export const metadata: Metadata = {
	title: 'Recettes | Votre Boucherie',
	description:
		'Découvrez nos délicieuses recettes à base de viande fraîche et de qualité',
};

// Données statiques pour les recettes
const recipes = [
	{
		id: '1',
		title: "Tajine d'agneau aux pruneaux",
		description: 'Un plat traditionnel marocain savoureux et parfumé',
		image: '/placeholder.svg?height=300&width=400',
		category: 'plat-principal',
		prepTime: 30,
		cookTime: 120,
		servings: 4,
		difficulty: 'moyen',
		tags: ['agneau', 'oriental', 'mijoté'],
		featured: true,
		forEvents: false,
		ingredients: [
			{
				id: '1',
				name: "Épaule d'agneau",
				quantity: '800g',
				available: true,
			},
			{ id: '2', name: 'Oignons', quantity: '2', available: true },
			{ id: '3', name: 'Pruneaux', quantity: '200g', available: true },
			{
				id: '4',
				name: 'Miel',
				quantity: '2 cuillères à soupe',
				available: true,
			},
			{
				id: '5',
				name: 'Épices à tajine',
				quantity: '1 sachet',
				available: true,
			},
		],
	},
	{
		id: '2',
		title: 'Bœuf Bourguignon',
		description: 'Un classique de la cuisine française, tendre et savoureux',
		image: '/placeholder.svg?height=300&width=400',
		category: 'plat-principal',
		prepTime: 30,
		cookTime: 180,
		servings: 6,
		difficulty: 'moyen',
		tags: ['boeuf', 'français', 'mijoté'],
		featured: true,
		forEvents: false,
		ingredients: [
			{ id: '1', name: 'Paleron de bœuf', quantity: '1kg', available: true },
			{ id: '2', name: 'Lardons', quantity: '200g', available: true },
			{ id: '3', name: 'Carottes', quantity: '4', available: true },
			{ id: '4', name: 'Oignons', quantity: '2', available: true },
			{ id: '5', name: 'Vin rouge', quantity: '75cl', available: false },
		],
	},
	{
		id: '3',
		title: 'Poulet rôti aux herbes',
		description: 'Un poulet juteux et parfumé, idéal pour un repas familial',
		image: '/placeholder.svg?height=300&width=400',
		category: 'plat-principal',
		prepTime: 15,
		cookTime: 75,
		servings: 4,
		difficulty: 'facile',
		tags: ['poulet', 'rôti', 'familial'],
		featured: true,
		forEvents: false,
		ingredients: [
			{
				id: '1',
				name: 'Poulet fermier',
				quantity: '1.5kg',
				available: true,
			},
			{
				id: '2',
				name: 'Thym',
				quantity: 'quelques branches',
				available: true,
			},
			{
				id: '3',
				name: 'Romarin',
				quantity: 'quelques branches',
				available: true,
			},
			{ id: '4', name: 'Ail', quantity: '4 gousses', available: true },
			{ id: '5', name: 'Citron', quantity: '1', available: true },
		],
	},
	{
		id: '4',
		title: 'Couscous royal',
		description: 'Un plat convivial et généreux pour régaler famille et amis',
		image: '/placeholder.svg?height=300&width=400',
		category: 'plat-principal',
		prepTime: 45,
		cookTime: 120,
		servings: 8,
		difficulty: 'moyen',
		tags: ['agneau', 'poulet', 'merguez', 'oriental'],
		featured: false,
		forEvents: true,
		ingredients: [
			{
				id: '1',
				name: "Épaule d'agneau",
				quantity: '800g',
				available: true,
			},
			{ id: '2', name: 'Poulet', quantity: '1', available: true },
			{ id: '3', name: 'Merguez', quantity: '8', available: true },
			{ id: '4', name: 'Semoule', quantity: '500g', available: true },
			{
				id: '5',
				name: 'Légumes à couscous',
				quantity: 'assortiment',
				available: true,
			},
		],
	},
	{
		id: '5',
		title: "Méchoui d'agneau",
		description: 'Un plat traditionnel parfait pour les grandes occasions',
		image: '/placeholder.svg?height=300&width=400',
		category: 'plat-principal',
		prepTime: 60,
		cookTime: 240,
		servings: 12,
		difficulty: 'difficile',
		tags: ['agneau', 'oriental', 'événement'],
		featured: false,
		forEvents: true,
		ingredients: [
			{
				id: '1',
				name: 'Agneau entier',
				quantity: '1 (environ 15kg)',
				available: true,
			},
			{ id: '2', name: 'Ail', quantity: '20 gousses', available: true },
			{ id: '3', name: 'Cumin', quantity: '50g', available: true },
			{ id: '4', name: 'Paprika', quantity: '50g', available: true },
			{ id: '5', name: "Huile d'olive", quantity: '250ml', available: true },
		],
	},
	{
		id: '6',
		title: 'Brochettes mixtes',
		description: 'Assortiment de viandes marinées pour un barbecue réussi',
		image: '/placeholder.svg?height=300&width=400',
		category: 'plat-principal',
		prepTime: 30,
		cookTime: 15,
		servings: 10,
		difficulty: 'facile',
		tags: ['boeuf', 'poulet', 'agneau', 'barbecue', 'événement'],
		featured: false,
		forEvents: true,
		ingredients: [
			{ id: '1', name: 'Filet de bœuf', quantity: '500g', available: true },
			{
				id: '2',
				name: 'Blanc de poulet',
				quantity: '500g',
				available: true,
			},
			{ id: '3', name: "Gigot d'agneau", quantity: '500g', available: true },
			{ id: '4', name: 'Poivrons', quantity: '3', available: true },
			{ id: '5', name: 'Oignons', quantity: '2', available: true },
		],
	},
	{
		id: '7',
		title: 'Kefta grillée',
		description:
			"Boulettes de viande hachée aux épices, idéales pour l'apéritif",
		image: '/placeholder.svg?height=300&width=400',
		category: 'entrée',
		prepTime: 20,
		cookTime: 10,
		servings: 6,
		difficulty: 'facile',
		tags: ['boeuf', 'agneau', 'oriental', 'apéritif'],
		featured: true,
		forEvents: false,
		ingredients: [
			{
				id: '1',
				name: 'Viande hachée (bœuf et agneau)',
				quantity: '500g',
				available: true,
			},
			{ id: '2', name: 'Oignon', quantity: '1', available: true },
			{ id: '3', name: 'Persil', quantity: '1 bouquet', available: true },
			{
				id: '4',
				name: 'Cumin',
				quantity: '1 cuillère à café',
				available: true,
			},
			{
				id: '5',
				name: 'Paprika',
				quantity: '1 cuillère à café',
				available: true,
			},
		],
	},
	{
		id: '8',
		title: 'Pastilla au poulet',
		description: 'Un plat festif sucré-salé pour impressionner vos invités',
		image: '/placeholder.svg?height=300&width=400',
		category: 'plat-principal',
		prepTime: 60,
		cookTime: 45,
		servings: 8,
		difficulty: 'difficile',
		tags: ['poulet', 'oriental', 'événement'],
		featured: false,
		forEvents: true,
		ingredients: [
			{ id: '1', name: 'Poulet', quantity: '1.5kg', available: true },
			{ id: '2', name: 'Amandes', quantity: '200g', available: true },
			{ id: '3', name: 'Œufs', quantity: '6', available: true },
			{
				id: '4',
				name: 'Feuilles de brick',
				quantity: '12',
				available: true,
			},
			{
				id: '5',
				name: 'Cannelle',
				quantity: '1 cuillère à café',
				available: true,
			},
		],
	},
];

export default function RecipesPage() {
	// Filtrer les recettes par catégorie
	const featuredRecipes = recipes.filter(recipe => recipe.featured);
	const eventRecipes = recipes.filter(recipe => recipe.forEvents);

	return (
		<>
			{/* Hero section */}
			<section className="bg-muted/30  py-4 box-border">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl">
						<h1 className="text-3xl md:text-4xl font-bold mb-4  ">
							Nos Recettes
						</h1>
						<p className="text-muted-foreground mb-6">
							Découvrez notre sélection de recettes délicieuses préparées
							avec nos viandes de qualité. De l&apos;entrée au plat principal,
							pour le quotidien ou pour vos événements spéciaux.
						</p>
						<div className="flex flex-wrap gap-4">
							<div className="flex items-center gap-2 bg-background rounded-full px-4 py-2 text-sm">
								<ChefHat className="h-4 w-4 text-primary" />
								<span>Recettes testées et approuvées</span>
							</div>
							<div className="flex items-center gap-2 bg-background rounded-full px-4 py-2 text-sm">
								<Clock className="h-4 w-4 text-primary" />
								<span>Temps de préparation précis</span>
							</div>
							<div className="flex items-center gap-2 bg-background rounded-full px-4 py-2 text-sm">
								<Users className="h-4 w-4 text-primary" />
								<span>Portions adaptables</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Main content */}
			<section className="py-12 box-border">
				<div className="container mx-auto px-4">
					<Tabs defaultValue="general" className="space-y-8">
						<div className="flex justify-between items-center">
							<TabsList>
								<TabsTrigger value="general">
									Recettes du quotidien
								</TabsTrigger>
								<TabsTrigger value="events">
									Recettes pour événements
								</TabsTrigger>
							</TabsList>

							<Button
								variant="outline"
								size="sm"
								className="hidden sm:flex items-center gap-2">
								<Bookmark className="h-4 w-4" />
								Mes recettes sauvegardées
							</Button>
						</div>

						<TabsContent value="general" className="space-y-8">
							<div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
								<RecipeFilters />

								<div className="space-y-8">
									<div>
										<h2 className="text-2xl font-semibold mb-6">
											Recettes recommandées
										</h2>
										<RecipeGrid recipes={featuredRecipes} />
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="events" className="space-y-8">
							<div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
								<RecipeFilters forEvents={true} />

								<div className="space-y-8">
									<div>
										<h2 className="text-2xl font-semibold mb-6">
											Recettes pour vos événements
										</h2>
										<p className="text-muted-foreground mb-6">
											Des recettes parfaites pour vos grandes
											tablées, fêtes et célébrations. Idéales pour
											impressionner vos invités et partager des
											moments conviviaux.
										</p>
										<RecipeGrid recipes={eventRecipes} />
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</section>

			{/* CTA section */}
			<section className="py-12">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-2xl font-bold mb-4">
						Besoin d&apos;inspiration pour un événement spécial ?
					</h2>
					<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
						Consultez notre page événements pour découvrir nos services de
						viande sur mesure pour vos mariages, fêtes religieuses et
						autres célébrations.
					</p>
					<Button asChild size="lg">
						<Link href="/events">Découvrir nos services événements</Link>
					</Button>
				</div>
			</section>
		</>
	);
}
