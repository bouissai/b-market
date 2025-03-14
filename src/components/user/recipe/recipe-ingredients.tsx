import { Check } from 'lucide-react';

type Ingredient = {
  id: string;
  name: string;
  quantity: string;
  available: boolean;
};

type RecipeIngredientsProps = {
  ingredients: Ingredient[];
};

export default function RecipeIngredients({
  ingredients,
}: RecipeIngredientsProps) {
  return (
    <ul className="space-y-2">
      {ingredients.map((ingredient) => (
        <li
          key={ingredient.id}
          className="flex items-center justify-between py-2 border-b last:border-0"
        >
          <div className="flex items-center gap-2">
            {ingredient.available && (
              <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-3 w-3 text-primary" />
              </div>
            )}
            <span>{ingredient.name}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {ingredient.quantity}
          </span>
        </li>
      ))}
    </ul>
  );
}
