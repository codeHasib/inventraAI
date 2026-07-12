"use client";

import {
  DollarSign,
  TrendingUp,
  Receipt,
  ShoppingCart,
  Package,
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
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ label, value, icon, iconBg }: StatCardProps) {
  return (
    <Card className="flex items-start justify-between p-5">
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>
    </Card>
  );
}

const currency = (v?: number) =>
  `$${(v ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CARDS: {
  key: keyof DashboardOverview;
  label: string;
  icon: typeof DollarSign;
  bg: string;
  iconColor: string;
  format: (v?: number) => string;
}[] = [
  {
    key: "totalRevenue",
    label: "Total Revenue",
    icon: DollarSign,
    bg: "bg-blue-50 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    format: currency,
  },
  {
    key: "totalSalesCount",
    label: "Total Sales",
    icon: TrendingUp,
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    format: (v) => (v ?? 0).toLocaleString(),
  },
  {
    key: "totalExpenses",
    label: "Total Expenses",
    icon: Receipt,
    bg: "bg-rose-50 dark:bg-rose-900/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    format: currency,
  },
  {
    key: "totalPurchases",
    label: "Total Purchases",
    icon: ShoppingCart,
    bg: "bg-amber-50 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    format: currency,
  },
  {
    key: "totalProducts",
    label: "Total Products",
    icon: Package,
    bg: "bg-violet-50 dark:bg-violet-900/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    format: (v) => (v ?? 0).toLocaleString(),
  },
];

export default function StatsCards({ data, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="space-y-3 p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {CARDS.map((c) => (
        <StatCard
          key={c.key}
          label={c.label}
          value={data ? c.format(data[c.key]) : "\u2014"}
          icon={<c.icon className={`h-5 w-5 ${c.iconColor}`} />}
          iconBg={c.bg}
        />
      ))}
    </div>
  );
}
