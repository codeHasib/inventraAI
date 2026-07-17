"use client";

import { createAuthClient } from "better-auth/react";
import { useEffect, useRef, useState } from "react";

const SESSION_TIMEOUT_MS = 8000;

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
});

export function useSession() {
  const session = authClient.useSession();
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (session.isPending) {
      timerRef.current = setTimeout(
        () => setHasTimedOut(true),
        SESSION_TIMEOUT_MS,
      );
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [session.isPending]);

  if (hasTimedOut && session.isPending) {
    return { data: null, isPending: false, error: null };
  }

  return session;
}
