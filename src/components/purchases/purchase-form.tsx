"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import LineItemRow from "@/components/transactions/line-item-row";
import type { PurchaseFormData } from "@/types/purchase";
import type { Product } from "@/types/product";
import type { Supplier } from "@/types/supplier";
import type { PaymentStatus, PaymentMethod } from "@/types/purchase";

interface PurchaseFormProps {
  products: Product[];
  suppliers: Supplier[];
  onSubmit: (data: PurchaseFormData) => Promise<unknown>;
  onCancel: () => void;
  loading: boolean;
}

export default function PurchaseForm({ products, suppliers, onSubmit, onCancel, loading }: PurchaseFormProps) {
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState<{ productId: string; quantity: number; price: number }[]>([]);
  const [discount, setDiscount] = useState("0");
  const [tax, setTax] = useState("0");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("PENDING");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addItem = () => setItems((prev) => [...prev, { productId: "", quantity: 1, price: 0 }]);

  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const changeItem = useCallback((i: number, field: string, value: string) => {
    setItems((prev) => prev.map((item, idx) => {
      if (idx !== i) return item;
      if (field === "productId") {
        const product = products.find((p) => p._id === value);
        return { ...item, productId: value, price: product?.purchasePrice ?? 0 };
      }
      if (field === "quantity") return { ...item, quantity: Math.max(1, parseInt(value, 10) || 1) };
      return { ...item, price: Math.max(0, parseFloat(value) || 0) };
    }));
  }, [products]);

  const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.quantity * it.price, 0), [items]);
  const total = subtotal - parseFloat(discount || "0") + parseFloat(tax || "0");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!supplierId) e.supplierId = "Supplier is required";
    if (items.length === 0) e.items = "Add at least one item";
    items.forEach((it, i) => {
      if (!it.productId) e[`item_${i}`] = "Select a product";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      supplierId,
      items: items.map((it) => ({ productId: it.productId, quantity: it.quantity, purchasePrice: it.price })),
      discount: parseFloat(discount) || 0,
      tax: parseFloat(tax) || 0,
      paymentStatus,
      paymentMethod,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier <span className="text-red-500">*</span></label>
          <select value={supplierId} onChange={(e) => { setSupplierId(e.target.value); setErrors((p) => { const n = { ...p }; delete n.supplierId; return n; }); }}
            className={`w-full appearance-none rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 ${errors.supplierId ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}>
            <option value="">Select supplier</option>
            {suppliers.map((s) => <option key={s._id} value={s._id}>{s.company || s.name}</option>)}
          </select>
          {errors.supplierId && <p className="text-xs text-red-500">{errors.supplierId}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
            <option value="CASH">Cash</option><option value="CARD">Card</option><option value="MOBILE_MONEY">Mobile Money</option><option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Status</label>
          <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
            <option value="PENDING">Pending</option><option value="PAID">Paid</option><option value="PARTIAL">Partial</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Discount</label>
          <input type="number" min="0" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tax</label>
          <input type="number" min="0" step="0.01" value={tax} onChange={(e) => setTax(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Line Items <span className="text-red-500">*</span></p>
          <Button type="button" variant="secondary" onClick={addItem} className="text-xs"><Plus className="mr-1 h-3 w-3" />Add Item</Button>
        </div>
        {errors.items && <p className="text-xs text-red-500">{errors.items}</p>}
        {items.length === 0 && <p className="text-sm text-slate-400 dark:text-slate-500">No items added. Click &quot;Add Item&quot; to begin.</p>}
        {items.map((item, i) => (
          <div key={i}>
            <LineItemRow item={item} index={i} products={products} priceLabel="Unit Cost" onChange={changeItem} onRemove={removeItem} />
            {errors[`item_${i}`] && <p className="mt-1 text-xs text-red-500">{errors[`item_${i}`]}</p>}
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Optional notes..."
          className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
      </div>

      <div className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400"><span>Discount</span><span>-${parseFloat(discount || "0").toFixed(2)}</span></div>
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400"><span>Tax</span><span>+${parseFloat(tax || "0").toFixed(2)}</span></div>
        <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-gray-900 dark:border-slate-700 dark:text-white"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="primary" loading={loading}>Create Purchase</Button>
      </div>
    </form>
  );
}

export function PurchaseModal({ open, onClose, products, suppliers, onSubmit }: {
  open: boolean; onClose: () => void; products: Product[]; suppliers: Supplier[];
  onSubmit: (data: PurchaseFormData) => Promise<unknown>;
}) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (data: PurchaseFormData) => {
    setLoading(true);
    try { await onSubmit(data); onClose(); } finally { setLoading(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Record Purchase" wide>
      <PurchaseForm products={products} suppliers={suppliers} onSubmit={handleSubmit} onCancel={onClose} loading={loading} />
    </Modal>
  );
}
