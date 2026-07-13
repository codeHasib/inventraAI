"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import type { Product, ProductFormData, PaginatedProducts } from "@/types/product";

export function useProducts(page = 1, limit = 20) {
  const [data, setData] = useState<PaginatedProducts>({
    products: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const { data: res } = await api.get("/products", {
        params: { page, limit },
      });
      const d = res?.data;
      if (d && typeof d === "object" && Array.isArray(d.products)) {
        setData(d);
      } else if (Array.isArray(d)) {
        setData({ products: d, total: d.length, page: 1, limit: d.length, totalPages: 1 });
      } else {
        setData({ products: [], total: 0, page: 1, limit, totalPages: 0 });
      }
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load products";
      setError(msg);
      toast.error(msg);
    }
  }, [page, limit]);

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

  const createProduct = async (payload: ProductFormData) => {
    try {
      const { data: res } = await api.post("/products", payload);
      toast.success("Product created");
      await fetchProducts();
      return res?.data as Product;
    } catch (error: any) {
      const errorData = error.response?.data;
      console.error("Product Creation Error String:", typeof errorData === "object" ? JSON.stringify(errorData, null, 2) : errorData);
      const readableMsg = errorData?.error || errorData?.message || "Validation failed. Please verify form details.";
      toast.error(readableMsg);
      throw error;
    }
  };

  const updateProduct = async (id: string, payload: ProductFormData) => {
    try {
      const { data: res } = await api.patch(`/products/${id}`, payload);
      toast.success("Product updated");
      await fetchProducts();
      return res?.data as Product;
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      const msg = serverMessage || error?.message || "Failed to update product";
      console.error("Product Update Error Details:", error?.response?.data || error?.message);
      toast.error(msg);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      await fetchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete product";
      toast.error(msg);
      throw err;
    }
  };

  const adjustStock = async (id: string, body: { currentStock: number; type: "ADD" | "SUBTRACT" | "SET"; reason?: string }) => {
    try {
      const { data: res } = await api.patch(`/products/${id}/stock`, body);
      toast.success("Stock updated");
      await fetchProducts();
      return res?.data as Product;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to adjust stock";
      toast.error(msg);
      throw err;
    }
  };

  return {
    ...data,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
  };
}
