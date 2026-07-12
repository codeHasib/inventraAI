"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import { useTheme } from "@/components/theme-provider";
import EmptyState from "@/components/dashboard/empty-state";
import type { RevenueResponse } from "@/types/dashboard";

interface RevenueChartProps {
  data: RevenueResponse | null;
  loading: boolean;
  error: string | null;
  onRetry: () => Promise<void>;
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
    <div className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <p className="text-slate-500 dark:text-slate-400">{label}</p>
      <p className="font-semibold text-gray-900 dark:text-white">
        ${val.toLocaleString()}
      </p>
    </div>
  );
}

export default function RevenueChart({
  data,
  loading,
  error,
  onRetry,
}: RevenueChartProps) {
  const { theme } = useTheme();

  const chartData = useMemo(() => {
    const points = data?.data;
    if (!Array.isArray(points) || points.length === 0) return [];
    return points.map((d) => ({
      ...d,
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data]);

  const isPositive = (data?.change ?? 0) >= 0;

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Revenue Overview
          </h3>
          {data && (
            <div className="mt-1 flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {isPositive ? "+" : ""}
                {(data.change ?? 0).toFixed(1)}%
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                vs last period
              </span>
            </div>
          )}
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
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : error ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
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
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="fill-slate-400 dark:fill-slate-500"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v ?? 0}`
                }
                className="fill-slate-400 dark:fill-slate-500"
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#revGrad)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: theme === "dark" ? "#60a5fa" : "#3b82f6",
                  stroke: theme === "dark" ? "#1e293b" : "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
