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
import { Slider } from '@/components/ui/slider';
import { Search } from 'lucide-react';
import { useState } from 'react';

type RecipeFiltersProps = {
  forEvents?: boolean;
};

export default function RecipeFilters({
  forEvents = false,
}: RecipeFiltersProps) {
  const [timeRange, setTimeRange] = useState([0, 180]);
  const [servingsRange, setServingsRange] = useState([2, 8]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Filtres</h3>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une recette..."
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="sm" className="w-full">
          Réinitialiser les filtres
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={['meat-type', 'time', 'servings', 'difficulty']}
      >
        <AccordionItem value="meat-type">
          <AccordionTrigger>Type de viande</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="beef" />
                <Label htmlFor="beef">Bœuf</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="lamb" />
                <Label htmlFor="lamb">Agneau</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="chicken" />
                <Label htmlFor="chicken">Poulet</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="turkey" />
                <Label htmlFor="turkey">Dinde</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="veal" />
                <Label htmlFor="veal">Veau</Label>
              </div>
              {forEvents && (
                <div className="flex items-center space-x-2">
                  <Checkbox id="whole-animal" />
                  <Label htmlFor="whole-animal">Animaux entiers</Label>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="time">
          <AccordionTrigger>Temps total</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                defaultValue={[0, 180]}
                max={forEvents ? 300 : 180}
                step={15}
                value={timeRange}
                onValueChange={setTimeRange}
              />              
              
              <div className="flex items-center justify-between">
                <span className="text-sm">{timeRange[0]} min</span>
                <span className="text-sm">{timeRange[1]} min</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="servings">
          <AccordionTrigger>Nombre de personnes</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                defaultValue={[2, 8]}
                min={2}
                max={forEvents ? 20 : 10}
                step={1}
                value={servingsRange}
                onValueChange={setServingsRange}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">{servingsRange[0]} pers.</span>
                <span className="text-sm">{servingsRange[1]} pers.</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="difficulty">
          <AccordionTrigger>Difficulté</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="easy" />
                <Label htmlFor="easy">Facile</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="medium" />
                <Label htmlFor="medium">Moyen</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hard" />
                <Label htmlFor="hard">Difficile</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cuisine">
          <AccordionTrigger>Type de cuisine</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="oriental" />
                <Label htmlFor="oriental">Orientale</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="french" />
                <Label htmlFor="french">Française</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mediterranean" />
                <Label htmlFor="mediterranean">Méditerranéenne</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="international" />
                <Label htmlFor="international">Internationale</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
