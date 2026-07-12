"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import type { Settings } from "@/types/settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const { data: res } = await api.get("/settings/profile");
      const raw = res?.data?.data ?? res?.data;
      if (raw && typeof raw === "object") {
        setSettings(raw as Settings);
      }
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(
    async (payload: Partial<Settings>) => {
      try {
        setSaving(true);
        const { data: res } = await api.patch("/settings/profile", payload);
        const raw = res?.data?.data ?? res?.data;
        if (raw && typeof raw === "object") {
          setSettings(raw as Settings);
        }
        toast.success(res?.message ?? "Settings updated successfully");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to update settings";
        toast.error(msg);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    saving,
    fetchSettings,
    updateSettings,
  };
}
