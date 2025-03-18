import RecipeCard from '@/components/user/recipe/recipe-card';

type Ingredient = {
  id: string;
  name: string;
  quantity: string;
  available: boolean;
};

type Recipe = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  tags: string[];
  featured: boolean;
  forEvents: boolean;
  ingredients: Ingredient[];
};

type RecipeGridProps = {
  recipes: Recipe[];
};

export default function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
