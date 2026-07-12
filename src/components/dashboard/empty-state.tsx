"use client";

import type { LucideIcon } from "lucide-react";
import { PackageOpen } from "lucide-react";
import Button from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  heading?: string;
  subtext?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyState({
  icon: Icon = PackageOpen,
  heading = "No data available yet",
  subtext = "Add your first product to see analytics here.",
  ctaLabel = "+ Add Product",
  ctaHref = "/dashboard/products/new",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
        <Icon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        {heading}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {subtext}
      </p>
      <Button
        variant="primary"
        className="mt-5"
        onClick={() => {
          window.location.href = ctaHref;
        }}
      >
        {ctaLabel}
      </Button>
    </div>
  );
}
