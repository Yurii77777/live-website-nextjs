import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel, EmbeddingModel } from "ai";

const provider = process.env.AI_PROVIDER;
const modelName = process.env.AI_MODEL;
const apiKey = process.env.AI_API_KEY;

if (!provider) {
  throw new Error('AI_PROVIDER is required. Example: "openai" or "google"');
}

if (!modelName) {
  throw new Error(
    'AI_MODEL is required. Example: "gpt-4o-mini" or "gemini-2.0-flash-exp"'
  );
}

if (!apiKey) {
  throw new Error("AI_API_KEY is required");
}

let model: LanguageModel;
let embeddingModel: EmbeddingModel;

if (provider === "openai") {
  const openaiClient = createOpenAI({ apiKey });
  model = openaiClient(modelName) as unknown as LanguageModel;
  embeddingModel = openaiClient.textEmbeddingModel(
    "text-embedding-3-small"
  ) as unknown as EmbeddingModel;
  console.info(
    `[ai] provider=openai, chatModel=${modelName}, embeddingModel=text-embedding-3-small`
  );
} else if (provider === "google") {
  const googleClient = createGoogleGenerativeAI({ apiKey });
  model = googleClient(modelName) as unknown as LanguageModel;
  embeddingModel = googleClient.textEmbeddingModel(
    "text-embedding-004"
  ) as unknown as EmbeddingModel;
  console.info(
    `[ai] provider=google, chatModel=${modelName}, embeddingModel=text-embedding-004`
  );
} else {
  throw new Error(
    `Unknown AI provider: "${provider}". Supported providers: "openai", "google"`
  );
}

export { model, embeddingModel };
