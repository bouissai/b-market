import { TrendIndicator } from "@/lib/helpers/statsHelpers";
import { StatsResponse } from "@/types/stats";
import { ShoppingCart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";

export function OrdersCount(stats : StatsResponse | null){
    if (!stats) return null;
    return (
        <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Commandes</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalOrders}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <TrendIndicator value={Number(stats?.ordersGrowth?.toFixed(2)) ?? 0} />
            <span className="ml-1">par rapport à la période précédente</span>
          </p>
        </CardContent>
      </Card>
    )
}