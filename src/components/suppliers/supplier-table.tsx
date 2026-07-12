"use client";

import { Pencil, Trash2, Truck } from "lucide-react";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/dashboard/empty-state";
import type { Supplier } from "@/types/supplier";

interface SupplierTableProps {
  suppliers: Supplier[];
  loading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  onEmptyCtaClick?: () => void;
}

function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800">
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-44" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-36" />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </td>
    </tr>
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
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Phone
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
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
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Phone
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {suppliers.map((s) => (
            <tr
              key={s._id}
              className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <td className="whitespace-nowrap px-6 py-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {s.company || s.name}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {s.name}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {s.email || "—"}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {s.phone}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    onClick={() => onEdit(s)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                    onClick={() => onDelete(s)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
