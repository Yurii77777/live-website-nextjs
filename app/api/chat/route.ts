import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { model } from "@/lib/ai";
import { getRelevantContext } from "@/lib/vector-search";
import { AI_SYSTEM_PROMPTS, AI_CONFIG } from "@/constants/ai";

export const maxDuration = AI_CONFIG.maxDuration;

function detectLocale(req: Request): "uk" | "en" {
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const pathname = new URL(referer).pathname;
      const firstSegment = pathname.split("/").filter(Boolean)[0];
      if (firstSegment === "uk" || firstSegment === "en") {
        return firstSegment as "uk" | "en";
      }
    } catch {}
  }
  const acceptLanguage = (
    req.headers.get("accept-language") || ""
  ).toLowerCase();
  return acceptLanguage.includes("uk") ? "uk" : "en";
}

export async function POST(req: Request) {
  const { messages }: { messages: Array<Omit<UIMessage, "id">> } =
    await req.json();

  const lastMessage = messages[messages.length - 1];
  // Extract plain text from the last user message for vector search
  let lastUserText = "";
  if (lastMessage?.parts) {
    lastUserText = lastMessage.parts
      .filter((p) => p.type === "text")
      .map((p) => ("text" in p ? p.text : ""))
      .join("");
  }
  const context = await getRelevantContext(lastUserText);

  const locale = detectLocale(req);
  const systemPrompt = AI_SYSTEM_PROMPTS[locale as "uk" | "en"](context);

  const result = streamText({
    model,
    system: systemPrompt,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
