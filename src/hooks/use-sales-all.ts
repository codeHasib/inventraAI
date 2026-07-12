"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import type { Sale, SaleFormData } from "@/types/sale";

export function useSalesAll() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    try {
      const { data: res } = await api.get("/sales/all");
      const items = Array.isArray(res?.data) ? res.data : [];
      setSales(items);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load sales";
      setError(msg);
      toast.error(msg);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      await fetchSales();
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [fetchSales]);

  const createSale = async (payload: SaleFormData) => {
    try {
      const { data: res } = await api.post("/sales", payload);
      toast.success("Sale recorded");
      await fetchSales();
      return res?.data as Sale;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || (err instanceof Error ? err.message : "Failed to record sale");
      toast.error(msg);
      throw err;
    }
  };

  const deleteSale = async (id: string) => {
    try {
      await api.delete(`/sales/${id}`);
      toast.success("Sale deleted");
      await fetchSales();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || (err instanceof Error ? err.message : "Failed to delete sale");
      toast.error(msg);
      throw err;
    }
  };

  return { sales, loading, error, refetch: fetchSales, createSale, deleteSale };
}
