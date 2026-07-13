"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
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

function NavEntry({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActiveItem(pathname, item.href);
  return (
    <Link
      href={item.href}
      className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium"
    >
      {active && (
        <motion.div
          layoutId="activeNav"
          className="absolute inset-0 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/10"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <item.icon
        className={`relative h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${
          active
            ? "text-emerald-500 dark:text-emerald-400"
            : "text-zinc-400 dark:text-zinc-500"
        }`}
      />
      <span
        className={`relative transition-colors duration-200 ${
          active
            ? "text-zinc-900 dark:text-zinc-100"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}

function NavGroupBlock({
  group,
  pathname,
}: {
  group: NavGroup;
  pathname: string;
}) {
  const groupActive = group.items.some((i) => isActiveItem(pathname, i.href));
  const [open, setOpen] = useState(groupActive);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
          groupActive
            ? "text-zinc-900 dark:text-zinc-100"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }`}
      >
        <span>{group.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="mt-1 space-y-0.5 pl-3">
          {group.items.map((item) => (
            <NavEntry key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-zinc-200/80 bg-white transition-all duration-300 ease-in-out md:flex dark:border-white/[0.08] dark:bg-slate-950">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-zinc-200/80 px-6 transition-all duration-300 dark:border-white/[0.08]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          InventraAI
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_STRUCTURE.map((entry, i) => {
          if ("href" in entry) {
            return (
              <NavEntry key={entry.href} item={entry} pathname={pathname} />
            );
          }
          return (
            <NavGroupBlock
              key={`group-${i}`}
              group={entry}
              pathname={pathname}
            />
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-200/80 px-6 py-4 transition-all duration-300 dark:border-white/[0.08]">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          InventraAI v0.1.0
        </p>
      </div>
    </aside>
  );
}
