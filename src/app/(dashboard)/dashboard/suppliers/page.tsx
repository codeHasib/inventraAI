"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Truck } from "lucide-react";
import Button from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import SupplierTable from "@/components/suppliers/supplier-table";
import SupplierModal from "@/components/suppliers/supplier-modal";
import { useSuppliers } from "@/hooks/use-suppliers";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import type { Supplier } from "@/types/supplier";

export default function SuppliersPage() {
  const {
    suppliers,
    loading,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  } = useSuppliers();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | undefined>(undefined);
  const [deleting, setDeleting] = useState<Supplier | undefined>(undefined);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filtered = suppliers.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.company && s.company.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      s.phone.includes(q)
    );
  });

  const handleEdit = (s: Supplier) => {
    setEditing(s);
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
      await deleteSupplier(deleting._id);
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
          title="Suppliers"
          subtitle="Manage your vendor and supplier contacts"
          icon={Truck}
          action={
            <Button variant="primary" onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          }
        />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
          />
        </div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <SupplierTable
          suppliers={filtered}
          loading={loading}
          onEdit={handleEdit}
          onDelete={setDeleting}
          onEmptyCtaClick={handleCreate}
        />
      </motion.div>

      <SupplierModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(undefined);
        }}
        initialData={editing}
        onSubmit={
          editing ? (d) => updateSupplier(editing._id, d) : createSupplier
        }
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        onConfirm={handleDelete}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </motion.div>
  );
}
