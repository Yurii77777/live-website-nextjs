export const QUERY_KEYS = {
  PAGES: ["pages"] as const,
  PAGE: (slug: string) => ["page", slug] as const,
  SITE_MENU: ["site-menu"] as const,
  AUTH: {
    SESSION: ["auth", "session"] as const,
    PASSKEYS: ["auth", "passkeys"] as const,
    HAS_USERS: ["auth", "has-users"] as const,
  },
} as const;
