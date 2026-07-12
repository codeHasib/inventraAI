"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import type { Category, CategoryFormData } from "@/types/category";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const { data: res } = await api.get("/categories");
      const items = Array.isArray(res?.data) ? res.data : [];
      setCategories(items);
      setError(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load categories";
      setError(msg);
      toast.error(msg);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      await fetchCategories();
      if (!cancelled) setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [fetchCategories]);

  const createCategory = async (payload: CategoryFormData) => {
    try {
      const { data: res } = await api.post("/categories", payload);
      toast.success("Category created");
      await fetchCategories();
      return res?.data as Category;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create category";
      toast.error(msg);
      throw err;
    }
  };

  const updateCategory = async (id: string, payload: CategoryFormData) => {
    try {
      const { data: res } = await api.put(`/categories/${id}`, payload);
      toast.success("Category updated");
      await fetchCategories();
      return res?.data as Category;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update category";
      toast.error(msg);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      await fetchCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete category";
      toast.error(msg);
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
