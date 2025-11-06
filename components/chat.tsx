"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIMessageRenderer } from "@/components/ai-message-renderer";

export function Chat() {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const t = useTranslations("chat");

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 mx-auto w-full max-w-3xl">
        {messages.map((m) => {
          const content = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          return (
            <div key={m.id} className="mb-6">
              <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                {m.role === "user" ? "Ви" : "Magic WebLab"}
              </div>
              {m.role === "user" ? (
                <div className="text-foreground whitespace-pre-wrap">{content}</div>
              ) : (
                <AIMessageRenderer content={content} />
              )}
            </div>
          );
        })}
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!input.trim()) return;
          await sendMessage({ text: input });
          setInput("");
        }}
        className="border-t relative p-4 shrink-0 bg-gray-900 rounded-t-3xl before:absolute before:inset-0 before:bg-linear-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 before:opacity-20 before:rounded-t-3xl"
      >
        <div className="flex gap-4 w-full max-w-3xl mx-auto relative z-10">
          <Input
            value={input}
            placeholder={t("placeholder")}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" variant="default" disabled={!input.trim()}>
            {t("send")}
          </Button>
        </div>
      </form>
    </div>
  );
}
