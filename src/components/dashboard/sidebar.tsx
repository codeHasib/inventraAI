"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      }`}
    >
      <item.icon className="h-[18px] w-[18px] shrink-0" />
      {item.label}
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
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          groupActive
            ? "text-slate-900 dark:text-white"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
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
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-6 dark:border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
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
      <div className="border-t border-slate-200 px-6 py-4 dark:border-slate-800">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          InventraAI v0.1.0
        </p>
      </div>
    </aside>
  );
}
