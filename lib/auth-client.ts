import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";

const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

if (!baseURL) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_BETTER_AUTH_URL"
  );
}

export const authClient = createAuthClient({
  baseURL,
  plugins: [passkeyClient()],
});

export const { signIn, signUp, signOut, useSession, passkey } = authClient;
