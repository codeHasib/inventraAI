"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import OnboardingForm from "@/components/onboarding-form";

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

export default function OnboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      let lastError: unknown = null;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`AUTH_STATE_DEBUG: [OnboardPage] attempt ${attempt + 1}/${MAX_RETRIES + 1}, calling authClient.getSession()…`);
          console.log("AUTH_STATE_DEBUG: [OnboardPage] NEXT_PUBLIC_BACKEND_URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
          const { data: session } = await authClient.getSession();
          if (cancelled) return;

          const user = session?.user as SessionUser | undefined;
          console.log("AUTH_STATE_DEBUG: [OnboardPage] user:", user ? { id: user.id, email: user.email, shopId: user.shopId } : null);

          if (!user) {
            if (attempt < MAX_RETRIES) {
              await delay(RETRY_DELAY_MS);
              continue;
            }
            console.log("AUTH_STATE_DEBUG: [OnboardPage] no user after all retries → redirecting to /");
            router.replace("/");
            return;
          }

          if (user.shopId) {
            console.log("AUTH_STATE_DEBUG: [OnboardPage] user has shopId → redirecting to /dashboard");
            router.replace("/dashboard");
            return;
          }

          setAuthorized(true);
          console.log("AUTH_STATE_DEBUG: [OnboardPage] authorized set to true");
          return;
        } catch (err) {
          lastError = err;
          console.error("AUTH_STATE_DEBUG: [OnboardPage] getSession threw:", err);
          if (attempt < MAX_RETRIES) {
            await delay(RETRY_DELAY_MS);
          }
        }
      }

      if (!cancelled && lastError) {
        console.log("AUTH_STATE_DEBUG: [OnboardPage] lastError, redirecting to /");
        router.replace("/");
      }
    }

    check().finally(() => {
      if (!cancelled) setChecking(false);
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleSkip = () => {
    localStorage.setItem(SKIP_KEY, "true");
    router.push("/dashboard");
  };

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
    <div className="w-full max-w-lg mx-auto mt-20">
      <OnboardingForm onSkip={handleSkip} />
    </div>
  );
}
