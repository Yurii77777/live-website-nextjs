/**
 * System page slugs
 * These are the slugs for system-critical pages
 */
export const PAGE_SLUGS = {
  UI_KIT: "ui-kit",
  HOME: "home",
  SITE_MENU: "site-menu",
} as const;

/**
 * List of protected pages that cannot be deleted
 * These are system pages critical for the application
 */
export const PROTECTED_PAGES = [
  PAGE_SLUGS.UI_KIT,
  PAGE_SLUGS.HOME,
  PAGE_SLUGS.SITE_MENU,
] as const;

/**
 * Type for protected page slugs
 */
export type ProtectedPageSlug = (typeof PROTECTED_PAGES)[number];

export const PAGE_VALIDATION = {
  MIN_LENGTH: 1,
} as const;
