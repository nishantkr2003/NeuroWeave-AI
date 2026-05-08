"use client";

import { useChatStore } from "@/store/chatStore";
import { Bot, Sparkles } from "lucide-react";

export default function ChatWindow() {
  const { messages } = useChatStore();

  return (
    <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-180px)]">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="p-5 rounded-3xl bg-indigo-500/10 mb-6">
            <Sparkles className="text-indigo-400" size={48} />
          </div>

          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to Multi-Modal AI
          </h2>

          <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
            Upload images, videos, audio, or documents and start intelligent
            conversations powered by AI.
          </p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl px-5 py-4 rounded-3xl shadow-lg ${
                  msg.role === "user"
                    ? "bg-indigo-500 text-white"
                    : "glass-card text-white"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2 text-indigo-300">
                    <Bot size={18} />
                    <span className="text-sm font-medium">AI Assistant</span>
                  </div>
                )}

                <p className="leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
