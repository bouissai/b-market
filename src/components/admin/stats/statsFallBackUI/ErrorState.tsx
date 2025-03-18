import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
    error: string;
    handleRefresh: () => void;
  }
  
  export function ErrorState({ error, handleRefresh }: ErrorStateProps) {

    return(
        <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <h3 className='mb-4 text-red-500'>Erreur de chargement</h3>
              <p>{error}</p>
              <Button onClick={handleRefresh} className="mt-4">Réessayer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }