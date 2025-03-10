import { StatsResponse } from "@/types/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export function CustomersCount(stats: StatsResponse | null) {
  if (!stats) return null;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Clients</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats?.uniqueCustomers}</div>
      </CardContent>
    </Card>
  )
}