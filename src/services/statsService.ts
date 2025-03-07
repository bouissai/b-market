import { db } from "@/app/lib/db";
import { CategoryStats, DateRange, DayOfWeekStats, ProductStats } from "@/types/stats";

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

}
