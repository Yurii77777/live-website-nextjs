import { Data } from "@measured/puck";
import { Locale } from "@/i18n/routing";
import type { LocalizedPuckContent } from "@/types/localized-content";

export function getLocalizedContent(
  content: LocalizedPuckContent,
  locale: Locale
): Data {
  return content[locale] || content.uk || { content: [], root: {} };
}

export function createEmptyLocalizedContent(): LocalizedPuckContent {
  return {
    uk: { content: [], root: {} },
    en: { content: [], root: {} },
  };
}

export function createLocalizedContent(
  data: LocalizedPuckContent
): LocalizedPuckContent {
  return data;
}
