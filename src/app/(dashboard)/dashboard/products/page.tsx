"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Package } from "lucide-react";
import Button from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import ProductTable from "@/components/products/product-table";
import ProductModal from "@/components/products/product-modal";
import StockAdjustModal from "@/components/products/stock-adjust-modal";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useSuppliers } from "@/hooks/use-suppliers";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
  } = useProducts();
  const { categories } = useCategories();
  const { suppliers } = useSuppliers();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>(undefined);
  const [deleting, setDeleting] = useState<Product | undefined>(undefined);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q))
    );
  });

  const handleEdit = (p: Product) => {
    setEditing(p);
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
      await deleteProduct(deleting._id);
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
          title="Products"
          subtitle="Manage your product inventory"
          icon={Package}
          action={
            <Button variant="primary" onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          }
        />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, SKU, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
          />
        </div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <ProductTable
          products={filtered}
          categories={categories}
          loading={loading}
          onEdit={handleEdit}
          onDelete={setDeleting}
          onAdjustStock={setStockProduct}
          onEmptyCtaClick={handleCreate}
        />
      </motion.div>

      <ProductModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(undefined); }}
        initialData={editing}
        categories={categories}
        suppliers={suppliers}
        onSubmit={editing ? (d) => updateProduct(editing._id, d) : createProduct}
      />

      <StockAdjustModal
        open={!!stockProduct}
        onClose={() => setStockProduct(null)}
        product={stockProduct}
        onAdjust={adjustStock}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </motion.div>
  );
}
