"use client";

import { motion } from "framer-motion";

const bars = [
  { label: "M", height: 35 },
  { label: "T", height: 60 },
  { label: "W", height: 45 },
  { label: "T", height: 80 },
  { label: "F", height: 55 },
  { label: "S", height: 70 },
  { label: "S", height: 90 },
];

const alerts = [
  { icon: "\u26A0", product: "Widget-A", status: "Low Stock", change: "-2", variant: "amber" as const },
  { icon: "\u2713", product: "Widget-B", status: "Restocked", change: "+50", variant: "emerald" as const },
  { icon: "\u26A0", product: "Widget-C", status: "Expiring", change: "3d", variant: "rose" as const },
];

export default function InventoryMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-lg"
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Inventory Tracker
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-400">LIVE</span>
          </div>
        </div>

        {/* Bar Chart */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="mb-6"
        >
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-white/30">Stock Levels</p>
          <div className="flex items-end gap-1.5" style={{ height: 110 }}>
            {bars.map((bar, i) => (
              <div key={`bar-${i}`} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full origin-bottom rounded-t bg-gradient-to-t from-emerald-500/70 to-cyan-400/70"
                  style={{ height: `${bar.height}%` }}
                />
                <span className="text-[9px] font-medium text-white/25">{bar.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Alerts */}
        <div className="mb-6">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-white/30">Recent Alerts</p>
          <div className="space-y-1.5">
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.product}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.12 }}
                className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-xs ${
                      alert.variant === "amber"
                        ? "text-amber-400"
                        : alert.variant === "emerald"
                          ? "text-emerald-400"
                          : "text-rose-400"
                    }`}
                  >
                    {alert.icon}
                  </span>
                  <span className="text-xs font-medium text-white/70">{alert.product}</span>
                  <span className="text-[11px] text-white/25">{alert.status}</span>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    alert.change.startsWith("-") || alert.change.endsWith("d")
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  {alert.change}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.2 }}
            className="rounded-lg bg-white/[0.04] p-3"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/25">Turnover Rate</p>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white">94.2%</span>
              <span className="text-xs font-medium text-emerald-400">&uarr;</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.3 }}
            className="rounded-lg bg-white/[0.04] p-3"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/25">Active SKUs</p>
            <p className="mt-1.5 text-lg font-bold text-white">1,247</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
