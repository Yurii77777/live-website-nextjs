export const API_ENDPOINTS = {
  PUCK: {
    PAGES: "/api/puck/pages",
    PAGE: (slug: string) => `/api/puck/${slug}`,
  },
  AUTH: {
    BASE: "/api/auth",
    SIGN_IN: "/api/auth/sign-in/email",
    SIGN_UP: "/api/auth/sign-up/email",
    SIGN_UP_WITH_ROLE: "/api/auth/signup-with-role",
    SIGN_OUT: "/api/auth/sign-out",
    SESSION: "/api/auth/get-session",
    HAS_USERS: "/api/auth/has-users",
    PASSKEY: {
      REGISTER: "/api/auth/passkey/register",
      SIGN_IN: "/api/auth/passkey/sign-in",
      LIST: "/api/auth/passkey/list-passkeys",
      DELETE: (passkeyId: string) => `/api/auth/passkey/delete/${passkeyId}`,
    },
  },
} as const;
