import { StatsPeriod, StatsResponse } from "@/types/stats";

export async function fetchStats(period: StatsPeriod): Promise<StatsResponse> {
  const url = period ? `/api/stats?period=${period}` : `/api/stats`;
  console.log(url)
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des statistiques");
  }

  return res.json();
}
