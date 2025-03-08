import { db } from "@/app/lib/db";
import { CategoryStats, DateRange, ProductStats, RevenueByPeriodItem } from "@/types/stats";

export class StatsService {
    async getTotalOrders(dateRange: DateRange | null) {
        return await db.order.count({
            where: dateRange
                ? {
                    createdAt: {
                        gte: dateRange.startDate,
                        lte: dateRange.endDate
                    }
                }
                : undefined,
        });
    }

    async getOrdersByStatus(dateRange: DateRange | null) {
        const ordersByStatus = await db.order.groupBy({
            by: ['status'],
            _count: true,
            where: dateRange
                ? {
                    createdAt: {
                        gte: dateRange.startDate,
                        lte: dateRange.endDate
                    }
                }
                : undefined,
        });

        return ordersByStatus.map(order => ({
            status: order.status,
            count: order._count
        }));
    }

    async getTotalRevenue(dateRange: DateRange | null) {
        const orders = await db.order.findMany({
            select: {
                total: true,
            },
            where: dateRange ? {
                createdAt: {
                    gte: dateRange.startDate,
                    lte: dateRange.endDate
                }
            } : undefined
        });

        const total_revenue = orders.reduce((total, order) => {
            return total + (order.total);
        }, 0);

        return total_revenue;
    }

    async getTopProducts(dateRange: DateRange | null): Promise<ProductStats[]> {
        const items = await db.orderItem.groupBy({
            by: ['articleId'],
            where: dateRange ? {
                order: {
                    createdAt: {
                        gte: dateRange.startDate,
                        lte: dateRange.endDate
                    }
                }
            } : undefined,
            _sum: {
                quantity: true,
                price: true
            }
        });

        const productsWithDetails = await Promise.all(
            items.map(async (item) => {
                const article = await db.article.findUnique({
                    where: { id: item.articleId },
                    include: { category: true }
                });

                if (!article) throw new Error(`Article not found: ${item.articleId}`);

                return {
                    id: article.id,
                    name: article.name,
                    price: article.price,
                    image: article.image,
                    categoryName: article.category.name,
                    totalQuantity: item._sum.quantity || 0,
                    totalRevenue: item._sum.price || 0
                };
            })
        );

        return productsWithDetails.sort((a, b) => b.totalQuantity - a.totalQuantity) // Tri décroissant
            .slice(0, 5); // Garde les 5 premiers;
    }

    async getTopRevenueProducts(dateRange: DateRange | null): Promise<ProductStats[]> {
        const items = await db.orderItem.groupBy({
            by: ['articleId'],
            where: dateRange ? {
                order: {
                    createdAt: {
                        gte: dateRange.startDate,
                        lte: dateRange.endDate
                    }
                }
            } : undefined,
            _sum: {
                quantity: true,
                price: true
            },
            orderBy: {
                _sum: {
                    price: 'desc'
                }
            },
            take: 5
        });

        const productsWithDetails = await Promise.all(
            items.map(async (item) => {
                const article = await db.article.findUnique({
                    where: { id: item.articleId },
                    include: { category: true }
                });

                if (!article) throw new Error(`Article not found: ${item.articleId}`);

                return {
                    id: article.id,
                    name: article.name,
                    price: article.price,
                    image: article.image,
                    categoryName: article.category.name,
                    totalQuantity: item._sum.quantity || 0,
                    totalRevenue: item._sum.price || 0
                };
            })
        );
        return productsWithDetails

    }

    async getTopCategories(dateRange: DateRange | null): Promise<CategoryStats[]> {
        const items = await db.orderItem.findMany({
            where: dateRange ? {
                order: {
                    createdAt: {
                        gte: dateRange.startDate,
                        lte: dateRange.endDate
                    }
                }
            } : undefined,
            include: {
                article: {
                    include: {
                        category: true
                    }
                }
            }
        });

        const categoryStats = items.reduce((acc, item) => {
            const categoryName = item.article.category.name;
            acc[categoryName] = (acc[categoryName] || 0) + item.price;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categoryStats)
            .map(([name, totalRevenue]) => ({ name, totalRevenue }))
            .sort((a, b) => b.totalRevenue - a.totalRevenue);
    }

    async getUniqueCustomers(dateRange: DateRange | null): Promise<number> {
        const result = await db.order.findMany({
            where: dateRange ? {
                createdAt: {
                    gte: dateRange.startDate,
                    lte: dateRange.endDate
                }
            } : undefined,
            select: {
                userId: true
            },
            distinct: ['userId']
        });

        return result.length;
    }



    // Méthode à ajouter dans la classe StatsService
    async getRevenueByPeriod(period: StatsPeriod, dateRange: DateRange | null): Promise<RevenueByPeriodItem[]> {
        if (!dateRange) return [];

        switch (period) {
            case "today":
                return this.getRevenueByDayParts(dateRange);
            case "week":
                return this.getRevenueByDaysOfWeek(dateRange);
            case "month":
                return this.getRevenueByWeeksOfMonth(dateRange);
            case "year":
                return this.getRevenueByMonthsOfYear(dateRange);
            default:
                return [];
        }
    }

    // Méthodes privées pour gérer les différentes périodes
    private async getRevenueByDayParts(dateRange: DateRange): Promise<RevenueByPeriodItem[]> {
        // Définir les plages horaires pour matin, midi et soir
        const startDate = dateRange.startDate;
        const endDate = dateRange.endDate;

        const morningStart = new Date(startDate);
        morningStart.setHours(0, 0, 0, 0);
        const morningEnd = new Date(startDate);
        morningEnd.setHours(11, 59, 59, 999);

        const noonStart = new Date(startDate);
        noonStart.setHours(12, 0, 0, 0);
        const noonEnd = new Date(startDate);
        noonEnd.setHours(17, 59, 59, 999);

        const eveningStart = new Date(startDate);
        eveningStart.setHours(18, 0, 0, 0);
        const eveningEnd = new Date(endDate);
        eveningEnd.setHours(23, 59, 59, 999);

        // Récupérer les revenus pour chaque partie de la journée
        const [morningRevenue, noonRevenue, eveningRevenue] = await Promise.all([
            this.getTotalRevenue({ startDate: morningStart, endDate: morningEnd }),
            this.getTotalRevenue({ startDate: noonStart, endDate: noonEnd }),
            this.getTotalRevenue({ startDate: eveningStart, endDate: eveningEnd })
        ]);

        return [
            { name: 'Matin', revenue: morningRevenue },
            { name: 'Midi', revenue: noonRevenue },
            { name: 'Soir', revenue: eveningRevenue }
        ];
    }

    private async getRevenueByDaysOfWeek(dateRange: DateRange): Promise<RevenueByPeriodItem[]> {
        const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);

        // Préparer le tableau pour stocker les résultats par jour
        const revenueByDay: RevenueByPeriodItem[] = [];

        // Pour chaque jour de la semaine
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            // S'assurer que nous ne dépassons pas la date de fin
            if (currentDate > endDate) break;

            const dayStart = new Date(currentDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);

            // Récupérer le revenu pour ce jour
            const revenue = await this.getTotalRevenue({ startDate: dayStart, endDate: dayEnd });

            // Obtenir le jour de la semaine (0 = dimanche, 1 = lundi, ..., 6 = samedi)
            let dayIndex = currentDate.getDay() - 1;
            if (dayIndex < 0) dayIndex = 6; // Convertir dimanche (0) à 6 pour notre système où lundi = 0

            revenueByDay.push({ name: dayNames[dayIndex], revenue });
        }

        return revenueByDay;
    }

    private async getRevenueByWeeksOfMonth(dateRange: DateRange): Promise<RevenueByPeriodItem[]> {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);

        // Trouver le premier jour du mois
        const firstDayOfMonth = new Date(startDate);
        firstDayOfMonth.setDate(1);

        // Calculer le nombre de semaines dans le mois
        const lastDayOfMonth = new Date(endDate);

        const weeksInMonth = Math.ceil((lastDayOfMonth.getDate() - firstDayOfMonth.getDate() + 1) / 7);

        // Préparer le tableau pour stocker les résultats par semaine
        const revenueByWeek: RevenueByPeriodItem[] = [];

        // Pour chaque semaine du mois
        for (let i = 0; i < weeksInMonth; i++) {
            const weekStart = new Date(firstDayOfMonth);
            weekStart.setDate(firstDayOfMonth.getDate() + i * 7);

            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            // S'assurer que la fin de la semaine ne dépasse pas la fin du mois
            if (weekEnd > lastDayOfMonth) {
                weekEnd.setTime(lastDayOfMonth.getTime());
            }

            // Récupérer le revenu pour cette semaine
            const revenue = await this.getTotalRevenue({ startDate: weekStart, endDate: weekEnd });

            revenueByWeek.push({ name: `Sem ${i + 1}`, revenue });
        }

        return revenueByWeek;
    }

    private async getRevenueByMonthsOfYear(dateRange: DateRange): Promise<RevenueByPeriodItem[]> {
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);

        // Préparer le tableau pour stocker les résultats par mois
        const revenueByMonth: RevenueByPeriodItem[] = [];

        // Pour chaque mois de l'année
        for (let month = 0; month < 12; month++) {
            const monthStart = new Date(startDate.getFullYear(), month, 1);
            const monthEnd = new Date(startDate.getFullYear(), month + 1, 0);

            // S'assurer que nous sommes dans la plage de dates spécifiée
            if (monthEnd < startDate || monthStart > endDate) continue;

            // Ajuster les dates de début et de fin pour rester dans la plage spécifiée
            const adjustedStart = monthStart < startDate ? startDate : monthStart;
            const adjustedEnd = monthEnd > endDate ? endDate : monthEnd;

            // Récupérer le revenu pour ce mois
            const revenue = await this.getTotalRevenue({
                startDate: adjustedStart,
                endDate: adjustedEnd
            });

            revenueByMonth.push({ name: monthNames[month], revenue });
        }

        return revenueByMonth;
    }




}
