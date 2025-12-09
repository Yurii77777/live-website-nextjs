import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkey } from "@better-auth/passkey";
import { db } from "./db";
import * as schema from "./db/schema";
import {
  SESSION_CONFIG,
  PASSKEY_CONFIG,
  TRUSTED_ORIGINS,
} from "@/constants/auth";

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const BETTER_AUTH_RP_ID = process.env.BETTER_AUTH_RP_ID;

if (!BETTER_AUTH_URL) {
  throw new Error("Missing required environment variable: BETTER_AUTH_URL");
}

if (!BETTER_AUTH_SECRET) {
  throw new Error("Missing required environment variable: BETTER_AUTH_SECRET");
}

if (!BETTER_AUTH_RP_ID) {
  throw new Error("Missing required environment variable: BETTER_AUTH_RP_ID");
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      passkey: schema.passkey,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: SESSION_CONFIG.EXPIRES_IN,
    updateAge: SESSION_CONFIG.UPDATE_AGE,
    cookieCache: {
      enabled: true,
      maxAge: SESSION_CONFIG.COOKIE_CACHE_MAX_AGE,
    },
  },
  plugins: [
    passkey({
      rpName: PASSKEY_CONFIG.RP_NAME,
      rpID: BETTER_AUTH_RP_ID,
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.BETTER_AUTH_URL
          : TRUSTED_ORIGINS.LOCALHOST,
      authenticatorSelection: {
        authenticatorAttachment: PASSKEY_CONFIG.AUTHENTICATOR_ATTACHMENT,
        residentKey: PASSKEY_CONFIG.RESIDENT_KEY,
        userVerification: PASSKEY_CONFIG.USER_VERIFICATION,
      },
    }),
  ],
  trustedOrigins: [TRUSTED_ORIGINS.LOCALHOST],
  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_URL,
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
