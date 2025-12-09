/**
 * Routes that require authentication
 */
export const PROTECTED_ROUTES = {
  PREFIXES: ["/admin"] as const,
} as const;

/**
 * Routes that are public (no authentication required)
 */
export const PUBLIC_ROUTES = {
  LOGIN: "/login",
  HOME: "/",
  API_AUTH: "/api/auth",
} as const;

/**
 * Check if a pathname requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  // Remove locale prefix if present (e.g., /uk/admin -> /admin)
  const pathWithoutLocale = pathname.replace(/^\/(uk|en)/, "");

  return PROTECTED_ROUTES.PREFIXES.some((prefix) =>
    pathWithoutLocale.startsWith(prefix)
  );
}

/**
 * Check if a pathname is a public route
 */
export function isPublicRoute(pathname: string): boolean {
  // Remove locale prefix if present
  const pathWithoutLocale = pathname.replace(/^\/(uk|en)/, "");

  return (
    pathWithoutLocale === PUBLIC_ROUTES.HOME ||
    pathWithoutLocale === PUBLIC_ROUTES.LOGIN ||
    pathWithoutLocale.startsWith(PUBLIC_ROUTES.API_AUTH)
  );
}
