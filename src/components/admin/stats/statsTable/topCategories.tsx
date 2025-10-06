'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsResponse } from "@/types/stats";
import { Plus } from "lucide-react";
import { NoSalesStates } from "../statsFallBackUI/NoSalesStates";
import { useRouter } from "next/navigation";

export function TopCategories(stats: StatsResponse | null) {
    const router = useRouter()
    return (
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Répartition des ventes</CardTitle>
                    <CardDescription>Par catégorie de produits</CardDescription>
                </CardHeader>

                <CardContent >
                    <NoSalesStates period={stats?.period ?? null} />
                </CardContent>

                <CardFooter className="border-t pt-4">
                    <Button variant="outline" className="w-full" onClick={() => router.push("/admin/category")}>
                        <Plus className="h-4 w-4 mr-2" /> Gérer les catégoriesss
                    </Button>
                </CardFooter>
            </Card>
        )
}