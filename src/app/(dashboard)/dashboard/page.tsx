"use client";

import { motion } from "framer-motion";
import { useDashboard } from "@/hooks/use-dashboard";
import StatsCards from "@/components/dashboard/stats-cards";
import RevenueChart from "@/components/dashboard/revenue-chart";
import TopProducts from "@/components/dashboard/top-products";
import InventoryAlerts from "@/components/dashboard/inventory-alerts";
import AiQuickAsk from "@/components/dashboard/ai-quick-ask";

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function DashboardPage() {
  const {
    overview,
    warnings,
    topProducts,
    loading,
    error,
    refetch,
  } = useDashboard();

  return (
    <motion.div
      className="grid grid-cols-1 gap-6 p-6 md:grid-cols-12"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div className="col-span-full space-y-1" variants={fadeUp}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Welcome back — here is an overview of your business.
        </p>
      </motion.div>

      {/* AI Quick-Ask */}
      <motion.div className="col-span-full" variants={fadeUp}>
        <AiQuickAsk />
      </motion.div>

      {/* Stats row */}
      <motion.div className="col-span-full" variants={fadeUp}>
        <StatsCards
          data={overview}
          loading={loading}
          error={error}
        />
      </motion.div>

      {/* Revenue chart */}
      <motion.div className="col-span-full lg:col-span-8" variants={fadeUp}>
        <RevenueChart
          data={overview?.revenueData ?? []}
          loading={loading}
          error={error}
        />
      </motion.div>

      {/* Top Products */}
      <motion.div className="col-span-full lg:col-span-4" variants={fadeUp}>
        <TopProducts
          data={topProducts}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      </motion.div>

      {/* Inventory Alerts */}
      <motion.div className="col-span-full" variants={fadeUp}>
        <InventoryAlerts
          data={warnings}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      </motion.div>
    </motion.div>
  );
}
