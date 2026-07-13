import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://inventra-backend-mu.vercel.app",
});

export const { useSession } = authClient;
