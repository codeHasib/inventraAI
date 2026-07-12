"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";
import MobileSidebar from "@/components/dashboard/mobile-sidebar";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role?: string;
  shopId?: string | null;
};

const SKIP_KEY = "inventraai_skip_onboarding";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 600;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function DashboardGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      let lastError: unknown = null;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const { data: session } = await authClient.getSession();
          if (cancelled) return;

          const user = session?.user as SessionUser | undefined;

          if (!user) {
            if (attempt < MAX_RETRIES) {
              await delay(RETRY_DELAY_MS);
              continue;
            }
            router.replace("/");
            return;
          }

          const skipped =
            typeof window !== "undefined" &&
            localStorage.getItem(SKIP_KEY) === "true";

          if (!user.shopId && !skipped) {
            router.replace("/onboard");
            return;
          }

          setAuthorized(true);
          return;
        } catch (err) {
          lastError = err;
          if (attempt < MAX_RETRIES) {
            await delay(RETRY_DELAY_MS);
          }
        }
      }

      if (!cancelled) {
        if (lastError) {
          router.replace("/");
        }
      }
    }

    check().finally(() => {
      if (!cancelled) setChecking(false);
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-500" />
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Loading&hellip;
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
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

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
