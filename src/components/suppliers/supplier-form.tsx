"use client";

import { useState } from "react";
import type { Supplier, SupplierFormData } from "@/types/supplier";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";

interface SupplierFormProps {
  initialData?: Supplier;
  onSubmit: (data: SupplierFormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function SupplierForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: SupplierFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [company, setCompany] = useState(initialData?.company ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Contact name is required";
    if (!phone.trim()) e.phone = "Phone number is required";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "Invalid email address";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: name.trim(),
      company: company.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Contact Name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoFocus
        />
        <Input
          label="Company"
          placeholder="Acme Corp (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Email"
          type="email"
          placeholder="john@acme.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="Phone"
          placeholder="+1 (555) 123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
        />
      </div>
      <Textarea
        label="Address"
        placeholder="123 Main St, City, Country"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        rows={2}
      />
      <Textarea
        label="Notes"
        placeholder="Optional notes about this supplier..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
      />
      <div className="flex justify-end gap-3 border-t border-zinc-200/80 pt-4 dark:border-white/[0.08]">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? "Update Supplier" : "Create Supplier"}
        </Button>
      </div>
    </form>
  );
}
