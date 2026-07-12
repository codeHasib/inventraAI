export type ProductStatus = "ACTIVE" | "LOW_STOCK" | "OUT_OF_STOCK" | "DISCONTINUED";

export interface Product {
  _id: string;
  shopId: string;
  categoryId: string;
  supplierId: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  brand?: string;
  purchasePrice: number;
  sellingPrice: number;
  profitMargin?: number;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  unit: string;
  images?: string[];
  expiryDate?: string;
  manufactureDate?: string;
  status: ProductStatus;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  categoryId: string;
  supplierId: string;
  sku: string;
  description?: string;
  barcode?: string;
  brand?: string;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  unit: string;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
