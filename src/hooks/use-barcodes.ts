"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

export function useBarcodes() {
  const [generating, setGenerating] = useState(false);
  const [printing, setPrinting] = useState(false);

  const generateBarcode = useCallback(async (productId: string) => {
    setGenerating(true);
    try {
      const { data: res } = await api.post(`/barcodes/generate/${productId}`);
      toast.success("Barcode generated");
      return res?.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate barcode";
      toast.error(msg);
      throw err;
    } finally {
      setGenerating(false);
    }
  }, []);

  const printBarcodeSheet = useCallback(async (productIds: string[]) => {
    setPrinting(true);
    try {
      const res = await api.post("/barcodes/sheet", { productIds }, { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "barcode-sheet.pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Barcode sheet downloaded");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate barcode sheet";
      toast.error(msg);
      throw err;
    } finally {
      setPrinting(false);
    }
  }, []);

  const printQrSheet = useCallback(async (productIds: string[]) => {
    setPrinting(true);
    try {
      const res = await api.post("/barcodes/qr-sheet", { productIds }, { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qr-sheet.pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("QR sheet downloaded");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate QR sheet";
      toast.error(msg);
      throw err;
    } finally {
      setPrinting(false);
    }
  }, []);

  return { generateBarcode, printBarcodeSheet, printQrSheet, generating, printing };
}
