import RecipeCard from '@/components/user/recipe/recipe-card';

// Données statiques pour les recettes (normalement, ces données viendraient d'une base de données)
const recipes = [
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
      { id: '1', name: 'Poulet fermier', quantity: '1.5kg', available: true },
      { id: '2', name: 'Thym', quantity: 'quelques branches', available: true },
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
      { id: '1', name: "Épaule d'agneau", quantity: '800g', available: true },
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
];

type RelatedRecipesProps = {
  currentRecipeId: string;
  tags: string[];
};

export default function RelatedRecipes({
  currentRecipeId,
  tags,
}: RelatedRecipesProps) {
  // Filtrer les recettes similaires basées sur les tags communs
  const relatedRecipes = recipes
    .filter((recipe) => recipe.id !== currentRecipeId)
    .filter((recipe) => recipe.tags.some((tag) => tags.includes(tag)))
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedRecipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
