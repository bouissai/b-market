import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatsResponse } from "@/types/stats";
import { BarChart3 } from "lucide-react";

export function RevenueGrowth(stats: StatsResponse | null){

    return (
        <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Évolution des ventes</CardTitle>
          <CardDescription>Chiffre d'affaires sur la période</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Graphique d'évolution des ventes</p>
              <p className="text-xs text-muted-foreground mt-1">Données visualisées pour la période sélectionnée</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
}