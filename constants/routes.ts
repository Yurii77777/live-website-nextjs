export const ROUTES = {
  HOME: "/",
  ADMIN: {
    DASHBOARD: "/admin",
    CREATE_PAGE: "/admin/create-page",
    EDITOR: (slug: string) => `/admin/editor/${slug}`,
  },
  PAGE: (slug: string) => `/p/${slug}`,
} as const;
