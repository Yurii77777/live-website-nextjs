import { notFound } from "next/navigation";
import { pageService } from "@/services/db/page.service";
import { PuckRenderer } from "@/components/puck-renderer";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  return generatePageMetadata(locale, slug);
}

export async function generateStaticParams() {
  const publishedPages = await db
    .select({ slug: pages.slug })
    .from(pages)
    .where(eq(pages.published, true));

  return publishedPages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;

  const page = await pageService.findBySlug(slug);

  // If page doesn't exist or is not published, show 404
  if (!page || !page.published) {
    notFound();
  }

  return (
    <div className="w-full">
      <PuckRenderer data={page.content as any} />
    </div>
  );
}

// Enable ISR (Incremental Static Regeneration) - revalidate every 60 seconds
export const revalidate = 60;
