"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

function LoadingSpinner() {
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

export default function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { data, isPending } = useSession();

  const user = data?.user;

  useEffect(() => {
    if (isPending) return;

    if (requireAuth && !user) {
      router.replace(redirectTo);
      return;
    }

    if (!requireAuth && user) {
      router.replace(redirectTo);
    }
  }, [isPending, user, requireAuth, redirectTo, router]);

  if (isPending) return <LoadingSpinner />;

  if (requireAuth && !user) return null;
  if (!requireAuth && user) return null;

  return <>{children}</>;
}
