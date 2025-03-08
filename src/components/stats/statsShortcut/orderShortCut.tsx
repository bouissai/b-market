import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsResponse } from "@/types/stats";
import { ShoppingCart, Plus, Clock, ShoppingBasket } from "lucide-react";
import router from "next/router";

export function OrderShortCut(stats: StatsResponse | null){
    return(
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" /> Commandes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/admin/orders?status=new")}
            >
              <Plus className="mr-2 h-4 w-4" /> Nouvelle commande
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/admin/orders?status=pending")}
            >
              <Clock className="mr-2 h-4 w-4" /> Commandes en attente ({stats?.ordersByStatus.find((o) => o.status === "PENDING")?.count || 0})
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/admin/orders")}>
              <ShoppingBasket className="mr-2 h-4 w-4" /> Toutes les commandes
            </Button>
          </div>
        </CardContent>
      </Card>
    )
}