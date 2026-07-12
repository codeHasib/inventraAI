"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import type { Purchase, PurchaseFormData } from "@/types/purchase";

export function usePurchasesAll() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = useCallback(async () => {
    try {
      const { data: res } = await api.get("/purchases/all");
      const items = Array.isArray(res?.data) ? res.data : [];
      setPurchases(items);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load purchases";
      setError(msg);
      toast.error(msg);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      await fetchPurchases();
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [fetchPurchases]);

  const createPurchase = async (payload: PurchaseFormData) => {
    try {
      const { data: res } = await api.post("/purchases", payload);
      toast.success("Purchase created");
      await fetchPurchases();
      return res?.data as Purchase;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || (err instanceof Error ? err.message : "Failed to create purchase");
      toast.error(msg);
      throw err;
    }
  };

  const deletePurchase = async (id: string) => {
    try {
      await api.delete(`/purchases/${id}`);
      toast.success("Purchase deleted");
      await fetchPurchases();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || (err instanceof Error ? err.message : "Failed to delete purchase");
      toast.error(msg);
      throw err;
    }
  };

  return { purchases, loading, error, refetch: fetchPurchases, createPurchase, deletePurchase };
}
