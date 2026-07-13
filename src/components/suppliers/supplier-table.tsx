"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2, Truck } from "lucide-react";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/dashboard/empty-state";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import type { Supplier } from "@/types/supplier";

interface SupplierTableProps {
  suppliers: Supplier[];
  loading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  onEmptyCtaClick?: () => void;
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32 hidden sm:block" />
          <Skeleton className="h-4 w-44 hidden md:block" />
          <Skeleton className="h-4 w-36 hidden md:block" />
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SupplierTable({
  suppliers,
  loading,
  onEdit,
  onDelete,
  onEmptyCtaClick,
}: SupplierTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200/80 bg-white dark:border-white/[0.06] dark:bg-zinc-900/40">
        <TableSkeleton />
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200/80 bg-white dark:border-white/[0.06] dark:bg-zinc-900/40">
        <EmptyState
          icon={Truck}
          heading="No suppliers yet"
          subtext="Add your first supplier to start tracking purchases."
          ctaLabel="+ Add Supplier"
          onCtaClick={onEmptyCtaClick}
        />
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-zinc-200/80 bg-white dark:border-white/[0.06] dark:bg-zinc-900/40 md:block">
        <table className="min-w-full divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
          <thead>
            <tr className="border-b border-zinc-200/80 dark:border-white/[0.06]">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Phone</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Actions</th>
            </tr>
          </thead>
          <motion.tbody
            className="divide-y divide-zinc-100 dark:divide-white/[0.06]"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {suppliers.map((s) => (
              <motion.tr
                key={s._id}
                variants={fadeInUp}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-white/[0.02]"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {s.company || s.name}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">
                    {s.name}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {s.email || "—"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {s.phone}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-zinc-300"
                      onClick={() => onEdit(s)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/10"
                      onClick={() => onDelete(s)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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
        {suppliers.map((s) => (
          <motion.div
            key={s._id}
            variants={fadeInUp}
            className="w-full bg-white p-4 border border-zinc-200/50 rounded-xl space-y-2 flex flex-col dark:bg-zinc-900/40 dark:border-white/5"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {s.company || s.name}
                </span>
                {s.company && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{s.name}</p>
                )}
              </div>
            </div>
            <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              {s.email && <p>{s.email}</p>}
              <p>{s.phone}</p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5"
                onClick={() => onEdit(s)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
                onClick={() => onDelete(s)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
