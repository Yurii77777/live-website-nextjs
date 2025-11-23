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
  // Always get system components (UI components, icons, etc.)
  const systemComponents = await knowledgeBaseService.getSystemComponents();
  console.info(`[kb] system components count=${systemComponents.length}`);

  // Get content-specific results based on user query
  const contentResults = await searchKnowledgeBase(
    query,
    AI_CONFIG.topK,
    AI_CONFIG.similarityThreshold
  );

  // Combine system components with content results
  // System components come first to ensure AI always knows about available UI
  const allResults = [...systemComponents, ...contentResults];

  if (allResults.length === 0) {
    return "No relevant information in knowledge base.";
  }

  const context = allResults
    .map((result, index) => {
      const source = index < systemComponents.length
        ? `[System Component ${index + 1}]`
        : `[Source ${index + 1 - systemComponents.length}] (relevance: ${(result.similarity * 100).toFixed(1)}%)`;
      return `${source}\n${result.content}`;
    })
    .join("\n\n---\n\n");

  console.info(`[kb] context length=${context.length} (system=${systemComponents.length}, content=${contentResults.length})`);
  return context;
}
