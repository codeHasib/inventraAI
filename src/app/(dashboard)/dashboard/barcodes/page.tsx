"use client";

import { useState, useCallback } from "react";
import { Search, Barcode, QrCode, FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import Skeleton from "@/components/ui/skeleton";
import Badge from "@/components/ui/badge";
import EmptyState from "@/components/dashboard/empty-state";
import { useProductsAll } from "@/hooks/use-products-all";
import { useBarcodes } from "@/hooks/use-barcodes";

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
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Barcode & Label Hub"
        subtitle="Generate barcodes and QR codes for your products"
        icon={Barcode}
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handlePrintBarcodes}
              disabled={selected.size === 0 || printing}
              className="text-sm"
            >
              {printing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
              Print Barcode Sheet
            </Button>
            <Button
              variant="secondary"
              onClick={handlePrintQr}
              disabled={selected.size === 0 || printing}
              className="text-sm"
            >
              {printing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <QrCode className="mr-2 h-4 w-4" />}
              Print QR Sheet
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
          />
        </div>
        {selected.size > 0 && (
          <Badge variant="default">{selected.size} selected</Badge>
        )}
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <EmptyState
            icon={Barcode}
            heading="No products to label"
            subtext="Add products first, then come back to generate barcodes."
          />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Barcode</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((p) => (
                <tr key={p._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="w-12 px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(p._id)}
                      onChange={() => toggleOne(p._id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{p.sku}</span>
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
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
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
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
