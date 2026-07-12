"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, BookOpen } from "lucide-react";
import Card from "@/components/ui/card";
import ReportView from "./report-view";
import { resolveAiContent, isReportContent } from "@/types/knowledge";
import type { ChatMessage, ChatSource, ChatMessageContent } from "@/types/knowledge";

interface AiChatProps {
  messages: ChatMessage[];
  onSend: (question: string) => Promise<void>;
  loading: boolean;
}

function SourceBadge({ source }: { source: ChatSource }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
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
        <ReportView data={report} />
      ) : null}
      {text && (
        <div
          className={`rounded-xl px-4 py-2.5 text-sm ${
            text.startsWith("Error:")
              ? "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
              : "bg-slate-100 text-gray-900 dark:bg-slate-800 dark:text-white"
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
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
          <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            AI Assistant
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ask questions about your business documents
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !loading ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/30">
              <Bot className="h-7 w-7 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Ask me anything
            </p>
            <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">
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
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                    <Bot className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] ${
                    msg.role === "user"
                      ? "rounded-xl bg-blue-600 px-4 py-2.5 text-sm text-white"
                      : "w-full max-w-full"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <AiMessageBubble msg={msg} />
                  ) : (
                    <div className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm text-white">
                      <p className="whitespace-pre-wrap">{msg.content as string}</p>
                    </div>
                  )}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 border-t border-slate-200/50 pt-2 dark:border-slate-700/50">
                      {msg.sources.map((s, j) => (
                        <SourceBadge key={j} source={s} />
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                    <User className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                  <Bot className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
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
      <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
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
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </Card>
  );
}
