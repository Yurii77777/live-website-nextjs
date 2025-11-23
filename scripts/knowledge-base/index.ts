import type { KnowledgeBaseItem } from "./types";
import { companyInfoContent } from "./company-info";
import { servicesContent } from "./services";
import { businessDomainsContent } from "./business-domains";
import { uiComponentsContent } from "./ui-components";
import { processContent } from "./process";

export type { KnowledgeBaseItem };

// Export all category content
export const categories = {
  companyInfo: companyInfoContent,
  services: servicesContent,
  businessDomains: businessDomainsContent,
  uiComponents: uiComponentsContent,
  process: processContent,
} as const;

export type CategoryKey = keyof typeof categories;

/**
 * Get all knowledge base items from enabled categories
 * @param enabledCategories - Object with category flags
 * @returns Array of all enabled knowledge base items
 */
export function getEnabledContent(
  enabledCategories: Record<CategoryKey, boolean>
): KnowledgeBaseItem[] {
  const allContent: KnowledgeBaseItem[] = [];

  for (const [key, items] of Object.entries(categories)) {
    if (enabledCategories[key as CategoryKey]) {
      allContent.push(...items);
    }
  }

  return allContent;
}

/**
 * Get knowledge base items for specific categories
 * @param categoryKeys - Array of category keys to include
 * @returns Array of knowledge base items from specified categories
 */
export function getCategoriesContent(
  categoryKeys: CategoryKey[]
): KnowledgeBaseItem[] {
  const content: KnowledgeBaseItem[] = [];

  for (const key of categoryKeys) {
    if (categories[key]) {
      content.push(...categories[key]);
    }
  }

  return content;
}

/**
 * Get all knowledge base items (all categories enabled)
 */
export function getAllContent(): KnowledgeBaseItem[] {
  return Object.values(categories).flat();
}
