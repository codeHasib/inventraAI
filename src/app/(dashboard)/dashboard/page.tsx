"use client";

import { motion } from "framer-motion";
import { useDashboard } from "@/hooks/use-dashboard";
import StatsCards from "@/components/dashboard/stats-cards";
import RevenueChart from "@/components/dashboard/revenue-chart";
import TopProducts from "@/components/dashboard/top-products";
import InventoryAlerts from "@/components/dashboard/inventory-alerts";

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function DashboardPage() {
  const {
    overview,
    topProducts,
    loading,
    error,
    refetch,
  } = useDashboard();

  return (
    <motion.div
      className="space-y-6"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="space-y-1" variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Welcome back — here is an overview of your business.
        </p>
      </motion.div>

      {/* Stats bento grid */}
      <motion.div variants={fadeUp}>
        <StatsCards
          data={overview}
          loading={loading}
          error={error}
        />
      </motion.div>

      {/* Revenue + Top Products row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div className="lg:col-span-2" variants={fadeUp}>
          <RevenueChart
            data={overview?.revenueData ?? []}
            loading={loading}
            error={error}
          />
        </motion.div>
        <motion.div className="lg:col-span-1" variants={fadeUp}>
          <TopProducts
            data={topProducts}
            loading={loading}
            error={error}
            onRetry={refetch}
          />
        </motion.div>
      </div>

      {/* Inventory Alerts — full width */}
      <motion.div variants={fadeUp}>
        <InventoryAlerts />
      </motion.div>
    </motion.div>
  );
}
