"use client";

import { motion } from "framer-motion";
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

const currency = (v?: number) =>
  `$${(v ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type StatKey = "totalRevenue" | "totalSalesCount" | "totalExpenses" | "totalPurchases" | "totalProducts";

const CARDS: {
  key: StatKey;
  label: string;
  icon: typeof DollarSign;
  iconColor: string;
  glowColor: string;
  format: (v?: number) => string;
  primary?: boolean;
}[] = [
  {
    key: "totalRevenue",
    label: "Total Revenue",
    icon: DollarSign,
    iconColor: "text-emerald-500 dark:text-emerald-400",
    glowColor: "bg-emerald-500/10",
    format: currency,
    primary: true,
  },
  {
    key: "totalSalesCount",
    label: "Total Sales",
    icon: TrendingUp,
    iconColor: "text-blue-500 dark:text-blue-400",
    glowColor: "bg-blue-500/10",
    format: (v) => (v ?? 0).toLocaleString(),
  },
  {
    key: "totalExpenses",
    label: "Total Expenses",
    icon: Receipt,
    iconColor: "text-red-500 dark:text-red-400",
    glowColor: "bg-red-500/10",
    format: currency,
  },
  {
    key: "totalPurchases",
    label: "Total Purchases",
    icon: ShoppingCart,
    iconColor: "text-amber-500 dark:text-amber-400",
    glowColor: "bg-amber-500/10",
    format: currency,
  },
  {
    key: "totalProducts",
    label: "Total Products",
    icon: Package,
    iconColor: "text-violet-500 dark:text-violet-400",
    glowColor: "bg-violet-500/10",
    format: (v) => (v ?? 0).toLocaleString(),
  },
];

function StatCard({
  label,
  value,
  icon,
  iconColor,
  glowColor,
  primary,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
  glowColor: string;
  primary?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={primary ? "md:col-span-2" : ""}
    >
      <Card
        className={`relative overflow-hidden p-6 ${
          primary
            ? "shadow-[0_0_25px_rgba(16,185,129,0.08)] dark:shadow-[0_0_25px_rgba(16,185,129,0.15)]"
            : ""
        }`}
      >
        {/* Gradient wave overlay for primary card */}
        {primary && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <svg
              className="absolute bottom-0 left-0 w-full opacity-[0.07] dark:opacity-[0.12]"
              viewBox="0 0 400 80"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <path
                d="M0,40 C80,10 160,70 240,35 C320,0 360,50 400,30 L400,80 L0,80 Z"
                fill="url(#waveGrad)"
              />
            </svg>
          </div>
        )}

        <div className="relative z-10 flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {label}
            </p>
            <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {value}
            </p>
          </div>
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${glowColor}`}
          >
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function StatsCards({ data, loading, error }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`skeleton-stat-${i}`}
            className={`${i === 0 ? "md:col-span-2" : ""}`}
          >
            <Card className="space-y-3 p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </Card>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {CARDS.map((c) => (
        <StatCard
          key={c.key}
          label={c.label}
          value={data ? c.format(data?.[c.key]) : "\u2014"}
          icon={<c.icon className={`h-5 w-5 ${c.iconColor}`} />}
          iconColor={c.iconColor}
          glowColor={c.glowColor}
          primary={c.primary}
        />
      ))}
    </div>
  );
}
