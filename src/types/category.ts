export interface Category {
  _id: string;
  shopId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}
