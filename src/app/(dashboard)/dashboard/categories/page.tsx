"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Tag } from "lucide-react";
import Button from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import CategoryTable from "@/components/categories/category-table";
import CategoryModal from "@/components/categories/category-modal";
import { useCategories } from "@/hooks/use-categories";
import type { Category } from "@/types/category";

export default function CategoriesPage() {
  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>(undefined);
  const [deleting, setDeleting] = useState<Category | undefined>(undefined);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (cat: Category) => {
    setEditing(cat);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditing(undefined);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await deleteCategory(deleting._id);
      setDeleting(undefined);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Categories"
        subtitle="Organize your inventory into groups"
        icon={Tag}
        action={
          <Button variant="primary" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        }
      />

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
        />
      </div>

      <CategoryTable
        categories={filtered}
        loading={loading}
        onEdit={handleEdit}
        onDelete={setDeleting}
        onEmptyCtaClick={handleCreate}
      />

      <CategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(undefined);
        }}
        initialData={editing}
        onSubmit={editing ? (d) => updateCategory(editing._id, d) : createCategory}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  );
}
