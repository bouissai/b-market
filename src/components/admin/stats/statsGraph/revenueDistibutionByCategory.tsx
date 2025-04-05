import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryStats, StatsPeriod, StatsResponse } from "@/types/stats";
import { Ban, FileX2, Plus, Table } from "lucide-react";
import router from "next/router";
import { NoSalesStates } from "../statsFallBackUI/NoSalesStates";
import { RevenueGrowth } from "./revenuegrowth";
import { useRouter } from "next/navigation";

interface StatsProps {
  stats: StatsResponse | null,
  totalCatRevenue: number,
}

export function RevenueDistibutionByCategory({ stats, totalCatRevenue }: StatsProps) {
  const router = useRouter()
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
        <CardTitle>Répartition des ventes</CardTitle>
        <CardDescription>Par catégorie de produits</CardDescription>
      </CardHeader>


      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-full">
            <div className="space-y-4">
              {stats?.topCategories.map((category: CategoryStats) => (
                <div key={category.name} className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-sm font-medium"> {(category.totalRevenue / totalCatRevenue * 100).toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${Number((category.totalRevenue / totalCatRevenue * 100).toFixed(2))}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 text-right">
                      {category.totalRevenue.toLocaleString("fr-FR")} €
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="w-full" onClick={() => router.push("/admin/category")}>
          <Plus className="h-4 w-4 mr-2" /> Gérer les catégories
        </Button>
      </CardFooter>
    </Card>
  )
}