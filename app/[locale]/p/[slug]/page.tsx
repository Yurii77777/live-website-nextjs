import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PuckRenderer } from "@/components/puck-renderer";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  return generatePageMetadata(locale, slug);
}

// Generate static params for published pages (optional - for static generation)
export async function generateStaticParams() {
  const pages = await prisma.page.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

// Main page component with SSR
export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;

  const page = await prisma.page.findUnique({
    where: { slug },
  });

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
