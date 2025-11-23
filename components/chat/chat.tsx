"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatMessage } from "./chat-message";
import { ChatForm } from "@/components/forms/chat-form";
import {
  chatMessageSchema,
  type ChatMessageFormData,
} from "@/schemas/chat.schema";

interface ChatProps {
  initialContent?: React.ReactNode;
}

export function Chat({ initialContent }: ChatProps) {
  const { messages, sendMessage, status } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<ChatMessageFormData>({
    resolver: zodResolver(chatMessageSchema),
    mode: "onChange",
    defaultValues: {
      message: "",
    },
  });

  // Auto-scroll to bottom when messages change or during streaming
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 mx-auto w-full">
        {initialContent && <div className="mb-6">{initialContent}</div>}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatForm form={form} sendMessage={sendMessage} />
    </div>
  );
}
