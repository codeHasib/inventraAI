"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import OnboardingForm from "@/components/onboarding-form";

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 transition-colors duration-300 dark:bg-[#050510]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-500 dark:border-white/10 dark:border-t-indigo-500" />
        <p className="text-sm text-gray-500 dark:text-white/40">
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
    <div className="relative w-full min-h-screen overflow-x-hidden flex flex-col bg-gray-50 transition-colors duration-300 dark:bg-[#050510]">
      {/* Background gradient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[20%] top-[10%] h-[600px] w-[600px] rounded-full bg-indigo-300/30 blur-[120px] dark:bg-indigo-600/20" />
        <div className="absolute right-[10%] top-[30%] h-[500px] w-[500px] rounded-full bg-purple-300/20 blur-[120px] dark:bg-purple-600/15" />
        <div className="absolute bottom-[10%] left-[30%] h-[400px] w-[400px] rounded-full bg-blue-300/15 blur-[120px] dark:bg-blue-600/10" />
      </div>

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <OnboardingForm onSkip={handleSkip} />
      </div>
    </div>
  );
}
