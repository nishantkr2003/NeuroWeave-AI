"use client";

import { useState, useRef, useEffect } from "react";

import { useAuth } from "@clerk/nextjs";

import useChatStore from "@/store/chatStore";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Bot, Sparkles, Send, Paperclip, User, Loader2 } from "lucide-react";

export default function ChatWindow() {
  const { getToken } = useAuth();

  const {
    messages,
    addMessage,
    activeConversationId,
    activeConversationTitle,
    uploadProgress,
    setUploadProgress,
  } = useChatStore();

  const [input, setInput] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* Better auto-scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping, uploadProgress]);

  /* Send message */
  const handleSend = async () => {
    try {
      if (!input.trim() || !activeConversationId) return;

      const userContent = input.trim();

      addMessage({
        role: "user",
        content: userContent,
      });

      setInput("");
      setIsTyping(true);

      const token = await getToken({
        template: "neon",
      });

      if (!token) {
        throw new Error("Authentication failed");
      }

      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: activeConversationId,
          content: userContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Message failed");
      }

      if (data.assistantMessage) {
        addMessage({
          role: "assistant",
          content: data.assistantMessage.content,
        });
      }
    } catch (error: any) {
      addMessage({
        role: "assistant",
        content: error.message || "Something went wrong.",
      });
    } finally {
      setIsTyping(false);
    }
  };

  /* Upload with progress */
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = event.target.files?.[0];

      if (!file || !activeConversationId) return;

      const token = await getToken({
        template: "neon",
      });

      if (!token) {
        throw new Error("Authentication failed");
      }

      const formData = new FormData();

      formData.append("file", file);

      formData.append("conversation_id", activeConversationId);

      addMessage({
        role: "user",
        content: `Uploaded: ${file.name}`,
      });

      setUploadProgress(10);

      const xhr = new XMLHttpRequest();

      xhr.open("POST", "http://localhost:5000/api/upload");

      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);

          setUploadProgress(percent);
        }
      };

      xhr.onload = async () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          addMessage({
            role: "assistant",
            content: "Upload failed.",
          });

          setUploadProgress(0);

          return;
        }

        const uploadData = JSON.parse(xhr.responseText);

        const media = uploadData.media;

        let endpoint = "";

        if (media.file_type === "image") endpoint = "/api/analyze/image";
        else if (media.file_type === "video") endpoint = "/api/analyze/video";
        else if (media.file_type === "audio") endpoint = "/api/analyze/audio";
        else if (media.file_type === "document")
          endpoint = "/api/analyze/document";

        if (endpoint) {
          setIsTyping(true);

          const analysisResponse = await fetch(
            `http://localhost:5000${endpoint}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                media_id: media.id,
              }),
            },
          );

          const analysisData = await analysisResponse.json();

          addMessage({
            role: "assistant",
            content:
              analysisData.analysis ||
              analysisData.summary ||
              analysisData.overallSummary ||
              "Analysis complete.",
          });

          setIsTyping(false);
        }

        setUploadProgress(0);
      };

      xhr.send(formData);
    } catch (error: any) {
      addMessage({
        role: "assistant",
        content: error.message || "Upload failed.",
      });

      setUploadProgress(0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0b0f17] to-[#111827] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-4">
        <h2 className="text-lg font-semibold truncate">
          {activeConversationTitle}
        </h2>
      </div>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <div className="p-5 rounded-3xl bg-indigo-500/10 mb-6">
              <Sparkles className="text-indigo-400" size={52} />
            </div>

            <h1 className="text-5xl font-semibold mb-4">
              How can I help you today?
            </h1>

            <p className="text-gray-400 text-lg">Upload once. Ask anything.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Bot size={18} className="text-indigo-400" />
                  </div>
                )}

                <div
                  className={`rounded-3xl px-6 py-4 max-w-3xl overflow-hidden ${
                    msg.role === "user"
                      ? "bg-indigo-600"
                      : "bg-[#161b22] border border-white/5"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(
                              className || "",
                            );

                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code
                                className="bg-black/30 px-1 py-0.5 rounded"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                    <User size={18} className="text-gray-300" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing */}
            {isTyping && (
              <div className="flex items-center gap-3 text-gray-400">
                <Loader2 className="animate-spin" size={18} />
                AI is thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Upload Progress */}
      {uploadProgress > 0 && (
        <div className="px-6">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{
                width: `${uploadProgress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-[#161b22] rounded-3xl px-4 py-3 border border-white/10">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl hover:bg-white/5"
          >
            <Paperclip className="text-gray-400" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileUpload}
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Message Multi-Modal AI..."
            className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-500"
          />

          <button
            onClick={handleSend}
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
