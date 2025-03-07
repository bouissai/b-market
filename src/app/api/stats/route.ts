import { calculateDateRanges } from "@/lib/helpers/dateRangeHelper";
import { StatsService } from "@/services/statsService";
import { StatsPeriod, StatsResponse } from "@/types/stats";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") as StatsPeriod;

        const dateRanges = calculateDateRanges(period);
        if (!dateRanges) {
            return NextResponse.json({ message: "Période invalide" }, { status: 400 });
        }

        const statsService = new StatsService();

        // Récupération des données en parallèle
        const [
            totalOrders,
            previousPeriodOrders,
            ordersByStatus,
            totalRevenue,
            previousRevenue,
            topProducts,
            topRevenueProducts,
            topCategories,
            uniqueCustomers
        ] = await Promise.all([
            statsService.getTotalOrders(dateRanges.current),
            statsService.getTotalOrders(dateRanges.previous),
            statsService.getOrdersByStatus(dateRanges.current),
            statsService.getTotalRevenue(dateRanges.current),
            statsService.getTotalRevenue(dateRanges.previous),
            statsService.getTopProducts(dateRanges.current),
            statsService.getTopRevenueProducts(dateRanges.current),
            statsService.getTopCategories(dateRanges.current),
            statsService.getUniqueCustomers(dateRanges.current),
        ]);

        // Calculs des croissances
        const ordersGrowth = previousPeriodOrders > 0
            ? ((totalOrders - previousPeriodOrders) / previousPeriodOrders) * 100
            : null;



        const revenueGrowth = previousRevenue > 0
            ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
            : null;

        // Calcul du panier moyen
        const averageOrderValue = totalOrders > 0
            ? Number((totalRevenue / totalOrders).toFixed(2))
            : 0;

        const response: StatsResponse = {
            period,
            totalOrders,
            totalRevenue,
            ordersByStatus,
            topProducts,
            topRevenueProducts,
            topCategories,
            averageOrderValue,
            revenueGrowth: revenueGrowth !== null ? Number(revenueGrowth.toFixed(2)) : null,
            ordersGrowth: ordersGrowth !== null ? Number(ordersGrowth.toFixed(2)) : null,
            uniqueCustomers
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des statistiques :", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
