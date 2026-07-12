import type { PaymentMethod, PaymentStatus } from "./purchase";

export interface SaleItem {
  productId: string;
  productName: string;
  sku: string;
  barcode?: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  profitPerUnit: number;
  total: number;
}

export interface Sale {
  _id: string;
  shopId: string;
  invoiceNumber: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerName: string;
  customerPhone?: string;
  notes?: string;
  saleDate: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SaleFormData {
  items: { productId: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  saleDate?: string;
}
