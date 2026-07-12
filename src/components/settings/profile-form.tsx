"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import type { Settings } from "@/types/settings";

interface ProfileFormProps {
  settings: Settings | null;
  saving: boolean;
  onSubmit: (payload: Partial<Settings>) => Promise<void>;
}

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "BDT", label: "BDT — Bangladeshi Taka" },
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "AUD", label: "AUD — Australian Dollar" },
  { value: "JPY", label: "JPY — Japanese Yen" },
];

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Dhaka", label: "Dhaka (BST)" },
  { value: "Asia/Kolkata", label: "Kolkata (IST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

export default function ProfileForm({
  settings,
  saving,
  onSubmit,
}: ProfileFormProps) {
  const [form, setForm] = useState({
    businessName: "",
    phone: "",
    email: "",
    address: "",
    currency: "USD",
    timezone: "UTC",
    taxPercentage: 0,
    invoicePrefix: "INV-",
    lowStockThreshold: 10,
    businessType: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        businessName: settings.businessName ?? "",
        phone: settings.phone ?? "",
        email: settings.email ?? "",
        address: settings.address ?? "",
        currency: settings.currency ?? "USD",
        timezone: settings.timezone ?? "UTC",
        taxPercentage: settings.taxPercentage ?? 0,
        invoicePrefix: settings.invoicePrefix ?? "INV-",
        lowStockThreshold: settings.lowStockThreshold ?? 10,
        businessType: settings.businessType ?? "",
      });
    }
  }, [settings]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="space-y-6 p-6">
        {/* Business Info */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
            Business Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Business Name"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              required
            />
            <Input
              label="Business Type"
              name="businessType"
              value={form.businessType}
              onChange={handleChange}
              placeholder="e.g. Retail, Wholesale"
            />
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4">
            <Input
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />

        {/* Regional */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
            Regional Settings
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Currency"
              name="currency"
              value={form.currency}
              onChange={handleChange}
              options={CURRENCIES}
            />
            <Select
              label="Timezone"
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              options={TIMEZONES}
            />
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />

        {/* Invoicing */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
            Invoicing & Inventory
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Invoice Prefix"
              name="invoicePrefix"
              value={form.invoicePrefix}
              onChange={handleChange}
              placeholder="INV-"
              maxLength={10}
            />
            <Input
              label="Tax %"
              name="taxPercentage"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={form.taxPercentage}
              onChange={handleChange}
            />
            <Input
              label="Low Stock Threshold"
              name="lowStockThreshold"
              type="number"
              min={0}
              value={form.lowStockThreshold}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </div>
      </Card>
    </form>
  );
}
