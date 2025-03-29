type NutritionInfo = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type RecipeNutritionProps = {
  nutrition: NutritionInfo;
  servings: number;
};

export default function RecipeNutrition({
  nutrition,
  servings,
}: RecipeNutritionProps) {
  // Calculer les valeurs par portion
  const perServing = {
    calories: Math.round(nutrition.calories / servings),
    protein: Math.round(nutrition.protein / servings),
    carbs: Math.round(nutrition.carbs / servings),
    fat: Math.round(nutrition.fat / servings),
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-muted/20 p-4 rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-1">Calories</p>
        <p className="text-xl font-semibold">{perServing.calories} kcal</p>
        <p className="text-xs text-muted-foreground">par portion</p>
      </div>

      <div className="bg-muted/20 p-4 rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-1">Protéines</p>
        <p className="text-xl font-semibold">{perServing.protein} g</p>
        <p className="text-xs text-muted-foreground">par portion</p>
      </div>

      <div className="bg-muted/20 p-4 rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-1">Glucides</p>
        <p className="text-xl font-semibold">{perServing.carbs} g</p>
        <p className="text-xs text-muted-foreground">par portion</p>
      </div>

      <div className="bg-muted/20 p-4 rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-1">Lipides</p>
        <p className="text-xl font-semibold">{perServing.fat} g</p>
        <p className="text-xs text-muted-foreground">par portion</p>
      </div>
    </div>
  );
}
