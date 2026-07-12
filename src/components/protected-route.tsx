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

export default function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const { data: session } = await authClient.getSession();
        if (cancelled) return;

        const user = session?.user as SessionUser | undefined;

        if (requireAuth && !user) {
          router.replace(redirectTo);
          return;
        }

        if (!requireAuth && user) {
          router.replace(redirectTo);
          return;
        }

        setAuthorized(true);
      } catch {
        if (!cancelled) {
          if (requireAuth) {
            router.replace(redirectTo);
          } else {
            setAuthorized(true);
          }
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [router, requireAuth, redirectTo]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
