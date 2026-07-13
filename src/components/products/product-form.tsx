"use client";

import { useState } from "react";
import type { Product, ProductFormData } from "@/types/product";
import type { Category } from "@/types/category";
import type { Supplier } from "@/types/supplier";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
  suppliers: Supplier[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function ProductForm({
  initialData,
  categories,
  suppliers,
  onSubmit,
  onCancel,
  loading,
}: ProductFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [sku, setSku] = useState(initialData?.sku ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [supplierId, setSupplierId] = useState(initialData?.supplierId ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [brand, setBrand] = useState(initialData?.brand ?? "");
  const [purchasePrice, setPurchasePrice] = useState(String(initialData?.purchasePrice ?? ""));
  const [sellingPrice, setSellingPrice] = useState(String(initialData?.sellingPrice ?? ""));
  const [currentStock, setCurrentStock] = useState(String(initialData?.currentStock ?? "0"));
  const [minimumStock, setMinimumStock] = useState(String(initialData?.minimumStock ?? "5"));
  const [maximumStock, setMaximumStock] = useState(String(initialData?.maximumStock ?? "1000"));
  const [reorderLevel, setReorderLevel] = useState(String(initialData?.reorderLevel ?? "10"));
  const [unit, setUnit] = useState(initialData?.unit ?? "pcs");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!sku.trim()) e.sku = "SKU is required";
    if (!categoryId) e.categoryId = "Category is required";
    if (!supplierId) e.supplierId = "Supplier is required";
    if (!unit.trim()) e.unit = "Unit is required";
    const pp = parseFloat(purchasePrice);
    const sp = parseFloat(sellingPrice);
    if (isNaN(pp) || pp < 0) e.purchasePrice = "Must be a valid number ≥ 0";
    if (isNaN(sp) || sp < 0) e.sellingPrice = "Must be a valid number ≥ 0";
    const cs = parseInt(currentStock, 10);
    const ms = parseInt(minimumStock, 10);
    const mxs = parseInt(maximumStock, 10);
    const rl = parseInt(reorderLevel, 10);
    if (isNaN(cs) || cs < 0) e.currentStock = "Must be ≥ 0";
    if (isNaN(ms) || ms < 0) e.minimumStock = "Must be ≥ 0";
    if (isNaN(mxs) || mxs < 0) e.maximumStock = "Must be ≥ 0";
    if (isNaN(rl) || rl < 0) e.reorderLevel = "Must be ≥ 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      categoryId: typeof categoryId === "object" && categoryId !== null ? (categoryId as unknown as { id: string }).id : categoryId,
      supplierId: typeof supplierId === "object" && supplierId !== null ? (supplierId as unknown as { id: string }).id : supplierId,
      description: description.trim(),
      brand: brand.trim(),
      purchasePrice: parseFloat(purchasePrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      currentStock: parseInt(currentStock, 10) || 0,
      minimumStock: parseInt(minimumStock, 10) || 0,
      maximumStock: parseInt(maximumStock, 10) || 1000,
      reorderLevel: parseInt(reorderLevel, 10) || 10,
      unit: unit.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Product Name"
          placeholder="e.g. Wireless Mouse"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoFocus
        />
        <Input
          label="SKU"
          placeholder="e.g. WM-001"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          error={errors.sku}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={`w-full appearance-none rounded-lg border bg-white px-4 py-2.5 text-sm text-zinc-950 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-zinc-900 dark:text-zinc-50 dark:border-white/10 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20 ${
              errors.categoryId
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-zinc-200 dark:border-white/10"
            }`}
          >
            <option value="" className="bg-white text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id} className="bg-white text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Supplier <span className="text-red-500">*</span>
          </label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className={`w-full appearance-none rounded-lg border bg-white px-4 py-2.5 text-sm text-zinc-950 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-zinc-900 dark:text-zinc-50 dark:border-white/10 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20 ${
              errors.supplierId
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-zinc-200 dark:border-white/10"
            }`}
          >
            <option value="" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">Select a supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id} className="bg-white text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">{s.company || s.name}</option>
            ))}
          </select>
          {errors.supplierId && <p className="text-xs text-red-500">{errors.supplierId}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Brand"
          placeholder="Brand name"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <Input
          label="Unit"
          placeholder="e.g. pcs, kg, box"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          error={errors.unit}
        />
      </div>

      <Textarea
        label="Description"
        placeholder="Optional product description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />

      <div className="border-t border-zinc-200/80 pt-4 dark:border-white/[0.08]">
        <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Pricing & Stock</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Purchase Price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            error={errors.purchasePrice}
          />
          <Input
            label="Selling Price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            error={errors.sellingPrice}
          />
          <Input
            label="Current Stock"
            type="number"
            min="0"
            placeholder="0"
            value={currentStock}
            onChange={(e) => setCurrentStock(e.target.value)}
            error={errors.currentStock}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Minimum Stock"
            type="number"
            min="0"
            placeholder="5"
            value={minimumStock}
            onChange={(e) => setMinimumStock(e.target.value)}
            error={errors.minimumStock}
          />
          <Input
            label="Maximum Stock"
            type="number"
            min="0"
            placeholder="1000"
            value={maximumStock}
            onChange={(e) => setMaximumStock(e.target.value)}
            error={errors.maximumStock}
          />
          <Input
            label="Reorder Level"
            type="number"
            min="0"
            placeholder="10"
            value={reorderLevel}
            onChange={(e) => setReorderLevel(e.target.value)}
            error={errors.reorderLevel}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-zinc-200/80 pt-4 dark:border-white/[0.08]">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
