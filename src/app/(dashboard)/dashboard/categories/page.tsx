"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Tag } from "lucide-react";
import Button from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import CategoryTable from "@/components/categories/category-table";
import CategoryModal from "@/components/categories/category-modal";
import { useCategories } from "@/hooks/use-categories";
import { staggerContainer, fadeInUp } from "@/lib/animations";
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
    <motion.div
      className="space-y-6 p-4 sm:p-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp}>
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
      </motion.div>

      <motion.div variants={fadeInUp}>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
          />
        </div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <CategoryTable
          categories={filtered}
          loading={loading}
          onEdit={handleEdit}
          onDelete={setDeleting}
          onEmptyCtaClick={handleCreate}
        />
      </motion.div>

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
    </motion.div>
  );
}
