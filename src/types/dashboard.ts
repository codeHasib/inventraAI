export interface DashboardOverview {
  totalRevenue: number;
  totalExpenses: number;
  totalPurchases: number;
  totalSalesCount: number;
  totalProducts: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface RevenueResponse {
  current: number;
  previous: number;
  change: number;
  data: RevenueDataPoint[];
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

export interface DashboardState {
  overview: DashboardOverview | null;
  revenue: RevenueResponse | null;
  warnings: InventoryWarning[];
  topProducts: TopProduct[];
  loading: boolean;
  errors: {
    overview: string | null;
    revenue: string | null;
    warnings: string | null;
    topProducts: string | null;
  };
  refetch: () => Promise<void>;
}
