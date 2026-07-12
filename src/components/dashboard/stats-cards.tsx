"use client";

import {
  DollarSign,
  Package,
  AlertTriangle,
  Receipt,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Card from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import type { DashboardOverview } from "@/types/dashboard";

interface StatsCardsProps {
  data: DashboardOverview | null;
  loading: boolean;
  error: string | null;
}

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ label, value, change, icon, iconBg }: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <Card className="flex items-start justify-between p-5">
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-xs font-medium">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span
              className={
                isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }
            >
              {isPositive ? "+" : ""}
              {(change ?? 0).toFixed(1)}%
            </span>
            <span className="text-slate-400 dark:text-slate-500">
              vs last month
            </span>
          </div>
        )}
      </div>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>
    </Card>
  );
}

const CARDS = [
  {
    key: "totalRevenue" as const,
    label: "Total Revenue",
    icon: DollarSign,
    bg: "bg-blue-50 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    format: (v?: number) =>
      `$${(v ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    changeKey: "revenueChange" as const,
  },
  {
    key: "totalSales" as const,
    label: "Items in Stock",
    icon: Package,
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    format: (v?: number) => (v ?? 0).toLocaleString(),
    changeKey: "salesChange" as const,
  },
  {
    key: "lowStockAlerts" as const,
    label: "Low Stock Alerts",
    icon: AlertTriangle,
    bg: "bg-amber-50 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    format: (v?: number) => (v ?? 0).toLocaleString(),
    changeKey: "alertsChange" as const,
  },
  {
    key: "recentExpenses" as const,
    label: "Total Expenses",
    icon: Receipt,
    bg: "bg-rose-50 dark:bg-rose-900/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    format: (v?: number) =>
      `$${(v ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    changeKey: "expensesChange" as const,
  },
];

export default function StatsCards({ data, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="space-y-3 p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((c) => (
        <StatCard
          key={c.key}
          label={c.label}
          value={data ? c.format(data[c.key]) : "—"}
          change={data?.[c.changeKey]}
          icon={<c.icon className={`h-5 w-5 ${c.iconColor}`} />}
          iconBg={c.bg}
        />
      ))}
    </div>
  );
}
