import { pgTable, text, vector, timestamp, json, boolean, index } from 'drizzle-orm/pg-core';

export const pages = pgTable('Page', {
  id: text('id').primaryKey().$defaultFn(() => {
    return `c${Date.now().toString(36)}${Math.random().toString(36).substring(2, 15)}`;
  }),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  content: json('content').notNull(),
  published: boolean('published').default(false).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

export const knowledgeBase = pgTable('KnowledgeBase', {
  id: text('id').primaryKey().$defaultFn(() => {
    return `c${Date.now().toString(36)}${Math.random().toString(36).substring(2, 15)}`;
  }),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }),
  metadata: json('metadata'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  index('embedding_idx').using('hnsw', table.embedding.op('vector_cosine_ops'))
]);

export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type KnowledgeBase = typeof knowledgeBase.$inferSelect;
export type NewKnowledgeBase = typeof knowledgeBase.$inferInsert;
