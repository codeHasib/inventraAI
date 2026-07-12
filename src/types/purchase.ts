export type PaymentStatus = "PENDING" | "PAID" | "PARTIAL" | "CANCELLED" | "REFUNDED";
export type PaymentMethod = "CASH" | "CARD" | "MOBILE_MONEY" | "BANK_TRANSFER";

export interface PurchaseItem {
  productId: string;
  quantity: number;
  purchasePrice: number;
  totalPrice: number;
}

export interface Purchase {
  _id: string;
  shopId: string;
  supplierId: string;
  invoiceNumber: string;
  purchaseDate: string;
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseFormData {
  supplierId: string;
  items: { productId: string; quantity: number; purchasePrice: number }[];
  discount: number;
  tax: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  purchaseDate?: string;
}
