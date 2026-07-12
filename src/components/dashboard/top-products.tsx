"use client";

import { RefreshCw, Trophy } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/dashboard/empty-state";
import type { TopProduct } from "@/types/dashboard";

interface TopProductsProps {
  products: TopProduct[];
  loading: boolean;
  error: string | null;
  onRetry: () => Promise<void>;
}

export default function TopProducts({
  products: rawProducts,
  loading,
  error,
  onRetry,
}: TopProductsProps) {
  const products = Array.isArray(rawProducts) ? rawProducts : [];

  return (
    <Card className="flex h-full flex-col p-4">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
            <Trophy className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Top Products
          </h3>
        </div>
        {error && (
          <Button
            variant="ghost"
            onClick={onRetry}
            className="px-2 py-1 text-xs"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Retry
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-1 py-2">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
          {error}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Trophy}
          heading="No sales data yet"
          subtext="Your top-selling products will appear here after your first sale."
          ctaLabel="Go to Sales"
          ctaHref="/dashboard/sales"
        />
      ) : (
        <div className="flex-1 space-y-1">
          {products.map((p, i) => (
            <div
              key={p._id}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {p.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {p.totalSold} sold
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
                ${p.revenue.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
