export interface Supplier {
  _id: string;
  shopId: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  address?: string;
  tradeLicense?: string;
  notes?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierFormData {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}
