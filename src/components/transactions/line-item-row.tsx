"use client";

import { Trash2 } from "lucide-react";
import type { Product } from "@/types/product";

export interface LineItem {
  productId: string;
  quantity: number;
  price: number;
}

interface LineItemRowProps {
  item: LineItem;
  index: number;
  products: Product[];
  priceLabel: string;
  stockWarning?: boolean;
  onChange: (index: number, field: keyof LineItem, value: string) => void;
  onRemove: (index: number) => void;
}

export default function LineItemRow({
  item,
  index,
  products,
  priceLabel,
  stockWarning = false,
  onChange,
  onRemove,
}: LineItemRowProps) {
  const product = products.find((p) => p._id === item.productId);
  const subtotal = item.quantity * item.price;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <div className="min-w-0 flex-1 space-y-2">
        <select
          value={item.productId}
          onChange={(e) => onChange(index, "productId", e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400"
        >
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.sku})
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">Qty</label>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onChange(index, "quantity", e.target.value)}
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 ${
                stockWarning ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {stockWarning && product && (
              <p className="mt-1 text-xs text-red-500">Max: {product.currentStock}</p>
            )}
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">{priceLabel}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.price}
              onChange={(e) => onChange(index, "price", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400"
            />
          </div>
          <div className="pt-7">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              ${subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mt-7 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
