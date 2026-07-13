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
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      console.log("AUTH_STATE_DEBUG: [DashboardGuard] checkSession() called, loading:", loading, "session:", session);

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`AUTH_STATE_DEBUG: [DashboardGuard] attempt ${attempt + 1}/${MAX_RETRIES + 1}, calling authClient.getSession()…`);
          console.log("AUTH_STATE_DEBUG: [DashboardGuard] authClient.baseURL:", authClient.baseURL);
          const { data } = await authClient.getSession();
          if (cancelled) return;

          const user = data?.user as SessionUser | undefined;
          console.log("AUTH_STATE_DEBUG: [DashboardGuard] getSession resolved → user:", user ? { id: user.id, email: user.email, shopId: user.shopId } : null);

          if (!user) {
            if (attempt < MAX_RETRIES) {
              console.log(`AUTH_STATE_DEBUG: [DashboardGuard] no user, retrying in ${RETRY_DELAY_MS}ms…`);
              await delay(RETRY_DELAY_MS);
              continue;
            }
            console.log("AUTH_STATE_DEBUG: [DashboardGuard] no user after all retries, will redirect.");
            return;
          }

          setSession(user);
          console.log("AUTH_STATE_DEBUG: [DashboardGuard] session set, user:", user.email);
          return;
        } catch (err) {
          console.error("AUTH_STATE_DEBUG: [DashboardGuard] getSession threw:", err);
          if (attempt < MAX_RETRIES) {
            await delay(RETRY_DELAY_MS);
          }
        }
      }
    }

    checkSession().finally(() => {
      if (!cancelled) {
        console.log("AUTH_STATE_DEBUG: [DashboardGuard] checkSession done → setLoading(false)");
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    console.log("AUTH_STATE_DEBUG: [DashboardGuard] redirect-effect → loading:", loading, "session:", session ? session.email : null);
    if (loading) return;

    if (!session) {
      console.log("AUTH_STATE_DEBUG: [DashboardGuard] session is null → redirecting to /");
      router.replace("/");
      return;
    }

    const skipped =
      typeof window !== "undefined" &&
      localStorage.getItem(SKIP_KEY) === "true";

    if (!session.shopId && !skipped) {
      console.log("AUTH_STATE_DEBUG: [DashboardGuard] no shopId, not skipped → redirecting to /onboard");
      router.replace("/onboard");
    }
  }, [loading, session, router]);

  if (loading) {
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

  if (!session) return null;

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
