export const API_ENDPOINTS = {
  PUCK: {
    PAGES: "/api/puck/pages",
    PAGE: (slug: string) => `/api/puck/${slug}`,
  },
} as const;
