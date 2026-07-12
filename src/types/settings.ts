export interface Settings {
  _id: string;
  shopId: string;
  businessName: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  timezone: string;
  taxPercentage: number;
  invoicePrefix: string;
  lowStockThreshold: number;
  businessType: string;
}
