"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type {
  DashboardOverview,
  InventoryWarning,
  TopProduct,
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

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    overview: null,
    warnings: [],
    topProducts: [],
    loading: true,
    error: null,
  });

  const fetchStats = useCallback(async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const { data: res } = await api.get("/dashboard/stats", {
        headers: NO_CACHE_HEADERS,
      });

      const raw = res?.data;
      if (!raw || typeof raw !== "object") {
        setState((s) => ({ ...s, overview: null, loading: false }));
        return;
      }

      const overview: DashboardOverview = {
        totalRevenue: Number(raw.totalRevenue) || 0,
        totalExpenses: Number(raw.totalExpenses) || 0,
        totalPurchases: Number(raw.totalPurchases) || 0,
        totalSalesCount: Number(raw.totalSalesCount) || 0,
        totalProducts: Number(raw.totalProducts) || 0,
      };

      const warnings: InventoryWarning[] = Array.isArray(raw.warnings)
        ? raw.warnings
        : [];
      const topProducts: TopProduct[] = Array.isArray(raw.topProducts)
        ? raw.topProducts
        : [];

      setState({
        overview,
        warnings,
        topProducts,
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
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
    let active = true;

    async function load() {
      try {
        setState((s) => ({ ...s, loading: true, error: null }));
        const { data: res } = await api.get("/dashboard/stats", {
          headers: NO_CACHE_HEADERS,
        });

        if (!active) return;

        const raw = res?.data;
        if (!raw || typeof raw !== "object") {
          setState((s) => ({ ...s, overview: null, loading: false }));
          return;
        }

        const overview: DashboardOverview = {
          totalRevenue: Number(raw.totalRevenue) || 0,
          totalExpenses: Number(raw.totalExpenses) || 0,
          totalPurchases: Number(raw.totalPurchases) || 0,
          totalSalesCount: Number(raw.totalSalesCount) || 0,
          totalProducts: Number(raw.totalProducts) || 0,
        };

        const warnings: InventoryWarning[] = Array.isArray(raw.warnings)
          ? raw.warnings
          : [];
        const topProducts: TopProduct[] = Array.isArray(raw.topProducts)
          ? raw.topProducts
          : [];

        setState({
          overview,
          warnings,
          topProducts,
          loading: false,
          error: null,
        });
      } catch (err: unknown) {
        if (!active) return;
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
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return {
    ...state,
    refetch: fetchStats,
  };
}
