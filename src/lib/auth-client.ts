import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

console.log("AUTH_STATE_DEBUG: [auth-client] created authClient with baseURL:", process.env.NEXT_PUBLIC_BACKEND_URL);
console.log("AUTH_STATE_DEBUG: [auth-client] authClient.baseURL:", authClient.baseURL);

export const { useSession } = authClient;
