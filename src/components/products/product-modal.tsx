"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import ProductForm from "./product-form";
import type { Product, ProductFormData } from "@/types/product";
import type { Category } from "@/types/category";
import type { Supplier } from "@/types/supplier";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Product;
  categories: Category[];
  suppliers: Supplier[];
  onSubmit: (data: ProductFormData) => Promise<unknown>;
}

export default function ProductModal({
  open,
  onClose,
  initialData,
  categories,
  suppliers,
  onSubmit,
}: ProductModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? "Edit Product" : "New Product"}
      wide
    >
      <ProductForm
        key={initialData?._id ?? "new"}
        initialData={initialData}
        categories={categories}
        suppliers={suppliers}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
