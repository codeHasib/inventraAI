"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import OnboardingForm from "@/components/onboarding-form";

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

const SKIP_KEY = "inventraai_skip_onboarding";

export default function OnboardPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const user = data?.user as
    | { id: string; email: string; name: string; shopId?: string | null }
    | undefined;

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/");
      return;
    }

    if (user.shopId) {
      router.replace("/dashboard");
    }
  }, [isPending, user, router]);

  const handleSkip = () => {
    localStorage.setItem(SKIP_KEY, "true");
    router.push("/dashboard");
  };

  if (isPending) return <LoadingSpinner />;

  if (!user || user.shopId) return null;

  return (
    <div className="w-full max-w-lg mx-auto mt-20">
      <OnboardingForm onSkip={handleSkip} />
    </div>
  );
}
