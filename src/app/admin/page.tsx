'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { TrendIndicator } from '@/lib/helpers/statsHelpers';
import { useStatsStore } from '@/store/useStatsStore';
import { CategoryStats, StatsPeriod } from '@/types/stats';
import { BarChart3, ChartBarStacked, Clock, DollarSign, Download, Plus, RefreshCw, ShoppingBasket, ShoppingCart, Table, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminHome() {
  const router = useRouter();
  const { stats, isLoading, error, period, setPeriod, loadStats } = useStatsStore();
  useEffect(() => {
    loadStats(period);
  }, [period, loadStats]);

  const totalCatRevenue = stats?.topCategories.reduce((acc, category) => acc + category.totalRevenue, 0) ?? 0;
  console.log(stats)

  const handleRefresh = async () => {
    await loadStats();
    toast({
      title: "Actualisé",
      description: "Les données du tableau de bord ont été actualisées.",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (!isLoading && error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <h3 className='mb-4 text-red-500'>Erreur de chargement</h3>
              <p>{error}</p>
              <Button onClick={handleRefresh} className="mt-4">Réessayer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoading && !stats) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">Aucune donnée disponible</h3>
              <p className="text-muted-foreground mt-2">Impossible de récupérer les données du tableau de bord.</p>
              <Button onClick={handleRefresh} className="mt-4">Actualiser</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <DollarSign className="h-4 w-4  text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRevenue.toLocaleString("fr-FR")} €</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendIndicator value={Number(stats?.revenueGrowth?.toFixed(2)) ?? 0} />
              <span className="ml-1">par rapport à la période précédente</span>
            </p>
          </CardContent>
        </Card>


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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.uniqueCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
            <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageOrderValue.toLocaleString("fr-FR")} €</div>
            <p className="text-xs text-muted-foreground mt-1">Par commande</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Évolution des ventes</CardTitle>
            <CardDescription>Chiffre d'affaires sur la période</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Graphique d'évolution des ventes</p>
                <p className="text-xs text-muted-foreground mt-1">Données visualisées pour la période sélectionnée</p>
              </div>
            </div>
          </CardContent>
        </Card>



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
      </div>


      {/* Commandes récentes, produits populaires et actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <Table className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
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
      </div>

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

    </div>







  );
}
