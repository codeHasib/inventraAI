"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import CategoryForm from "./category-form";
import type { Category, CategoryFormData } from "@/types/category";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Category;
  onSubmit: (data: CategoryFormData) => Promise<unknown>;
}

export default function CategoryModal({
  open,
  onClose,
  initialData,
  onSubmit,
}: CategoryModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CategoryFormData) => {
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
      title={initialData ? "Edit Category" : "New Category"}
    >
      <CategoryForm
        key={initialData?._id ?? "new"}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
