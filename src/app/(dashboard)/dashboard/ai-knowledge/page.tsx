"use client";

import { useCallback, useState } from "react";
import { useKnowledge } from "@/hooks/use-knowledge";
import DocumentManager from "@/components/knowledge/document-manager";
import AiChat from "@/components/knowledge/ai-chat";
import type { ChatMessage } from "@/types/knowledge";

export default function AiKnowledgePage() {
  const {
    documents,
    chatHistory,
    setChatHistory,
    loading,
    uploading,
    chatLoading,
    uploadDocument,
    deleteDocument,
    sendChatMessage,
  } = useKnowledge();

  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory);

  const handleSend = useCallback(
    async (question: string) => {
      const userMsg: ChatMessage = { role: "user", content: question };
      setMessages((prev) => [...prev, userMsg]);
      setChatHistory((prev) => [...prev, userMsg]);

      const response = await sendChatMessage(question);

      if (!response) {
        const errorMsg: ChatMessage = {
          role: "ai",
          content: "Error: Received empty response from AI",
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      const aiMsg: ChatMessage = {
        role: "ai",
        content: response.answer,
        report: response.report,
        sources: response.sources,
      };

      console.log("FRONTEND DEBUG - aiMsg built:", aiMsg);
      setMessages((prev) => [...prev, aiMsg]);
      setChatHistory((prev) => [...prev, aiMsg]);
    },
    [sendChatMessage, setChatHistory],
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-6 p-6">
      {/* Header */}
      <div className="shrink-0 space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Knowledge Hub
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Upload documents and ask questions powered by AI.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="min-h-0 flex-1 grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left sidebar — Document Manager */}
        <div className="min-h-0 lg:overflow-y-auto">
          <DocumentManager
            documents={documents}
            loading={loading}
            uploading={uploading}
            onUpload={uploadDocument}
            onDelete={deleteDocument}
          />
        </div>

        {/* Right — Chat */}
        <div className="min-h-0">
          <AiChat
            messages={messages}
            onSend={handleSend}
            loading={chatLoading}
          />
        </div>
      </div>
    </div>
  );
}
