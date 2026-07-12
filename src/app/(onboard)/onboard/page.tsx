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

export default function OnboardPage() {
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

        if (!user) {
          router.replace("/");
          return;
        }

        if (user.shopId) {
          router.replace("/dashboard");
          return;
        }

        setAuthorized(true);
      } catch {
        if (!cancelled) router.replace("/");
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    check();
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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="w-full max-w-lg">
      <OnboardingForm onSkip={handleSkip} />
    </div>
  );
}
