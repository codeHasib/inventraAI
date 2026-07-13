"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";
import MobileSidebar from "@/components/dashboard/mobile-sidebar";

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-emerald-500 dark:border-white/10 dark:border-t-emerald-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading&hellip;
        </p>
      </div>
    </div>
  );
}

export default function DashboardGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = data?.user as
    | { id: string; email: string; name: string; shopId?: string | null }
    | undefined;

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/");
      return;
    }

    if (!user.shopId) {
      router.replace("/onboard");
    }
  }, [isPending, user, router]);

  if (isPending) return <LoadingSpinner />;

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 transition-all duration-300 ease-in-out dark:bg-slate-950">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          mobileOpen={mobileOpen}
          onToggleMobile={() => setMobileOpen((o) => !o)}
        />

        <main className="w-full max-w-[1600px] mx-auto flex-1 overflow-y-auto overflow-x-hidden p-4 pt-4 sm:p-6 md:pt-8 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
