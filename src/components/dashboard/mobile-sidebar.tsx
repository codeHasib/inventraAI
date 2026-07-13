"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tags,
  Barcode,
  Truck,
  ShoppingCart,
  Banknote,
  Receipt,
  Sparkles,
  Settings,
  Zap,
  ChevronDown,
  X,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_STRUCTURE: (NavItem | NavGroup)[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  {
    label: "Inventory",
    items: [
      { href: "/dashboard/categories", label: "Categories", icon: Tags },
      { href: "/dashboard/products", label: "Products", icon: Package },
      { href: "/dashboard/barcodes", label: "Barcodes", icon: Barcode },
    ],
  },
  {
    label: "Supply Chain",
    items: [
      { href: "/dashboard/suppliers", label: "Suppliers", icon: Truck },
      { href: "/dashboard/purchases", label: "Purchases", icon: ShoppingCart },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/dashboard/sales", label: "Sales / POS", icon: Banknote },
      { href: "/dashboard/expenses", label: "Expenses", icon: Receipt },
    ],
  },
  { href: "/dashboard/ai-knowledge", label: "AI Hub", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function isActiveItem(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname.startsWith(href);
}

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Command panel — slides from left */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-200/80 bg-white transition-all duration-300 dark:border-white/[0.08] dark:bg-slate-950"
          >
            {/* Brand + close */}
            <div className="flex h-16 items-center justify-between border-b border-zinc-200/80 px-6 transition-all duration-300 dark:border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  InventraAI
                </span>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-zinc-300"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {NAV_STRUCTURE.map((entry, i) => {
                if ("href" in entry) {
                  const active = isActiveItem(pathname, entry.href);
                  return (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium"
                    >
                      {active && (
                        <motion.div
                          layoutId="activeNavMobile"
                          className="absolute inset-0 rounded-lg bg-emerald-500/10"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <entry.icon
                        className={`relative h-[18px] w-[18px] shrink-0 ${
                          active ? "text-emerald-500 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-500"
                        }`}
                      />
                      <span
                        className={`relative ${
                          active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"
                        }`}
                      >
                        {entry.label}
                      </span>
                    </Link>
                  );
                }

                const groupKey = `group-${i}`;
                const groupActive = entry.items.some((item) =>
                  isActiveItem(pathname, item.href),
                );
                const isOpen = openGroups[groupKey] ?? groupActive;

                return (
                  <div key={groupKey}>
                    <button
                      onClick={() =>
                        setOpenGroups((prev) => ({
                          ...prev,
                          [groupKey]: !prev[groupKey],
                        }))
                      }
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        groupActive
                          ? "text-zinc-900 dark:text-zinc-100"
                          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                      }`}
                    >
                      <span>{entry.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-1 space-y-0.5 pl-3">
                        {entry.items.map((item) => {
                          const active = isActiveItem(pathname, item.href);
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium"
                            >
                              {active && (
                                <motion.div
                                  layoutId="activeNavMobile"
                                  className="absolute inset-0 rounded-lg bg-emerald-500/10"
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                              )}
                              <item.icon
                                className={`relative h-[18px] w-[18px] shrink-0 ${
                                  active ? "text-emerald-500 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-500"
                                }`}
                              />
                              <span
                                className={`relative ${
                                  active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"
                                }`}
                              >
                                {item.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="border-t border-zinc-200/80 px-6 py-4 transition-all duration-300 dark:border-white/[0.08]">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                InventraAI v0.1.0
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
