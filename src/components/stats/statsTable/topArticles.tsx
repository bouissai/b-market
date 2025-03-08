import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsResponse } from "@/types/stats";
import { ChartBarStacked, Plus } from "lucide-react";
import router from "next/router";
import { NoSalesStates } from "../statsFallBackUI/NoSalesStates";

export function TopArticles(stats: StatsResponse | null) {
    if (!stats?.totalOrders) {
        return (
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Répartition des ventes</CardTitle>
              <CardDescription>Par catégorie de produits</CardDescription>
            </CardHeader>
    
    
            <CardContent>
            <NoSalesStates period={stats?.period ?? null} />
            </CardContent>
    
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full" onClick={() => router.push("/admin/category")}>
                <Plus className="h-4 w-4 mr-2" /> Gérer les catégories
              </Button>
            </CardFooter>
          </Card>
        )
      }
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Produits populaires</CardTitle>
                <CardDescription>Top 5 des produits les plus vendus</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {stats?.topProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        <span className="flex items-center">
                                            <ChartBarStacked className="h-3 w-3 mr-1" /> Category: {product.categoryName}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">{product.totalQuantity} vendus</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {product.totalRevenue.toLocaleString("fr-FR")} €
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full" onClick={() => router.push("/admin/article")}>
                    <Plus className="h-4 w-4 mr-2" /> Gérer les produits
                </Button>
            </CardFooter>
        </Card>
    )
}