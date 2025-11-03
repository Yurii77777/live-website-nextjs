"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export function Chat() {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap mb-4">
          <strong>{m.role === "user" ? "User: " : "AI: "}</strong>
          {m.parts.map((p) => (p.type === "text" ? p.text : "")).join("")}
        </div>
      ))}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!input.trim()) return;
          await sendMessage({ text: input });
          setInput("");
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}
