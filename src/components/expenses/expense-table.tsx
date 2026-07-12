"use client";

import { Trash2, Receipt } from "lucide-react";
import Badge from "@/components/ui/badge";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/dashboard/empty-state";
import type { Expense } from "@/types/expense";

interface ExpenseTableProps {
  expenses: Expense[];
  loading: boolean;
  onDelete: (expense: Expense) => void;
  onEmptyCtaClick?: () => void;
}

function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800">
      <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
      <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></td>
    </tr>
  );
}

export default function ExpenseTable({ expenses, loading, onDelete, onEmptyCtaClick }: ExpenseTableProps) {
  const methodBadge = (m: string) => {
    const map: Record<string, "success" | "default" | "warning"> = {
      CASH: "success", CARD: "default", MOBILE_MONEY: "warning", BANK_TRANSFER: "default",
    };
    return map[m] ?? "default";
  };

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead><tr className="border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Vendor</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)}</tbody>
        </table>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <EmptyState icon={Receipt} heading="No expenses yet" subtext="Track your first expense to keep your books accurate." ctaLabel="+ Record Expense" onCtaClick={onEmptyCtaClick} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead><tr className="border-b border-slate-200 dark:border-slate-800">
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Title</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Method</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Vendor</th>
          <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
        </tr></thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {expenses.map((ex) => (
            <tr key={ex._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{ex.title}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-red-600 dark:text-red-400">-${ex.amount.toFixed(2)}</td>
              <td className="whitespace-nowrap px-6 py-4"><Badge variant={methodBadge(ex.paymentMethod)}>{ex.paymentMethod}</Badge></td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(ex.expenseDate).toLocaleDateString()}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{ex.vendor || "—"}</td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <button type="button" onClick={() => onDelete(ex)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
