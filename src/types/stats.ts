export type StatsPeriod = "today" | "week" | "month" | "year" | null;
export interface DateRange {
  startDate: Date;
  endDate: Date;
}



export interface StatsResponse {
  period: StatsPeriod;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: OrderStatusStats[];
  topProducts: ProductStats[];
  topRevenueProducts: ProductStats[];
  topCategories: CategoryStats[];
  averageOrderValue: number;
  revenueGrowth: number | null;
  ordersGrowth: number | null;
  uniqueCustomers: number;
  revenueByPeriod: RevenueByPeriodItem[]; // Nouvelle propriété
}

export interface OrderStatusStats {
  status: string;
  count: number;
}

export interface ProductStats {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface CategoryStats {
  name: string;
  totalRevenue: number;
}

export interface DayOfWeekStats {
  day: string;
  count: number;
}

export interface RevenueByPeriodItem {
  name: string;
  revenue: number;
}
