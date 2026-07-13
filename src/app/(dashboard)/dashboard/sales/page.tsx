"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Plus } from "lucide-react";
import Button from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import SaleTable from "@/components/sales/sale-table";
import { SaleModal } from "@/components/sales/sale-form";
import { useSalesAll } from "@/hooks/use-sales-all";
import { useProductsAll } from "@/hooks/use-products-all";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import type { Sale } from "@/types/sale";

export default function SalesPage() {
  const { sales, loading, deleteSale, createSale } = useSalesAll();
  const { products } = useProductsAll();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Sale | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = (s: Sale) => { setTarget(s); setConfirmOpen(true); };
  const confirmDelete = async () => { if (target) { await deleteSale(target._id); setTarget(null); setConfirmOpen(false); } };

  return (
    <motion.div
      className="space-y-6 p-4 sm:p-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp}>
        <PageHeader
          title="Sales"
          subtitle="Record and manage sales transactions."
          icon={TrendingUp}
          action={<Button variant="primary" onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Record Sale</Button>}
        />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <SaleTable sales={sales} loading={loading} onDelete={handleDelete} onEmptyCtaClick={() => setOpen(true)} />
      </motion.div>
      <SaleModal key="sale-create" open={open} onClose={() => setOpen(false)} products={products} onSubmit={createSale} />
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete}
        title="Delete Sale" message={`Permanently delete invoice ${target?.invoiceNumber ?? ""}? This cannot be undone.`} />
    </motion.div>
  );
}
