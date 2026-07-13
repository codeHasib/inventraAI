"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, BookOpen } from "lucide-react";
import Card from "@/components/ui/card";
import ReportView from "./report-view";
import { resolveAiContent } from "@/types/knowledge";
import type { ChatMessage, ChatSource } from "@/types/knowledge";

interface AiChatProps {
  messages: ChatMessage[];
  onSend: (question: string) => Promise<void>;
  loading: boolean;
}

function SourceBadge({ source }: { source: ChatSource }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
      <BookOpen className="h-3 w-3" />
      {source.fileName ?? "Document"}
    </span>
  );
}

function AiMessageBubble({ msg }: { msg: ChatMessage }) {
  const { report, text } = resolveAiContent(msg.content, msg.report);

  return (
    <div className="space-y-2">
      {report ? (
        <ReportView data={report} chatId={msg.chatId} />
      ) : null}
      {text && (
        <div
          className={`rounded-xl px-4 py-2.5 text-sm ${
            text.startsWith("Error:")
              ? "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-500/10 dark:text-red-400"
              : "bg-zinc-100 text-zinc-900 dark:bg-white/5 dark:text-zinc-100"
          }`}
        >
          <p className="whitespace-pre-wrap">{text}</p>
        </div>
      )}
    </div>
  );
}

export default function AiChat({ messages, onSend, loading }: AiChatProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput("");
    await onSend(trimmed);
  };

  return (
    <Card className="flex h-full flex-col p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
          <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            AI Assistant
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Ask questions about your business documents
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !loading ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10">
              <Bot className="h-7 w-7 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Ask me anything
            </p>
            <p className="mt-1 max-w-xs text-xs text-zinc-500 dark:text-zinc-400">
              I can answer questions based on your uploaded business documents, reports, and files.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                    <Bot className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] ${
                    msg.role === "user"
                      ? "rounded-xl bg-emerald-600 px-4 py-2.5 text-sm text-white"
                      : "w-full max-w-full"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <AiMessageBubble msg={msg} />
                  ) : (
                    <div className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm text-white">
                      <p className="whitespace-pre-wrap">{msg.content as string}</p>
                    </div>
                  )}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 border-t border-zinc-200/50 pt-2 dark:border-white/[0.08]">
                      {msg.sources.map((s, j) => (
                        <SourceBadge key={j} source={s} />
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <User className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                  <Bot className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 dark:bg-white/5">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    Thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your documents..."
            disabled={loading}
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </Card>
  );
}
