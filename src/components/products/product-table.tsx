"use client";

import { Pencil, Trash2, Package, Boxes } from "lucide-react";
import Badge from "@/components/ui/badge";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/dashboard/empty-state";
import type { Product, ProductStatus } from "@/types/product";
import type { Category } from "@/types/category";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
  onEmptyCtaClick?: () => void;
}

function statusBadge(status: ProductStatus) {
  const map: Record<ProductStatus, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
    ACTIVE: { label: "Active", variant: "success" },
    LOW_STOCK: { label: "Low Stock", variant: "warning" },
    OUT_OF_STOCK: { label: "Out of Stock", variant: "danger" },
    DISCONTINUED: { label: "Discontinued", variant: "default" },
  };
  const s = map[status] ?? map.ACTIVE;
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800">
      <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
      <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-1">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </td>
    </tr>
  );
}

function resolveName(id: string, items: { _id: string; name: string }[]): string {
  return items.find((i) => i._id === id)?.name ?? "—";
}

export default function ProductTable({
  products,
  categories,
  loading,
  onEdit,
  onDelete,
  onAdjustStock,
  onEmptyCtaClick,
}: ProductTableProps) {
  if (loading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Name / SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <EmptyState
          icon={Package}
          heading="No products yet"
          subtext="Add your first product to start tracking inventory."
          ctaLabel="+ Add Product"
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
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Name / SKU</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Stock</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {products.map((p) => (
            <tr key={p._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-6 py-4">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</span>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{p.sku}</p>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {resolveName(p.categoryId, categories)}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">${p.sellingPrice.toFixed(2)}</span>
                  <span className="ml-1 text-slate-400 dark:text-slate-500">/ ${p.purchasePrice.toFixed(2)}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{p.currentStock}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{p.unit}</span>
                  {statusBadge(p.status)}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    title="Adjust stock"
                    onClick={() => onAdjustStock(p)}
                  >
                    <Boxes className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    title="Edit"
                    onClick={() => onEdit(p)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                    title="Delete"
                    onClick={() => onDelete(p)}
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
