import { Data } from "@measured/puck";
import { Locale } from "@/i18n/routing";

/**
 * Localized Puck content structure
 * Each locale has its own Puck Data
 */
export type LocalizedPuckContent = {
  [K in Locale]: Data;
};

/**
 * Get content for specific locale with fallback to uk
 */
export function getLocalizedContent(
  content: LocalizedPuckContent,
  locale: Locale
): Data {
  return content[locale] || content.uk || { content: [], root: {} };
}

/**
 * Create empty localized content structure
 */
export function createEmptyLocalizedContent(): LocalizedPuckContent {
  return {
    uk: { content: [], root: {} },
    en: { content: [], root: {} },
  };
}
