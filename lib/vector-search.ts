import { knowledgeBaseService } from "@/services/db/knowledge-base.service";
import { embed } from "ai";
import { embeddingModel } from "@/lib/ai";
import { AI_CONFIG } from "@/constants/ai";
import type { KnowledgeBaseSearchResult } from "@/types/knowledge-base";

export async function searchKnowledgeBase(
  query: string,
  topK: number = AI_CONFIG.topK,
  threshold: number = AI_CONFIG.similarityThreshold
): Promise<KnowledgeBaseSearchResult[]> {
  console.info(
    `[kb] embed start len=${query.length} topK=${topK} threshold=${threshold}`
  );

  const { embedding: queryEmbedding } = await embed({
    model: embeddingModel,
    value: query,
  });

  console.info(`[kb] embed done dim=${queryEmbedding.length}`);

  const results = await knowledgeBaseService.searchByVector(queryEmbedding, {
    topK,
    threshold,
  });

  console.info(`[kb] results count=${results.length}`);

  return results;
}

/**
 * Get relevant context for AI based on user query
 */
export async function getRelevantContext(query: string): Promise<string> {
  const results = await searchKnowledgeBase(
    query,
    AI_CONFIG.topK,
    AI_CONFIG.similarityThreshold
  );

  if (results.length === 0) {
    return "Немає релевантної інформації в базі знань.";
  }

  const context = results
    .map((result, index) => {
      return `[Джерело ${index + 1}] (релевантність: ${(
        result.similarity * 100
      ).toFixed(1)}%)\n${result.content}`;
    })
    .join("\n\n---\n\n");
  console.info(`[kb] context length=${context.length}`);
  return context;
}
