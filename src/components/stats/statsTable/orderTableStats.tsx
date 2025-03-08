import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { StatsResponse } from "@/types/stats";
import { Table, Clock, RefreshCw } from "lucide-react";
import router from "next/router";


interface StatsTableProps {
    stats: StatsResponse | null,
    handleRefresh: () => Promise<void>
  }
  

export function OrderTableStats({stats, handleRefresh}:StatsTableProps) {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Commandes récentes</CardTitle>
                    <CardDescription>{stats?.ordersByStatus.find((o) => o.status === "PENDING")?.count || 0} commandes en attente</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push("/admin/orders")}>
                    Toutes les voirs
                </Button>
            </CardHeader>

            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <div className="text-center">
                    <Table className="h-full w-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Tableau des commandes</p>
                    <p className="text-xs text-muted-foreground mt-1">Reprendre le tableau des commandes</p>
                </div>
            </div>

            <CardFooter className="border-t pt-4 flex justify-between">
                <div className="text-sm text-muted-foreground">
                    Mise à jour <Clock className="h-3 w-3 inline mr-1" /> il y a quelques minutes
                </div>
                <Button variant="ghost" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Actualiser
                </Button>
            </CardFooter>
        </Card>

    )
}