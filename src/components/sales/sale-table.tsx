"use client";

import { Trash2, TrendingUp } from "lucide-react";
import Badge from "@/components/ui/badge";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/dashboard/empty-state";
import type { Sale } from "@/types/sale";

interface SaleTableProps {
  sales: Sale[];
  loading: boolean;
  onDelete: (sale: Sale) => void;
  onEmptyCtaClick?: () => void;
}

function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800">
      <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
      <td className="px-6 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></td>
    </tr>
  );
}

export default function SaleTable({ sales, loading, onDelete, onEmptyCtaClick }: SaleTableProps) {
  const statusVariant = (s: string): "success" | "warning" | "danger" | "default" => {
    const map: Record<string, "success" | "warning" | "danger" | "default"> = {
      PAID: "success", PENDING: "warning", PARTIAL: "warning", CANCELLED: "danger", REFUNDED: "default",
    };
    return map[s] ?? "default";
  };

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead><tr className="border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Invoice</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Profit</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)}</tbody>
        </table>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <EmptyState icon={TrendingUp} heading="No sales yet" subtext="Record your first sale to start tracking revenue." ctaLabel="+ Record Sale" onCtaClick={onEmptyCtaClick} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead><tr className="border-b border-slate-200 dark:border-slate-800">
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Invoice</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Total</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Profit</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
          <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
        </tr></thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {sales.map((s) => (
            <tr key={s._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{s.invoiceNumber}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">${s.grandTotal.toFixed(2)}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                ${s.items.reduce((sum, it) => sum + (it.sellingPrice - it.purchasePrice) * it.quantity, 0).toFixed(2)}
              </td>
              <td className="whitespace-nowrap px-6 py-4"><Badge variant={statusVariant(s.paymentStatus)}>{s.paymentStatus}</Badge></td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(s.saleDate).toLocaleDateString()}</td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <button type="button" onClick={() => onDelete(s)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
