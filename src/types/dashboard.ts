export interface DashboardOverview {
  totalRevenue: number;
  totalExpenses: number;
  totalPurchases: number;
  totalSalesCount: number;
  totalProducts: number;
  revenueData: RevenueDataPoint[];
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface InventoryWarning {
  _id: string;
  name: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  status: "LOW_STOCK" | "OUT_OF_STOCK";
  category?: { name: string };
}

export interface TopProduct {
  _id: string;
  name: string;
  sku: string;
  sellingPrice: number;
  totalSold: number;
  revenue: number;
}
