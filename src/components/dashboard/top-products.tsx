"use client";

import { motion } from "framer-motion";
import { RefreshCw, Trophy } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/dashboard/empty-state";
import type { TopProduct } from "@/types/dashboard";

interface TopProductsProps {
  data: TopProduct[];
  loading: boolean;
  error: string | null;
  onRetry: () => Promise<void>;
}

export default function TopProducts({
  data: rawProducts,
  loading,
  error,
  onRetry,
}: TopProductsProps) {
  const products = Array.isArray(rawProducts) ? rawProducts : [];

  return (
    <Card className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-500/10">
            <Trophy className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
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
            <div key={`top-skeleton-${i}`} className="flex items-center justify-between px-1 py-2">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
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
        <div className="flex-1 space-y-2">
          {products.map((p, i) => (
            <motion.div
              key={p._id}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center justify-between gap-3 rounded-xl border-l-2 border-emerald-500/40 bg-zinc-100/50 px-4 py-3 transition-colors hover:bg-zinc-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.05]"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200/80 text-xs font-bold text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {p.name}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                ${(p.revenue ?? 0).toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}
