"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import type { Expense, ExpenseFormData } from "@/types/expense";

export function useExpensesAll() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      const { data: res } = await api.get("/expenses/all");
      const items = Array.isArray(res?.data) ? res.data : [];
      setExpenses(items);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load expenses";
      setError(msg);
      toast.error(msg);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      await fetchExpenses();
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [fetchExpenses]);

  const createExpense = async (payload: ExpenseFormData) => {
    try {
      const { data: res } = await api.post("/expenses", payload);
      toast.success("Expense recorded");
      await fetchExpenses();
      return res?.data as Expense;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || (err instanceof Error ? err.message : "Failed to record expense");
      toast.error(msg);
      throw err;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await api.delete(`/expenses/${id}`);
      toast.success("Expense deleted");
      await fetchExpenses();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || (err instanceof Error ? err.message : "Failed to delete expense");
      toast.error(msg);
      throw err;
    }
  };

  return { expenses, loading, error, refetch: fetchExpenses, createExpense, deleteExpense };
}
