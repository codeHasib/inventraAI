"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Barcode, QrCode, FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import Skeleton from "@/components/ui/skeleton";
import Badge from "@/components/ui/badge";
import EmptyState from "@/components/dashboard/empty-state";
import { useProductsAll } from "@/hooks/use-products-all";
import { useBarcodes } from "@/hooks/use-barcodes";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export default function BarcodesPage() {
  const { products, loading } = useProductsAll();
  const { generateBarcode, printBarcodeSheet, printQrSheet, generating, printing } = useBarcodes();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.barcode && p.barcode.toLowerCase().includes(q))
    );
  });

  const toggleAll = useCallback(() => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p._id)));
    }
  }, [filtered, selected.size]);

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGenerate = async (productId: string) => {
    try {
      await generateBarcode(productId);
    } catch {
      // toast handled inside hook
    }
  };

  const handlePrintBarcodes = async () => {
    if (selected.size === 0) {
      toast.error("Select at least one product");
      return;
    }
    try {
      await printBarcodeSheet(Array.from(selected));
    } catch {
      // toast handled inside hook
    }
  };

  const handlePrintQr = async () => {
    if (selected.size === 0) {
      toast.error("Select at least one product");
      return;
    }
    try {
      await printQrSheet(Array.from(selected));
    } catch {
      // toast handled inside hook
    }
  };

  const allChecked = filtered.length > 0 && selected.size === filtered.length;

  if (loading) {
    return (
      <motion.div
        className="space-y-6 p-4 sm:p-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeInUp}><Skeleton className="h-8 w-64" /></motion.div>
        <motion.div variants={fadeInUp}><Skeleton className="h-10 w-full max-w-sm" /></motion.div>
        <motion.div variants={fadeInUp} className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6 p-4 sm:p-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp}>
        <PageHeader
          title="Barcode & Label Hub"
          subtitle="Generate barcodes and QR codes for your products"
          icon={Barcode}
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                onClick={handlePrintBarcodes}
                disabled={selected.size === 0 || printing}
                className="text-sm"
              >
                {printing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                Print Barcode
              </Button>
              <Button
                variant="secondary"
                onClick={handlePrintQr}
                disabled={selected.size === 0 || printing}
                className="text-sm"
              >
                {printing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <QrCode className="mr-2 h-4 w-4" />}
                Print QR
              </Button>
            </div>
          }
        />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
            />
          </div>
          {selected.size > 0 && (
            <Badge variant="default">{selected.size} selected</Badge>
          )}
        </div>
      </motion.div>

      {products.length === 0 ? (
        <motion.div variants={fadeInUp}>
          <div className="rounded-xl border border-zinc-200/80 bg-white dark:border-white/[0.06] dark:bg-zinc-900/40">
            <EmptyState
              icon={Barcode}
              heading="No products to label"
              subtext="Add products first, then come back to generate barcodes."
            />
          </div>
        </motion.div>
      ) : (
        <>
          {/* Desktop table */}
          <motion.div variants={fadeInUp} className="hidden overflow-x-auto rounded-xl border border-zinc-200/80 bg-white dark:border-white/[0.06] dark:bg-zinc-900/40 md:block">
            <table className="min-w-full divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
              <thead>
                <tr className="border-b border-zinc-200/80 dark:border-white/[0.06]">
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Barcode</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/[0.06]">
                {filtered.map((p) => (
                  <tr key={p._id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-white/[0.02]">
                    <td className="w-12 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(p._id)}
                        onChange={() => toggleOne(p._id)}
                        className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{p.name}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">{p.sku}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {p.barcode ? (
                        <Badge variant="success">{p.barcode}</Badge>
                      ) : (
                        <Badge variant="warning">No barcode</Badge>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {!p.barcode && (
                        <button
                          type="button"
                          onClick={() => handleGenerate(p._id)}
                          disabled={generating}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                        >
                          {generating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Barcode className="h-3.5 w-3.5" />
                          )}
                          Generate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
                      No products match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>

          {/* Mobile cards */}
          <motion.div
            className="flex flex-col gap-3 md:hidden"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((p) => (
              <motion.div
                key={p._id}
                variants={fadeInUp}
                className="w-full bg-white p-4 border border-zinc-200/50 rounded-xl space-y-2 flex flex-col dark:bg-zinc-900/40 dark:border-white/5"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.has(p._id)}
                    onChange={() => toggleOne(p._id)}
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{p.name}</span>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">{p.sku}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {p.barcode ? (
                    <Badge variant="success">{p.barcode}</Badge>
                  ) : (
                    <Badge variant="warning">No barcode</Badge>
                  )}
                  {!p.barcode && (
                    <button
                      type="button"
                      onClick={() => handleGenerate(p._id)}
                      disabled={generating}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                    >
                      {generating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Barcode className="h-3.5 w-3.5" />
                      )}
                      Generate
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
                No products match your search.
              </div>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
