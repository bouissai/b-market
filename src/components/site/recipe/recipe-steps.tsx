type RecipeStepsProps = {
  steps: string[];
};

export default function RecipeSteps({ steps }: RecipeStepsProps) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            {index + 1}
          </div>
          <div className="pt-1">
            <p>{step}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
