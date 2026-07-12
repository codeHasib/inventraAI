"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import type { Product } from "@/types/product";

interface StockAdjustModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAdjust: (id: string, body: { quantity: number; type: "ADD" | "SUBTRACT" | "SET"; reason?: string }) => Promise<unknown>;
}

export default function StockAdjustModal({
  open,
  onClose,
  product,
  onAdjust,
}: StockAdjustModalProps) {
  const [type, setType] = useState<"ADD" | "SUBTRACT" | "SET">("ADD");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = parseInt(quantity, 10);
    if (isNaN(q) || q < 0) {
      setError("Quantity must be a non-negative number");
      return;
    }
    if (!product) return;
    setError("");
    setLoading(true);
    try {
      await onAdjust(product._id, { quantity: q, type, reason: reason.trim() || undefined });
      setQuantity("");
      setReason("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQuantity("");
    setReason("");
    setError("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Adjust Stock">
      {product && (
        <div className="mb-4 rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current stock: <span className="font-semibold">{product.currentStock}</span> {product.unit}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action</label>
          <div className="flex gap-2">
            {(["ADD", "SUBTRACT", "SET"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  type === t
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {t === "ADD" ? "+ Add" : t === "SUBTRACT" ? "- Subtract" : "= Set"}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quantity
          </label>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => { setQuantity(e.target.value); setError(""); }}
            placeholder="0"
            autoFocus
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 ${
              error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason (optional)</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Received shipment, Damaged goods"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
          />
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Apply Adjustment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
