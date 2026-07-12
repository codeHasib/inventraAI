"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import SupplierForm from "./supplier-form";
import type { Supplier, SupplierFormData } from "@/types/supplier";

interface SupplierModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Supplier;
  onSubmit: (data: SupplierFormData) => Promise<unknown>;
}

export default function SupplierModal({
  open,
  onClose,
  initialData,
  onSubmit,
}: SupplierModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: SupplierFormData) => {
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
      title={initialData ? "Edit Supplier" : "New Supplier"}
      wide
    >
      <SupplierForm
        key={initialData?._id ?? "new"}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
