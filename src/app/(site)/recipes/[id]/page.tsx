import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  Clock,
  Users,
  ChefHat,
  ShoppingCart,
  Printer,
  Share2,
  Bookmark,
} from 'lucide-react';
import RecipeIngredients from '@/components/user/recipe/recipe-ingredients';
import RecipeSteps from '@/components/user/recipe/recipe-steps';
import RecipeNutrition from '@/components/user/recipe/recipe-nutrition';
import RelatedRecipes from '@/components/user/recipe/related-recipes';

// Données statiques pour les recettes (normalement, ces données viendraient d'une base de données)
const recipes = [
  {
    id: '1',
    title: "Tajine d'agneau aux pruneaux",
    description: 'Un plat traditionnel marocain savoureux et parfumé',
    image: '/placeholder.svg?height=500&width=800',
    category: 'plat-principal',
    prepTime: 30,
    cookTime: 120,
    servings: 4,
    difficulty: 'moyen',
    tags: ['agneau', 'oriental', 'mijoté'],
    featured: true,
    forEvents: false,
    ingredients: [
      { id: '1', name: "Épaule d'agneau", quantity: '800g', available: true },
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
      {
        id: '6',
        name: "Huile d'olive",
        quantity: '3 cuillères à soupe',
        available: true,
      },
      { id: '7', name: 'Ail', quantity: '3 gousses', available: true },
      { id: '8', name: 'Cannelle', quantity: '1 bâton', available: true },
      {
        id: '9',
        name: 'Sel et poivre',
        quantity: 'à votre goût',
        available: true,
      },
    ],
    steps: [
      "Coupez l'épaule d'agneau en morceaux de taille moyenne.",
      "Dans une cocotte, faites chauffer l'huile d'olive et faites-y dorer la viande sur toutes les faces.",
      "Ajoutez les oignons émincés et l'ail écrasé, puis faites revenir jusqu'à ce qu'ils soient translucides.",
      'Ajoutez les épices à tajine, la cannelle, le sel et le poivre, puis mélangez bien.',
      "Versez de l'eau chaude jusqu'à couvrir légèrement la viande, puis couvrez et laissez mijoter à feu doux pendant 1h30.",
      'Ajoutez les pruneaux et le miel, puis poursuivez la cuisson pendant 30 minutes supplémentaires.',
      "Vérifiez l'assaisonnement et servez chaud, accompagné de semoule ou de pain.",
    ],
    nutrition: {
      calories: 450,
      protein: 35,
      carbs: 30,
      fat: 22,
    },
  },
];

type Props = {
  params: { id: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const recipe = recipes.find((r) => r.id === params.id);

  if (!recipe) {
    return {
      title: 'Recette non trouvée | Votre Boucherie',
    };
  }

  return {
    title: `${recipe.title} | Recettes | Votre Boucherie`,
    description: recipe.description,
  };
}

export default function RecipeDetailPage({ params }: Props) {
  const recipe = recipes.find((r) => r.id === params.id);

  if (!recipe) {
    notFound();
  }

  // Fonction pour formater le temps en heures et minutes
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/recipes">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Retour aux recettes
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div>
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {recipe.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {recipe.description}
              </p>

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Temps total</p>
                    <p className="font-medium">
                      {formatTime(recipe.prepTime + recipe.cookTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Portions</p>
                    <p className="font-medium">{recipe.servings} personnes</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Difficulté</p>
                    <p className="font-medium capitalize">
                      {recipe.difficulty}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Printer className="h-4 w-4" />
                  Imprimer
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Bookmark className="h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            </div>

            <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
              <Image
                src={recipe.image || '/placeholder.svg'}
                alt={recipe.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Préparation</h2>
                <RecipeSteps steps={recipe.steps} />
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Valeurs nutritionnelles
                </h2>
                <RecipeNutrition
                  nutrition={recipe.nutrition}
                  servings={recipe.servings}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="bg-muted/20 p-6 rounded-lg sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Ingrédients</h2>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Pour {recipe.servings} personnes
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{recipe.servings}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    +
                  </Button>
                </div>
              </div>

              <RecipeIngredients ingredients={recipe.ingredients} />

              <Button className="w-full mt-6 gap-2">
                <ShoppingCart className="h-4 w-4" />
                Ajouter au panier
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-2">
                Tous les ingrédients sont disponibles dans notre boucherie
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Recettes similaires</h2>
          <RelatedRecipes currentRecipeId={recipe.id} tags={recipe.tags} />
        </div>
      </div>
    </>
  );
}
