"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import type { SaleFormData } from "@/types/sale";
import type { Product } from "@/types/product";
import type { PaymentMethod } from "@/types/purchase";

interface SaleFormProps {
  products: Product[];
  onSubmit: (data: SaleFormData) => Promise<unknown>;
  onCancel: () => void;
  loading: boolean;
}

interface SaleLineItem {
  productId: string;
  quantity: number;
  sellingPrice: number;
}

export default function SaleForm({ products, onSubmit, onCancel, loading }: SaleFormProps) {
  const [items, setItems] = useState<SaleLineItem[]>([]);
  const [discount, setDiscount] = useState("0");
  const [tax, setTax] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addItem = () => setItems((prev) => [...prev, { productId: "", quantity: 1, sellingPrice: 0 }]);

  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const changeItem = useCallback((i: number, field: string, value: string) => {
    setItems((prev) => prev.map((item, idx) => {
      if (idx !== i) return item;
      if (field === "productId") {
        const product = products.find((p) => p._id === value);
        return { ...item, productId: value, sellingPrice: product?.sellingPrice ?? 0 };
      }
      if (field === "quantity") return { ...item, quantity: Math.max(1, parseInt(value, 10) || 1) };
      return { ...item, sellingPrice: Math.max(0, parseFloat(value) || 0) };
    }));
  }, [products]);

  const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.quantity * it.sellingPrice, 0), [items]);
  const total = subtotal - parseFloat(discount || "0") + parseFloat(tax || "0");

  const validate = () => {
    const e: Record<string, string> = {};
    if (items.length === 0) { e.items = "Add at least one item"; }
    items.forEach((it, i) => {
      if (!it.productId) e[`item_${i}`] = "Select a product";
      const product = products.find((p) => p._id === it.productId);
      if (product && it.quantity > product.currentStock) e[`item_${i}`] = `Only ${product.currentStock} in stock`;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const computedSubtotal = subtotal;
    const computedGrandTotal = total;
    await onSubmit({
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      items: items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        unitPrice: it.sellingPrice,
      })),
      subtotal: computedSubtotal,
      discount: parseFloat(discount) || 0,
      tax: parseFloat(tax) || 0,
      grandTotal: computedGrandTotal,
      paymentMethod,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Customer Name</label>
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Walk-in customer"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Customer Phone</label>
          <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Optional"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full appearance-none rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100">
            <option value="CASH">Cash</option><option value="CARD">Card</option><option value="MOBILE_MONEY">Mobile Money</option><option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Discount</label>
          <input type="number" min="0" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tax</label>
          <input type="number" min="0" step="0.01" value={tax} onChange={(e) => setTax(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Line Items <span className="text-red-500">*</span></p>
          <Button type="button" variant="secondary" onClick={addItem} className="text-xs"><Plus className="mr-1 h-3 w-3" />Add Item</Button>
        </div>
        {errors.items && <p className="text-xs text-red-500">{errors.items}</p>}
        {items.length === 0 && <p className="text-sm text-zinc-400 dark:text-zinc-500">No items added. Click &quot;Add Item&quot; to begin.</p>}
        {items.map((item, i) => {
          const product = products.find((p) => p._id === item.productId);
          const overStock = product && item.quantity > product.currentStock;
          const subtotal = item.quantity * item.sellingPrice;
          return (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-zinc-200/80 p-3 dark:border-white/[0.08]">
              <div className="min-w-0 flex-1 space-y-2">
                <select value={item.productId} onChange={(e) => { changeItem(i, "productId", e.target.value); setErrors((p) => { const n = { ...p }; delete n[`item_${i}`]; return n; }); }}
                  className="w-full appearance-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100">
                  <option value="">Select product</option>
                  {products.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.sku}) — stock: {p.currentStock}</option>)}
                </select>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Qty</label>
                    <input type="number" min="1" value={item.quantity} onChange={(e) => changeItem(i, "quantity", e.target.value)}
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-white/5 dark:text-zinc-100 ${overStock ? "border-red-500" : "border-zinc-200 dark:border-white/10"}`} />
                    {overStock && <p className="mt-1 text-xs text-red-500">Max: {product?.currentStock}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Selling Price</label>
                    <input type="number" min="0" step="0.01" value={item.sellingPrice} onChange={(e) => changeItem(i, "sellingPrice", e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100" />
                  </div>
                  <div className="pt-7"><span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">${subtotal.toFixed(2)}</span></div>
                </div>
              </div>
              <button type="button" onClick={() => removeItem(i)} className="mt-7 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
              {errors[`item_${i}`] && <p className="mt-1 w-full text-xs text-red-500">{errors[`item_${i}`]}</p>}
            </div>
          );
        })}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Optional notes..."
          className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100" />
      </div>

      <div className="rounded-lg bg-zinc-50 px-4 py-3 dark:bg-white/[0.02]">
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400"><span>Discount</span><span>-${parseFloat(discount || "0").toFixed(2)}</span></div>
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400"><span>Tax</span><span>+${parseFloat(tax || "0").toFixed(2)}</span></div>
        <div className="mt-2 flex justify-between border-t border-zinc-200/80 pt-2 text-base font-semibold text-zinc-900 dark:border-white/[0.08] dark:text-zinc-100"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>

      <div className="flex justify-end gap-3 border-t border-zinc-200/80 pt-4 dark:border-white/[0.08]">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="primary" loading={loading}>Record Sale</Button>
      </div>
    </form>
  );
}

export function SaleModal({ open, onClose, products, onSubmit }: {
  open: boolean; onClose: () => void; products: Product[];
  onSubmit: (data: SaleFormData) => Promise<unknown>;
}) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (data: SaleFormData) => {
    setLoading(true);
    try { await onSubmit(data); onClose(); } finally { setLoading(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Record Sale" wide>
      <SaleForm products={products} onSubmit={handleSubmit} onCancel={onClose} loading={loading} />
    </Modal>
  );
}
