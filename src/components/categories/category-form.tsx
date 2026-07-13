"use client";

import { useState } from "react";
import type { Category, CategoryFormData } from "@/types/category";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [color, setColor] = useState(initialData?.color ?? "#10b981");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (name.trim().length > 100) e.name = "Name must be 100 characters or fewer";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      color,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category Name"
        placeholder="e.g. Electronics, Groceries"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoFocus
      />
      <Textarea
        label="Description"
        placeholder="Optional description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-lg border border-zinc-300 dark:border-zinc-600"
          />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {color}
          </span>
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t border-zinc-200/80 pt-4 dark:border-white/[0.08]">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
