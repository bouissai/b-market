'use client';

import type React from 'react';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

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

type RecipeCardProps = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const totalTime = recipe.prepTime + recipe.cookTime;

  // Fonction pour formater le temps en heures et minutes
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  // Fonction pour déterminer la couleur du badge de difficulté
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'moyen':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'difficile':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const toggleSaved = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSaved(!isSaved);
  };

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card
        className="overflow-hidden h-full transition-all duration-200 hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={recipe.image || '/placeholder.svg'}
            alt={recipe.title}
            fill
            className={cn(
              'object-cover transition-transform duration-300',
              isHovered && 'scale-105',
            )}
          />
          <button
            className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full hover:bg-background"
            onClick={toggleSaved}
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="pending" className="text-xs">
                {tag}
              </Badge>
            ))}
            <Badge
              className={cn('text-xs', getDifficultyColor(recipe.difficulty))}
            >
              {recipe.difficulty}
            </Badge>
          </div>

          <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {recipe.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatTime(totalTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{recipe.servings} pers.</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="h-4 w-4 text-muted-foreground" />
              <span>{recipe.ingredients.length} ingrédients</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full">Voir la recette</Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
