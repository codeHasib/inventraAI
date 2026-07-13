"use client";

import { motion } from "framer-motion";
import { Trash2, TrendingUp } from "lucide-react";
import Badge from "@/components/ui/badge";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/dashboard/empty-state";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import type { Sale } from "@/types/sale";

interface SaleTableProps {
  sales: Sale[];
  loading: boolean;
  onDelete: (sale: Sale) => void;
  onEmptyCtaClick?: () => void;
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24 hidden sm:block" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-32 hidden sm:block" />
          <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
        </div>
      ))}
    </div>
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
      <div className="rounded-xl border border-zinc-200/80 bg-white dark:border-white/[0.06] dark:bg-zinc-900/40">
        <TableSkeleton />
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200/80 bg-white dark:border-white/[0.06] dark:bg-zinc-900/40">
        <EmptyState icon={TrendingUp} heading="No sales yet" subtext="Record your first sale to start tracking revenue." ctaLabel="+ Record Sale" onCtaClick={onEmptyCtaClick} />
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-zinc-200/80 bg-white dark:border-white/[0.06] dark:bg-zinc-900/40 md:block">
        <table className="min-w-full divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
          <thead><tr className="border-b border-zinc-200/80 dark:border-white/[0.06]">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Invoice</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Profit</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Date</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Actions</th>
          </tr></thead>
          <motion.tbody
            className="divide-y divide-zinc-100 dark:divide-white/[0.06]"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {sales.map((s) => (
              <motion.tr key={s._id} variants={fadeInUp} className="transition-colors hover:bg-zinc-50 dark:hover:bg-white/[0.02]">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">{s.invoiceNumber}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">${s.grandTotal.toFixed(2)}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  ${s.items.reduce((sum, it) => sum + (it.sellingPrice - it.purchasePrice) * it.quantity, 0).toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4"><Badge variant={statusVariant(s.paymentStatus)}>{s.paymentStatus}</Badge></td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{new Date(s.saleDate).toLocaleDateString()}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <button type="button" onClick={() => onDelete(s)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <motion.div
        className="flex flex-col gap-3 md:hidden"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {sales.map((s) => (
          <motion.div
            key={s._id}
            variants={fadeInUp}
            className="w-full bg-white p-4 border border-zinc-200/50 rounded-xl space-y-2 flex flex-col dark:bg-zinc-900/40 dark:border-white/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{s.invoiceNumber}</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{new Date(s.saleDate).toLocaleDateString()}</p>
              </div>
              <Badge variant={statusVariant(s.paymentStatus)}>{s.paymentStatus}</Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-900 dark:text-zinc-100">${s.grandTotal.toFixed(2)}</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                +${s.items.reduce((sum, it) => sum + (it.sellingPrice - it.purchasePrice) * it.quantity, 0).toFixed(2)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onDelete(s)}
              className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
