import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatsResponse } from "@/types/stats";

export function RevenueGrowth({ period, totalRevenue, revenueGrowth, revenueByPeriod }: StatsResponse) {
  // Formatage des chiffres en euros
  const formatEuro = (value : number) => {
    return `${value.toFixed(2)} €`;
  };

  // Formatage du pourcentage de croissance avec le bon signe
  const formatGrowth = (growth : number) => {
    if (growth === null) return "N/A";
    const sign = growth >= 0 ? "+" : "";
    return `${sign}${growth.toFixed(2)}%`;
  };

  // Définition de la couleur en fonction de la croissance
  const growthColor = (revenueGrowth?? 0) >= 0 ? "text-green-600" : "text-red-600";

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Évolution des ventes</CardTitle>
            <CardDescription>Chiffre d'affaires sur la période</CardDescription>
          </div>
          <div className={`text-right ${growthColor} font-semibold`}>
            {formatGrowth(revenueGrowth ?? 0)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        {revenueByPeriod && revenueByPeriod.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueByPeriod}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatEuro} />
                <Tooltip formatter={(value : number) => [`${formatEuro(value)}`, "CA"]} />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
            <div className="text-center">
              <p className="text-muted-foreground">Aucune donnée disponible</p>
            </div>
          </div>
        )}
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Total: {formatEuro(totalRevenue)} pour la période {period || "sélectionnée"}
        </div>
      </CardContent>
    </Card>
  );
}