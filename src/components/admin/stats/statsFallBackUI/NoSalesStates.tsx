import { StatsPeriod } from "@/types/stats";
import { FileX2 } from "lucide-react";


interface NoSalesStatesProps {
    period: StatsPeriod | null;
  }

export function NoSalesStates({ period }: NoSalesStatesProps) {

    let date = "";

    switch (period){
        case "today": 
            date="aujourd'hui";
            break;        
        case "week": 
            date="cette semaine"; 
            break;        
        case "month": 
            date="ce mois ci"; 
            break;
        default :break
    }

    return (<div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
        <div className="text-center">
            <FileX2 className="h-full w-16 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Pas de ventes pour {date} </p>
            <p className="text-xs text-muted-foreground mt-1">Voir sur d&apos;sautres periodes</p>
        </div>
    </div>)
}