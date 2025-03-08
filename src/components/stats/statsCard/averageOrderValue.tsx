import { StatsResponse } from "@/types/stats";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ShoppingBasket } from "lucide-react";

export function AverageOrderValue(stats: StatsResponse | null) {
    if (!stats) return null;
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
                <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats?.averageOrderValue.toLocaleString("fr-FR")} €</div>
                <p className="text-xs text-muted-foreground mt-1">Par commande</p>
            </CardContent>
        </Card>
    )
}