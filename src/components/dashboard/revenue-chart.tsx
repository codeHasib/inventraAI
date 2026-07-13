"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/dashboard/empty-state";
import type { RevenueDataPoint } from "@/types/dashboard";

interface RevenueChartProps {
  data: RevenueDataPoint[];
  loading: boolean;
  error: string | null;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value ?? 0;
  return (
    <div className="rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-xs shadow-xl backdrop-blur-md dark:border-white/[0.08] dark:bg-zinc-900/95">
      <p className="text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
        ${val.toLocaleString()}
      </p>
    </div>
  );
}

export default function RevenueChart({
  data,
  loading,
  error,
}: RevenueChartProps) {
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return data.map((d) => ({
      ...d,
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data]);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Revenue Overview
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Daily revenue performance
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
            {error}
          </div>
        ) : chartData.length === 0 ? (
          <EmptyState
            heading="No revenue data yet"
            subtext="Revenue will appear here once you record your first sale."
            ctaLabel="Go to Sales"
            ctaHref="/dashboard/sales"
          />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-zinc-200 dark:stroke-white/[0.06]"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="fill-zinc-400 dark:fill-zinc-500"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v ?? 0}`
                }
                className="fill-zinc-400 dark:fill-zinc-500"
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="revenue"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </motion.div>
  );
}
