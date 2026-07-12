"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type { InventoryWarning } from "@/types/dashboard";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function parseWarnings(raw: Record<string, unknown>): InventoryWarning[] {
  const warnings = (raw.warnings ?? {}) as Record<string, unknown>;
  const lowStock = Array.isArray(warnings.lowStock) ? warnings.lowStock : [];
  const outOfStock = Array.isArray(warnings.outOfStock) ? warnings.outOfStock : [];

  return [
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
}

export function useAlerts() {
  const [warnings, setWarnings] = useState<InventoryWarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const { data: res } = await api.get("/dashboard/stats", {
        headers: NO_CACHE_HEADERS,
        signal,
      });
      const raw = res?.data;
      if (!raw || typeof raw !== "object") {
        setWarnings([]);
        return;
      }
      setWarnings(parseWarnings(raw));
    } catch (err: unknown) {
      if (signal?.aborted) return;
      const msg =
        err instanceof Error ? err.message : "Failed to load alerts";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchAlerts(controller.signal);
    return () => controller.abort();
  }, [fetchAlerts]);

  return { warnings, loading, error, refetch: () => fetchAlerts() };
}
