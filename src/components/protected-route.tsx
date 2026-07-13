"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role?: string;
  shopId?: string | null;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 600;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const { data } = await authClient.getSession();
          if (cancelled) return;

          const user = data?.user as SessionUser | undefined;

          if (requireAuth && !user) {
            if (attempt < MAX_RETRIES) {
              await delay(RETRY_DELAY_MS);
              continue;
            }
            return;
          }

          if (!requireAuth && user) {
            return;
          }

          setSession(user ?? null);
          return;
        } catch {
          if (attempt < MAX_RETRIES) {
            await delay(RETRY_DELAY_MS);
          }
        }
      }
    }

    checkSession().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [requireAuth]);

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !session) {
      router.replace(redirectTo);
      return;
    }

    if (!requireAuth && session) {
      router.replace(redirectTo);
    }
  }, [loading, session, requireAuth, redirectTo, router]);

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

  return <>{children}</>;
}
