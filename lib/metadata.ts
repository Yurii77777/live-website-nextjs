import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "./prisma";

/**
 * Generate metadata for a page by slug
 * @param locale - The locale string (e.g., 'en', 'uk')
 * @param slug - The page slug
 * @returns Metadata object for the page
 */
export async function generatePageMetadata(
  locale: string,
  slug: string
): Promise<Metadata> {
  const t = await getTranslations({ locale });

  const page = await prisma.page.findUnique({
    where: { slug },
    select: { title: true },
  });

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
