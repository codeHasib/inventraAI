"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import type { Product } from "@/types/product";

interface StockAdjustModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAdjust: (
    id: string,
    body: {
      currentStock: number;
      type: "ADD" | "SUBTRACT" | "SET";
      reason?: string;
    },
  ) => Promise<unknown>;
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
    const q = isNaN(Number(quantity)) ? 0 : Number(quantity);

    if (q < 0) {
      setError("Quantity must be a non-negative number");
      return;
    }
    if (!product) return;

    const currentStock = product.currentStock;
    let finalStock = 0;

    if (type === "ADD") finalStock = currentStock + q;
    else if (type === "SUBTRACT") finalStock = currentStock - q;
    else finalStock = q;

    if (finalStock < 0) {
      setError("Resulting stock cannot be negative");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await onAdjust(product._id, {
        currentStock: finalStock,
        type,
        reason: reason.trim() || undefined,
      });

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
        <div className="mb-4 rounded-lg bg-zinc-50 px-4 py-3 dark:bg-white/5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {product.name}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Current stock:{" "}
            <span className="font-semibold">{product.currentStock}</span>{" "}
            {product.unit}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Action
          </label>
          <div className="flex gap-2">
            {(["ADD", "SUBTRACT", "SET"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  type === t
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5"
                }`}
              >
                {t === "ADD"
                  ? "+ Add"
                  : t === "SUBTRACT"
                    ? "- Subtract"
                    : "= Set"}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Quantity
          </label>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setError("");
            }}
            placeholder="0"
            autoFocus
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20 ${
              error ? "border-red-500" : "border-zinc-200 dark:border-white/10"
            }`}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Reason (optional)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Received shipment, Damaged goods"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
          />
        </div>
        <div className="flex justify-end gap-3 border-t border-zinc-200/80 pt-4 dark:border-white/[0.08]">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
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
