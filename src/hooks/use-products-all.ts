"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import type { Product } from "@/types/product";

export function useProductsAll() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const { data: res } = await api.get("/products/all");
      const items = Array.isArray(res?.data) ? res.data : [];
      setProducts(items);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load products";
      setError(msg);
      toast.error(msg);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      await fetchProducts();
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
