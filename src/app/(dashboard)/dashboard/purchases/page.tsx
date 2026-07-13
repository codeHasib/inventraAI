"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus } from "lucide-react";
import Button from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import PurchaseTable from "@/components/purchases/purchase-table";
import { PurchaseModal } from "@/components/purchases/purchase-form";
import { usePurchasesAll } from "@/hooks/use-purchases-all";
import { useProductsAll } from "@/hooks/use-products-all";
import { useSuppliers } from "@/hooks/use-suppliers";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import type { Purchase } from "@/types/purchase";

export default function PurchasesPage() {
  const { purchases, loading, deletePurchase, createPurchase } = usePurchasesAll();
  const { products } = useProductsAll();
  const { suppliers } = useSuppliers();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Purchase | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = (p: Purchase) => { setTarget(p); setConfirmOpen(true); };
  const confirmDelete = async () => { if (target) { await deletePurchase(target._id); setTarget(null); setConfirmOpen(false); } };

  return (
    <motion.div
      className="space-y-6 p-4 sm:p-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp}>
        <PageHeader
          title="Purchases"
          subtitle="Record and manage supplier purchases."
          icon={ShoppingCart}
          action={<Button variant="primary" onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Record Purchase</Button>}
        />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <PurchaseTable purchases={purchases} suppliers={suppliers} loading={loading} onDelete={handleDelete} onEmptyCtaClick={() => setOpen(true)} />
      </motion.div>
      <PurchaseModal key="purchase-create" open={open} onClose={() => setOpen(false)} products={products} suppliers={suppliers} onSubmit={createPurchase} />
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete}
        title="Delete Purchase" message={`Permanently delete invoice ${target?.invoiceNumber ?? ""}? This cannot be undone.`} />
    </motion.div>
  );
}
