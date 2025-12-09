export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  ADMIN: {
    DASHBOARD: "/admin",
    CREATE_PAGE: "/admin/create-page",
    EDITOR: (slug: string) => `/admin/editor/${slug}`,
    DELETE_PAGE: (slug: string) => `/admin/delete-page/${slug}`,
    SECURITY: "/admin/security",
  },
  PAGE: (slug: string) => `/p/${slug}`,
} as const;
