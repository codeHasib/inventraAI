import type { PaymentMethod } from "./purchase";

export interface Expense {
  _id: string;
  shopId: string;
  title: string;
  amount: number;
  category: string;
  paymentMethod: PaymentMethod;
  expenseDate: string;
  vendor?: string;
  notes?: string;
  receiptImage?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  category: string;
  paymentMethod: PaymentMethod;
  expenseDate?: string;
  vendor?: string;
  notes?: string;
}
