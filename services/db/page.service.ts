import { db } from '@/lib/db';
import { pages, type NewPage, type Page } from '@/lib/db/schema';
import { eq, desc, sql, type SQL } from 'drizzle-orm';
import type { PageUpsertData } from '@/types/page';
import type { LocalizedPuckContent } from '@/types/localized-content';

interface PageUpdateData {
  content: LocalizedPuckContent;
  updatedAt: SQL;
  title?: string;
  published?: boolean;
}

export const pageService = {
  async findBySlug(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page;
  },

  async findAll() {
    return await db
      .select({
        id: pages.id,
        slug: pages.slug,
        title: pages.title,
        published: pages.published,
        createdAt: pages.createdAt,
        updatedAt: pages.updatedAt,
      })
      .from(pages)
      .orderBy(desc(pages.updatedAt));
  },

  async create(data: NewPage): Promise<Page> {
    const now = new Date();
    const [page] = await db
      .insert(pages)
      .values({
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return page;
  },

  async upsert(slug: string, data: PageUpsertData): Promise<Page> {
    const now = new Date();

    // Build update object only with provided fields
    const updateData: PageUpdateData = {
      content: data.content,
      updatedAt: sql`NOW()`,
    };

    // Only update title if explicitly provided
    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    // Only update published if explicitly provided
    if (data.published !== undefined) {
      updateData.published = data.published;
    }

    const [page] = await db
      .insert(pages)
      .values({
        slug,
        title: data.title || `${slug} configuration`,
        content: data.content,
        published: data.published ?? true,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: pages.slug,
        set: updateData,
      })
      .returning();
    return page;
  },

  async delete(slug: string): Promise<void> {
    await db.delete(pages).where(eq(pages.slug, slug));
  },
};
