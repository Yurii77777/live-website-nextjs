/**
 * List of protected pages that cannot be deleted
 * These are system pages critical for the application
 */
export const PROTECTED_PAGES = ["ui-kit", "home"] as const;

/**
 * Type for protected page slugs
 */
export type ProtectedPageSlug = (typeof PROTECTED_PAGES)[number];

export const PAGE_VALIDATION = {
  MIN_LENGTH: 1,
} as const;
