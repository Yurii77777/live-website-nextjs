import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageService } from "@/services/db/page.service";

export async function generatePageMetadata(
  locale: string,
  slug: string
): Promise<Metadata> {
  const t = await getTranslations({ locale });

  const page = await pageService.findBySlug(slug);

  if (!page) {
    return {
      title: t("common.pageNotFound"),
    };
  }

  return {
    title: page.title,
    description: `${page.title} - ${t("common.title")}`,
  };
}

/**
 * Generate default metadata for a locale
 * @param locale - The locale string (e.g., 'en', 'uk')
 * @returns Metadata object with default title and description
 */
export async function generateDefaultMetadata(
  locale: string
): Promise<Metadata> {
  const t = await getTranslations({ locale });

  return {
    title: t("common.title"),
    description: t("common.description"),
  };
}
