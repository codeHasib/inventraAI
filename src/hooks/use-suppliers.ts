"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import type { Supplier, SupplierFormData } from "@/types/supplier";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    try {
      const { data: res } = await api.get("/suppliers/all");
      const items = Array.isArray(res?.data) ? res.data : [];
      setSuppliers(items);
      setError(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load suppliers";
      setError(msg);
      toast.error(msg);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      await fetchSuppliers();
      if (!cancelled) setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [fetchSuppliers]);

  const createSupplier = async (payload: SupplierFormData) => {
    try {
      const { data: res } = await api.post("/suppliers", payload);
      toast.success("Supplier created");
      await fetchSuppliers();
      return res?.data as Supplier;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create supplier";
      toast.error(msg);
      throw err;
    }
  };

  const updateSupplier = async (id: string, payload: SupplierFormData) => {
    try {
      const { data: res } = await api.patch(`/suppliers/${id}`, payload);
      toast.success("Supplier updated");
      await fetchSuppliers();
      return res?.data as Supplier;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update supplier";
      toast.error(msg);
      throw err;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await api.delete(`/suppliers/${id}`);
      toast.success("Supplier deleted");
      await fetchSuppliers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete supplier";
      toast.error(msg);
      throw err;
    }
  };

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
}
