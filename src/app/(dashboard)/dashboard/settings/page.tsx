"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/hooks/use-settings";
import ProfileForm from "@/components/settings/profile-form";
import Skeleton from "@/components/ui/skeleton";
import Card from "@/components/ui/card";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export default function SettingsPage() {
  const { settings, loading, saving, updateSettings } = useSettings();

  return (
    <motion.div
      className="space-y-6 p-4 sm:p-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="space-y-1" variants={fadeInUp}>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
          Settings
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage your business profile and preferences.
        </p>
      </motion.div>

      {loading ? (
        <motion.div variants={fadeInUp}>
          <Card className="space-y-4 p-6">
            <Skeleton className="h-5 w-48" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-32 self-end" />
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={fadeInUp}>
          <ProfileForm
            settings={settings}
            saving={saving}
            onSubmit={updateSettings}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
