import { db } from "@/lib/db";
import {
  knowledgeBase,
  type NewKnowledgeBase,
  type KnowledgeBase,
} from "@/lib/db/schema";
import { cosineDistance, sql } from "drizzle-orm";
import type { KnowledgeBaseSearchResult } from "@/types/knowledge-base";

export const knowledgeBaseService = {
  async create(data: NewKnowledgeBase): Promise<KnowledgeBase> {
    const vectorString = data.embedding
      ? `[${data.embedding.join(",")}]`
      : null;
    const now = new Date();

    const [entry] = await db
      .insert(knowledgeBase)
      .values({
        content: data.content,
        embedding: vectorString ? sql`${vectorString}::vector` : null,
        metadata: data.metadata,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return entry;
  },

  async deleteAll(): Promise<void> {
    await db.delete(knowledgeBase);
  },

  async searchByVector(
    queryEmbedding: number[],
    options: {
      topK?: number;
      threshold?: number;
    } = {}
  ): Promise<KnowledgeBaseSearchResult[]> {
    const { topK = 3, threshold = 0.3 } = options;

    const results = await db
      .select({
        content: knowledgeBase.content,
        metadata: knowledgeBase.metadata,
        distance: cosineDistance(knowledgeBase.embedding, queryEmbedding),
      })
      .from(knowledgeBase)
      .where(sql`${knowledgeBase.embedding} IS NOT NULL`)
      .orderBy(cosineDistance(knowledgeBase.embedding, queryEmbedding))
      .limit(topK);

    return results
      .map((r) => ({
        content: r.content,
        similarity: 1 - (Number(r.distance) ?? 1),
        metadata: r.metadata as KnowledgeBaseSearchResult['metadata'],
      }))
      .filter((r) => r.similarity >= threshold);
  },

  async getSystemComponents(): Promise<KnowledgeBaseSearchResult[]> {
    const results = await db
      .select({
        content: knowledgeBase.content,
        metadata: knowledgeBase.metadata,
      })
      .from(knowledgeBase)
      .where(sql`${knowledgeBase.metadata}->>'category' = 'system'`);

    return results.map((r) => ({
      content: r.content,
      similarity: 1, // System components always have 100% relevance
      metadata: r.metadata as KnowledgeBaseSearchResult['metadata'],
    }));
  },
};
