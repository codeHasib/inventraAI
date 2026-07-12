"use client";

import { Pencil, Trash2, Tag } from "lucide-react";
import Badge from "@/components/ui/badge";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/dashboard/empty-state";
import type { Category } from "@/types/category";

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onEmptyCtaClick?: () => void;
}

function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800">
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-56" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-5 w-16 rounded-full" />
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

export default function CategoryTable({
  categories,
  loading,
  onEdit,
  onDelete,
  onEmptyCtaClick,
}: CategoryTableProps) {
  if (loading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Status
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

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <EmptyState
          icon={Tag}
          heading="No categories yet"
          subtext="Create your first category to organize your inventory."
          ctaLabel="+ Add Category"
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
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {categories.map((cat) => (
            <tr
              key={cat._id}
              className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center gap-3">
                  {cat.color ? (
                    <span
                      className="inline-block h-3 w-3 rounded-full ring-2 ring-white dark:ring-slate-900"
                      style={{ backgroundColor: cat.color }}
                    />
                  ) : (
                    <span className="inline-block h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {cat.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                  {cat.description || "—"}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <Badge variant={cat.isActive ? "success" : "danger"}>
                  {cat.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    onClick={() => onEdit(cat)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                    onClick={() => onDelete(cat)}
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
