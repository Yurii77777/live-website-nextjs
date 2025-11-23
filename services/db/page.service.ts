import { db } from '@/lib/db';
import { pages, type NewPage, type Page } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { PageUpsertData } from '@/types/page';

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
    const [page] = await db.insert(pages).values(data).returning();
    return page;
  },

  async upsert(slug: string, data: PageUpsertData): Promise<Page> {
    const now = new Date();
    const [page] = await db
      .insert(pages)
      .values({
        slug,
        title: data.title || `${slug} configuration`,
        content: data.content || data,
        published: data.published ?? true,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: pages.slug,
        set: {
          content: data.content || data,
          updatedAt: sql`NOW()`,
        },
      })
      .returning();
    return page;
  },

  async delete(slug: string): Promise<void> {
    await db.delete(pages).where(eq(pages.slug, slug));
  },
};
