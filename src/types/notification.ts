export type NotificationType =
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "PRODUCT_EXPIRING"
  | "MONTHLY_SALES_SUMMARY"
  | "MONTHLY_PROFIT_SUMMARY";

export interface Notification {
  _id: string;
  shopId: string;
  type: NotificationType;
  title: string;
  message: string;
  productId?: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
}
