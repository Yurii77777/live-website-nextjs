export const seedConfig = {
  // Knowledge base categories to seed
  knowledgeBase: {
    enabled: {
      companyInfo: true,
      services: true,
      businessDomains: true,
      uiComponents: false,
      process: true,
    },
    // Clear existing data before seeding
    clearBefore: true,
  },

  // Pages to seed
  pages: {
    uiKit: true,      // Seed UI Kit page
    home: true,       // Seed home page
    // Only seed if page doesn't exist (recommended for pages)
    seedIfMissing: true,
  },

  // Supported languages
  languages: ["uk"], // Can add 'en' later

  // Vector search settings
  vectorSearch: {
    // Embedding dimensions (text-embedding-3-small)
    dimensions: 1536,
  },
} as const;

// Legacy export for backwards compatibility
export const knowledgeBaseConfig = {
  enabled: seedConfig.knowledgeBase.enabled,
  languages: seedConfig.languages,
  vectorSearch: {
    dimensions: seedConfig.vectorSearch.dimensions,
    clearBefore: seedConfig.knowledgeBase.clearBefore,
  },
} as const;

export type SeedConfig = typeof seedConfig;
export type KnowledgeBaseConfig = typeof knowledgeBaseConfig;
export type CategoryName = keyof typeof seedConfig.knowledgeBase.enabled;
