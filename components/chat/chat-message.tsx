"use client";

import { useTranslations } from "next-intl";
import { AIMessageRenderer } from "@/components/ai-message-renderer";
import type { UIMessage } from "ai";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const t = useTranslations("chat");

  const content = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");

  const authorName = message.role === "user" ? t("authorUser") : t("authorAI");

  return (
    <div className="mb-6">
      <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
        {authorName}
      </div>
      {message.role === "user" ? (
        <div className="text-foreground whitespace-pre-wrap">{content}</div>
      ) : (
        <AIMessageRenderer content={content} />
      )}
    </div>
  );
}
