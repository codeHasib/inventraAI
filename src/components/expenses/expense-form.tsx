"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import type { ExpenseFormData } from "@/types/expense";
import type { PaymentMethod } from "@/types/purchase";

const EXPENSE_CATEGORIES = [
  "Rent", "Utilities", "Salaries", "Office Supplies", "Marketing",
  "Transport", "Maintenance", "Insurance", "Software", "Other",
];

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<unknown>;
  onCancel: () => void;
  loading: boolean;
}

export default function ExpenseForm({ onSubmit, onCancel, loading }: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [vendor, setVendor] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!amount || parseFloat(amount) <= 0) e.amount = "Amount must be greater than 0";
    if (!category) e.category = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      paymentMethod,
      expenseDate: new Date(date).toISOString(),
      vendor: vendor.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title <span className="text-red-500">*</span></label>
        <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); setErrors((p) => { const n = { ...p }; delete n.title; return n; }); }} placeholder="e.g. Office rent"
          className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-gray-100 ${errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} />
        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount <span className="text-red-500">*</span></label>
          <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => { setAmount(e.target.value); setErrors((p) => { const n = { ...p }; delete n.amount; return n; }); }} placeholder="0.00"
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-gray-100 ${errors.amount ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} />
          {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category <span className="text-red-500">*</span></label>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setErrors((p) => { const n = { ...p }; delete n.category; return n; }); }}
            className={`w-full appearance-none rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-gray-100 ${errors.category ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}>
            <option value="">Select category</option>
            {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
            <option value="CASH">Cash</option><option value="CARD">Card</option><option value="MOBILE_MONEY">Mobile Money</option><option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vendor</label>
        <input type="text" value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Optional vendor name"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Optional notes..."
          className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="primary" loading={loading}>Record Expense</Button>
      </div>
    </form>
  );
}

export function ExpenseModal({ open, onClose, onSubmit }: {
  open: boolean; onClose: () => void;
  onSubmit: (data: ExpenseFormData) => Promise<unknown>;
}) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (data: ExpenseFormData) => {
    setLoading(true);
    try { await onSubmit(data); onClose(); } finally { setLoading(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Record Expense">
      <ExpenseForm onSubmit={handleSubmit} onCancel={onClose} loading={loading} />
    </Modal>
  );
}
