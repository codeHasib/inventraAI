"use client";

import { useState } from "react";
import { Receipt, Plus } from "lucide-react";
import Button from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import ExpenseTable from "@/components/expenses/expense-table";
import { ExpenseModal } from "@/components/expenses/expense-form";
import { useExpensesAll } from "@/hooks/use-expenses-all";
import type { Expense } from "@/types/expense";

export default function ExpensesPage() {
  const { expenses, loading, deleteExpense, createExpense } = useExpensesAll();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Expense | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = (e: Expense) => { setTarget(e); setConfirmOpen(true); };
  const confirmDelete = async () => { if (target) { await deleteExpense(target._id); setTarget(null); setConfirmOpen(false); } };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Expenses"
        subtitle="Track and manage business expenses."
        icon={Receipt}
        action={<Button variant="primary" onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Record Expense</Button>}
      />
      <ExpenseTable expenses={expenses} loading={loading} onDelete={handleDelete} onEmptyCtaClick={() => setOpen(true)} />
      <ExpenseModal key="expense-create" open={open} onClose={() => setOpen(false)} onSubmit={createExpense} />
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete}
        title="Delete Expense" message={`Permanently delete "${target?.title ?? ""}"? This cannot be undone.`} />
    </div>
  );
}
