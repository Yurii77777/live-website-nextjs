import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { isProtectedRoute, isPublicRoute } from "./constants/protected-routes";
import { AUTH_CONFIG } from "./constants/auth";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes should bypass i18n middleware entirely
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Extract locale from pathname
  const localeMatch = pathname.match(/^\/(uk|en)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Check if visiting login page
  const isLoginPage = pathname === `/${locale}/login` || pathname === "/login";

  if (isLoginPage) {
    // Check if any users exist in the system
    try {
      const hasUsersUrl = new URL("/api/auth/has-users", request.url);
      const hasUsersResponse = await fetch(hasUsersUrl.toString());

      if (hasUsersResponse.ok) {
        const { hasUsers } = await hasUsersResponse.json();

        // If no users exist, redirect to signup
        if (!hasUsers) {
          const url = request.nextUrl.clone();
          url.pathname = `/${locale}/signup`;
          return NextResponse.redirect(url);
        }
      }
    } catch (error) {
      console.error("Failed to check users in middleware:", error);
      // On error, allow access to login page
    }
  }

  // Skip auth check for public routes
  if (isPublicRoute(pathname)) {
    return intlMiddleware(request);
  }

  // Check if route requires authentication
  if (isProtectedRoute(pathname)) {
    // Check for better-auth session cookie
    const sessionToken = request.cookies.get(AUTH_CONFIG.SESSION_COOKIE_NAME);

    // If no session token, redirect to login
    if (!sessionToken) {
      const url = request.nextUrl.clone();

      // Remove locale from pathname for cleaner callback URL
      const pathWithoutLocale = pathname.replace(/^\/(uk|en)/, '') || '/';

      url.pathname = `/${locale}/login`;
      url.searchParams.set("return", pathWithoutLocale);

      return NextResponse.redirect(url);
    }
  }

  // Continue with i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
