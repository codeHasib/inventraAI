"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type {
  DashboardOverview,
  RevenueResponse,
  InventoryWarning,
  TopProduct,
} from "@/types/dashboard";

interface DashboardState {
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
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    overview: null,
    revenue: null,
    warnings: [],
    topProducts: [],
    loading: true,
    errors: {
      overview: null,
      revenue: null,
      warnings: null,
      topProducts: null,
    },
  });

  const fetchOverview = useCallback(async () => {
    try {
      const { data } = await api.get("/dashboard/overview");
      setState((s) => ({
        ...s,
        overview: data.data && typeof data.data === "object" && "totalRevenue" in data.data ? data.data : null,
        errors: { ...s.errors, overview: null },
      }));
    } catch {
      setState((s) => ({
        ...s,
        errors: { ...s.errors, overview: "Failed to load overview" },
      }));
    }
  }, []);

  const fetchRevenue = useCallback(async () => {
    try {
      const { data } = await api.get("/dashboard/revenue");
      const raw = data.data;
      setState((s) => ({
        ...s,
        revenue: raw && typeof raw === "object" && Array.isArray(raw.data) ? raw : null,
        errors: { ...s.errors, revenue: null },
      }));
    } catch {
      setState((s) => ({
        ...s,
        errors: { ...s.errors, revenue: "Failed to load revenue data" },
      }));
    }
  }, []);

  const fetchWarnings = useCallback(async () => {
    try {
      const { data } = await api.get("/dashboard/warnings");
      setState((s) => ({
        ...s,
        warnings: Array.isArray(data.data) ? data.data : [],
        errors: { ...s.errors, warnings: null },
      }));
    } catch {
      setState((s) => ({
        ...s,
        errors: { ...s.errors, warnings: "Failed to load warnings" },
      }));
    }
  }, []);

  const fetchTopProducts = useCallback(async () => {
    try {
      const { data } = await api.get("/dashboard/top-products");
      setState((s) => ({
        ...s,
        topProducts: Array.isArray(data.data) ? data.data : [],
        errors: { ...s.errors, topProducts: null },
      }));
    } catch {
      setState((s) => ({
        ...s,
        errors: { ...s.errors, topProducts: "Failed to load top products" },
      }));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setState((s) => ({ ...s, loading: true }));

      await Promise.allSettled([
        fetchOverview(),
        fetchRevenue(),
        fetchWarnings(),
        fetchTopProducts(),
      ]);

      if (!cancelled) {
        setState((s) => ({ ...s, loading: false }));
      }
    }

    loadAll();

    return () => {
      cancelled = true;
    };
  }, [fetchOverview, fetchRevenue, fetchWarnings, fetchTopProducts]);

  return {
    ...state,
    refetch: {
      overview: fetchOverview,
      revenue: fetchRevenue,
      warnings: fetchWarnings,
      topProducts: fetchTopProducts,
    },
  };
}
