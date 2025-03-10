import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface EmptyStateProps {
    handleRefresh: () => void;
  }
  
  export function EmptyState({ handleRefresh }: EmptyStateProps) {

    return(
        <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">Aucune donnée disponible</h3>
              <p className="text-muted-foreground mt-2">Impossible de récupérer les données du tableau de bord.</p>
              <Button onClick={handleRefresh} className="mt-4">Actualiser</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }