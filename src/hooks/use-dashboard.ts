"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type {
  DashboardOverview,
  InventoryWarning,
  TopProduct,
  RevenueDataPoint,
} from "@/types/dashboard";

interface DashboardState {
  overview: DashboardOverview | null;
  warnings: InventoryWarning[];
  topProducts: TopProduct[];
  loading: boolean;
  error: string | null;
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function parseOverview(raw: Record<string, unknown>): DashboardOverview {
  const stats = (raw.stats ?? {}) as Record<string, unknown>;
  const revData = (raw.revenueData ?? {}) as Record<string, unknown>;
  const chartsData = (raw.chartsData ?? {}) as Record<string, unknown>;

  const last7DaysRaw =
    (Array.isArray(revData.last7Days) ? revData.last7Days : []).length > 0
      ? (revData.last7Days as Record<string, unknown>[])
      : Array.isArray(chartsData.last7DaysRevenue)
        ? (chartsData.last7DaysRevenue as Record<string, unknown>[])
        : [];

  const revenueData: RevenueDataPoint[] = last7DaysRaw.map(
    (d: Record<string, unknown>) => ({
      date: String(d.date ?? d.day ?? d._id ?? d.createdAt ?? ""),
      revenue: Number(d.revenue ?? d.total ?? d.amount ?? d.totalRevenue ?? d.value ?? 0),
    }),
  );

  return {
    totalRevenue: Number(stats.totalRevenue) || 0,
    totalExpenses: Number(stats.totalExpenses) || 0,
    totalPurchases: Number(stats.totalPurchases) || 0,
    totalSalesCount: Number(stats.totalSalesCount) || 0,
    totalProducts: Number(stats.totalProducts) || 0,
    revenueData,
  };
}

function parseWarnings(raw: Record<string, unknown>): InventoryWarning[] {
  const warnings = (raw.warnings ?? {}) as Record<string, unknown>;
  const lowStock = Array.isArray(warnings.lowStock) ? warnings.lowStock : [];
  const outOfStock = Array.isArray(warnings.outOfStock) ? warnings.outOfStock : [];

  const mapped: InventoryWarning[] = [
    ...lowStock.map((w: Record<string, unknown>) => ({
      _id: String(w._id ?? ""),
      name: String(w.name ?? ""),
      sku: String(w.sku ?? ""),
      currentStock: Number(w.currentStock ?? w.stock ?? 0),
      minimumStock: Number(w.minimumStock ?? w.minStock ?? 0),
      status: "LOW_STOCK" as const,
      category: w.category as InventoryWarning["category"],
    })),
    ...outOfStock.map((w: Record<string, unknown>) => ({
      _id: String(w._id ?? ""),
      name: String(w.name ?? ""),
      sku: String(w.sku ?? ""),
      currentStock: Number(w.currentStock ?? w.stock ?? 0),
      minimumStock: Number(w.minimumStock ?? w.minStock ?? 0),
      status: "OUT_OF_STOCK" as const,
      category: w.category as InventoryWarning["category"],
    })),
  ];

  return mapped;
}

function parseTopProducts(raw: Record<string, unknown>): TopProduct[] {
  const topProducts = (raw.topProducts ?? {}) as Record<string, unknown>;
  const topSelling = Array.isArray(topProducts.topSelling) ? topProducts.topSelling : [];

  return topSelling.map((p: Record<string, unknown>) => {
    const product = (p.product ?? {}) as Record<string, unknown>;
    return {
      _id: String(p._id ?? p.productId ?? product._id ?? ""),
      name: String(p.name ?? p.productName ?? product.name ?? ""),
      sku: String(p.sku ?? product.sku ?? ""),
      sellingPrice: Number(p.sellingPrice ?? p.unitPrice ?? p.price ?? product.sellingPrice ?? 0),
      totalSold: Number(p.totalSold ?? p.totalQuantity ?? p.quantity ?? p.sold ?? p.count ?? p.salesCount ?? p.total ?? p.sum ?? 0),
      revenue: Number(p.revenue ?? p.totalRevenue ?? p.total ?? p.amount ?? p.totalAmount ?? 0),
    };
  });
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    overview: null,
    warnings: [],
    topProducts: [],
    loading: true,
    error: null,
  });

  const loadStats = useCallback(async (signal?: AbortSignal) => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const { data: res } = await api.get("/dashboard/stats", {
        headers: NO_CACHE_HEADERS,
        signal,
      });

      const raw = res?.data;
      if (!raw || typeof raw !== "object") {
        setState((s) => ({ ...s, overview: null, loading: false }));
        return;
      }

      const overview = parseOverview(raw);
      const warnings = parseWarnings(raw);
      const topProducts = parseTopProducts(raw);

      setState({
        overview,
        warnings,
        topProducts,
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
      if (signal?.aborted) return;
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg =
        axiosErr.response?.data?.message ||
        (err instanceof Error ? err.message : "Failed to load dashboard");
      setState((s) => ({
        ...s,
        loading: false,
        error: msg,
      }));
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadStats(controller.signal);
    return () => controller.abort();
  }, [loadStats]);

  return {
    ...state,
    refetch: () => loadStats(),
  };
}
