"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useKnowledge } from "@/hooks/use-knowledge";
import DocumentManager from "@/components/knowledge/document-manager";
import AiChat from "@/components/knowledge/ai-chat";
import { staggerContainer, fadeInUp } from "@/lib/animations";
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

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (chatHistory.length > 0) {
      setMessages(chatHistory);
    }
  }, [chatHistory]);

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
        chatId: response.chatId,
        report: response.report,
        sources: response.sources,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setChatHistory((prev) => [...prev, aiMsg]);
    },
    [sendChatMessage, setChatHistory],
  );

  return (
    <motion.div
      className="flex h-[calc(100vh-8rem)] flex-col gap-6 p-4 sm:p-6 md:h-[calc(100vh-4rem)]"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="shrink-0 space-y-1" variants={fadeInUp}>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
          AI Knowledge Hub
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Upload documents and ask questions powered by AI.
        </p>
      </motion.div>

      {/* Two-column layout */}
      <motion.div className="min-h-0 flex-1 grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]" variants={fadeInUp}>
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
      </motion.div>
    </motion.div>
  );
}
