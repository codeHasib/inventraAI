"use client";

import { motion } from "framer-motion";
import { RefreshCw, PackageX, AlertTriangle } from "lucide-react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import { useAlerts } from "@/hooks/use-alerts";

function WarningRow({ item }: { item: { _id: string; name: string; sku: string; currentStock: number; minimumStock: number; status: "LOW_STOCK" | "OUT_OF_STOCK"; category?: { name: string } } }) {
  const isOut = item.status === "OUT_OF_STOCK";

  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`flex items-center justify-between gap-3 rounded-xl border-l-2 px-4 py-3 transition-colors ${
        isOut
          ? "border-l-red-500/50 bg-red-50/50 hover:bg-red-50 dark:bg-red-500/[0.03] dark:hover:bg-red-500/[0.06]"
          : "border-l-amber-500/50 bg-amber-50/50 hover:bg-amber-50 dark:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06]"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {item.name}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          SKU: {item.sku}
          {item.category?.name && ` \u00B7 ${item.category.name}`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm tabular-nums text-zinc-500 dark:text-zinc-400">
          {item.currentStock}/{item.minimumStock}
        </span>
        <Badge variant={isOut ? "danger" : "warning"}>
          {isOut ? "Out of Stock" : "Low Stock"}
        </Badge>
      </div>
    </motion.div>
  );
}

export default function InventoryAlerts() {
  const { warnings, loading, error, refetch } = useAlerts();

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 dark:bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Inventory Alerts
            </h3>
            {!loading && warnings.length > 0 && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {warnings.length} item{warnings.length !== 1 ? "s" : ""} need
                attention
              </p>
            )}
          </div>
        </div>
        {error && (
          <Button
            variant="ghost"
            onClick={refetch}
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
            <div
              key={`alert-skeleton-${i}`}
              className="flex items-center justify-between rounded-xl px-4 py-3"
            >
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex h-40 items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
          {error}
        </div>
      ) : warnings.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
          <PackageX className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            All stock levels look good!
          </p>
        </div>
      ) : (
        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {warnings.map((w) => (
            <WarningRow key={w._id} item={w} />
          ))}
        </div>
      )}
    </Card>
  );
}
