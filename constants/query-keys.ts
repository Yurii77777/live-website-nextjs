export const QUERY_KEYS = {
  PAGES: ["pages"] as const,
  PAGE: (slug: string) => ["page", slug] as const,
  SITE_MENU: ["site-menu"] as const,
} as const;
