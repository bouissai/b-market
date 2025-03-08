'use client'

import { AverageOrderValue } from '@/components/stats/statsCard/averageOrderValue';
import { CustomersCount } from '@/components/stats/statsCard/customerscount';
import { OrdersCount } from '@/components/stats/statsCard/orderscount';
import { Revenue } from '@/components/stats/statsCard/revenue';
import { EmptyState } from '@/components/stats/statsFallBackUI/EmptyState';
import { ErrorState } from '@/components/stats/statsFallBackUI/ErrorState';
import { LoadingState } from '@/components/stats/statsFallBackUI/LoadingState';
import { RevenueDistibutionByCategory } from '@/components/stats/statsGraph/revenueDistibutionByCategory';
import { RevenueGrowth } from '@/components/stats/statsGraph/revenuegrowth';
import { OrderShortCut } from '@/components/stats/statsShortcut/orderShortCut';
import { OrderTableStats } from '@/components/stats/statsTable/orderTableStats';
import { TopArticles } from '@/components/stats/statsTable/topArticles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useStatsStore } from '@/store/useStatsStore';
import { StatsPeriod, StatsResponse } from '@/types/stats';
import { BarChart3, Clock, Download, Plus, RefreshCw, ShoppingBasket, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminHome() {
  const router = useRouter();
  const { stats, isLoading, error, period, setPeriod, loadStats } = useStatsStore();
  useEffect(() => {
    loadStats(period);
  }, [period, loadStats]);

  const totalCatRevenue = stats?.topCategories.reduce((acc, category) => acc + category.totalRevenue, 0) ?? 0;

  const handleRefresh = async () => {
    await loadStats();
    toast({
      title: "Actualisé",
      description: "Les données du tableau de bord ont été actualisées.",
    });
  };

  if (isLoading) {
    return <LoadingState/>;
  }

  if (!isLoading && error) {
    return <ErrorState error={error} handleRefresh={handleRefresh} />;
  }

  if (!isLoading && !stats) {
    return <EmptyState handleRefresh={handleRefresh} />;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">Aperçu de votre activité et des performances</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" /> Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Exporter
          </Button>
        </div>
      </div>
      <Tabs defaultValue={period ?? ""} className="mb-6" onValueChange={(p) => setPeriod(p as StatsPeriod)}>
        <TabsList>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="week">Cette semaine</TabsTrigger>
          <TabsTrigger value="month">Ce mois</TabsTrigger>
          <TabsTrigger value="year">Cette année</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Revenue {...stats as StatsResponse} />
        <OrdersCount {...stats as StatsResponse} />
        <CustomersCount {...stats as StatsResponse} />
        <AverageOrderValue {...stats as StatsResponse} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RevenueGrowth {...stats as StatsResponse} />
        <RevenueDistibutionByCategory stats={stats as StatsResponse} totalCatRevenue={totalCatRevenue as number} />
      </div>


      {/* Commandes récentes, produits populaires et actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <OrderTableStats stats={stats as StatsResponse} handleRefresh={handleRefresh} />
        <TopArticles {...stats as StatsResponse} />
      </div>
      
      <OrderShortCut {...stats as StatsResponse} />
    </div>
  );
}
