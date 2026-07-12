"use client";

import { RefreshCw, PackageX, AlertTriangle } from "lucide-react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import type { InventoryWarning } from "@/types/dashboard";

interface InventoryAlertsProps {
  warnings: InventoryWarning[];
  loading: boolean;
  error: string | null;
  onRetry: () => Promise<void>;
}

function WarningRow({ item }: { item: InventoryWarning }) {
  const isOut = item.status === "OUT_OF_STOCK";

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3 transition-colors hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/50">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {item.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          SKU: {item.sku}
          {item.category?.name && ` \u00B7 ${item.category.name}`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm tabular-nums text-slate-500 dark:text-slate-400">
          {item.currentStock}/{item.minimumStock}
        </span>
        <Badge variant={isOut ? "danger" : "warning"}>
          {isOut ? "Out of Stock" : "Low Stock"}
        </Badge>
      </div>
    </div>
  );
}

export default function InventoryAlerts({
  warnings: rawWarnings,
  loading,
  error,
  onRetry,
}: InventoryAlertsProps) {
  const warnings = Array.isArray(rawWarnings) ? rawWarnings : [];

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/30">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Inventory Alerts
            </h3>
            {!loading && warnings.length > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {warnings.length} item{warnings.length !== 1 ? "s" : ""} need
                attention
              </p>
            )}
          </div>
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
            <div
              key={i}
              className="flex items-center justify-between rounded-lg px-4 py-3"
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
        <div className="flex h-40 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
          {error}
        </div>
      ) : warnings.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
          <PackageX className="h-8 w-8 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
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
