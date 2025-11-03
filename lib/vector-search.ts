import { prisma } from "@/lib/prisma";
import { embed } from "ai";
import { embeddingModel } from "@/lib/ai";
import { AI_CONFIG } from "@/constants/ai";

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Search knowledge base using vector similarity
 */
export async function searchKnowledgeBase(
  query: string,
  topK: number = AI_CONFIG.topK,
  threshold: number = AI_CONFIG.similarityThreshold
): Promise<Array<{ content: string; similarity: number; metadata: any }>> {
  // Generate embedding for the query
  console.info(
    `[kb] embed start len=${query.length} topK=${topK} threshold=${threshold}`
  );
  const { embedding: queryEmbedding } = await embed({
    model: embeddingModel,
    value: query,
  });
  console.info(`[kb] embed done dim=${queryEmbedding.length}`);

  // Get all knowledge base entries
  const allEntries = await prisma.knowledgeBase.findMany({
    where: {
      embedding: {
        not: null,
      },
    },
  });
  console.info(`[kb] entries fetched count=${allEntries.length}`);

  // Calculate similarities
  const queryDim = queryEmbedding.length;
  let skippedDim = 0;
  const results = allEntries
    .map((entry) => {
      if (!entry.embedding) return null;

      const parsed = JSON.parse(entry.embedding);
      const entryEmbedding = Array.isArray(parsed)
        ? parsed
        : parsed?.embedding ?? parsed?.data ?? null;
      if (!Array.isArray(entryEmbedding)) return null;
      if (entryEmbedding.length !== queryDim) {
        skippedDim += 1;
        return null;
      }

      const similarity = cosineSimilarity(
        queryEmbedding,
        entryEmbedding as number[]
      );

      return {
        content: entry.content,
        similarity,
        metadata: entry.metadata,
      };
    })
    .filter((result): result is NonNullable<typeof result> => result !== null)
    .filter((result) => result.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  console.info(`[kb] results count=${results.length} skippedDim=${skippedDim}`);

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
