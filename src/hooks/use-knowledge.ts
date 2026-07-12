"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import type {
  KnowledgeDocument,
  ChatMessage,
  ChatResponse,
  ChatMessageContent,
} from "@/types/knowledge";

const POLL_INTERVAL = 3000;

export function useKnowledge() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchDocuments = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data: res } = await api.get("/ai/knowledge");
      const raw = res?.data;
      let docs: KnowledgeDocument[] = [];
      if (Array.isArray(raw)) {
        docs = raw;
      } else if (Array.isArray(raw?.documents)) {
        docs = raw.documents;
      }
      setDocuments(docs);

      const hasProcessing = docs.some(
        (d) => d.status === "PENDING" || d.status === "PROCESSING",
      );
      if (hasProcessing && !pollRef.current) {
        pollRef.current = setInterval(() => {
          fetchDocuments(true);
        }, POLL_INTERVAL);
      } else if (!hasProcessing && pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    } catch {
      if (!silent) toast.error("Failed to load documents");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(
    async (file: File) => {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const { data: res } = await api.post("/ai/knowledge/upload", formData);
        toast.success(res?.message ?? "Document uploaded successfully");
        await fetchDocuments();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        toast.error(msg);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [fetchDocuments],
  );

  const deleteDocument = useCallback(async (id: string) => {
    try {
      const { data: res } = await api.delete(`/ai/knowledge/${id}`);
      toast.success(res?.message ?? "Document deleted");
      setDocuments((prev) => prev.filter((d) => d._id !== id));
    } catch {
      toast.error("Failed to delete document");
    }
  }, []);

  const fetchChatHistory = useCallback(async () => {
    try {
      const { data: res } = await api.get("/ai/knowledge/chat/history");
      const raw = res?.data?.data ?? res?.data;
      if (!Array.isArray(raw)) return;

      const messages: ChatMessage[] = [];
      for (const entry of raw) {
        const entryId = String(entry._id ?? "");
        const question = String(entry.question ?? "");
        const rawAnswer = entry.answer;
        const sources = Array.isArray(entry.sources) ? entry.sources : [];

        if (question) {
          messages.push({ role: "user", content: question, chatId: entryId });
        }

        if (rawAnswer) {
          let aiContent: string | ChatMessageContent;
          let report: ChatResponse["report"] | undefined;

          if (typeof rawAnswer === "object" && rawAnswer !== null) {
            const obj = rawAnswer as Record<string, unknown>;
            if (obj.report && typeof obj.report === "object") {
              report = obj.report as ChatResponse["report"];
              aiContent = String(obj.summary ?? obj.answer ?? "");
            } else if (obj.sections || obj.recommendations || obj.title) {
              report = rawAnswer as unknown as ChatResponse["report"];
              aiContent = String(obj.summary ?? "");
            } else {
              aiContent = rawAnswer as ChatMessageContent;
            }
          } else {
            aiContent = String(rawAnswer);
            try {
              const parsed = JSON.parse(aiContent);
              if (parsed && typeof parsed === "object") {
                if (parsed.report) report = parsed.report;
                else if (parsed.sections || parsed.recommendations) report = parsed;
              }
            } catch {
              // plain text, fine
            }
          }

          messages.push({ role: "ai", content: aiContent, chatId: entryId, report, sources });
        }
      }

      setChatHistory(messages);
    } catch {
      // chat history is non-critical
    }
  }, []);

  const sendChatMessage = useCallback(
    async (question: string): Promise<ChatResponse | null> => {
      try {
        setChatLoading(true);
        const { data: res } = await api.post("/ai/knowledge/chat", {
          question,
        });

        const raw = res?.data?.data ?? res?.data;

        // Preserve object content — don't stringify
        const rawAnswer = raw?.answer;
        const content: string | ChatMessageContent =
          typeof rawAnswer === "object" && rawAnswer !== null
            ? (rawAnswer as ChatMessageContent)
            : String(rawAnswer ?? "");

        // Also try to extract report from answer if it's an object
        let report = raw?.report as ChatResponse["report"] | undefined;
        if (!report && typeof rawAnswer === "object" && rawAnswer !== null) {
          const obj = rawAnswer as Record<string, unknown>;
          if (obj.report && typeof obj.report === "object") {
            report = obj.report as ChatResponse["report"];
          } else if (obj.sections || obj.recommendations || obj.title) {
            report = rawAnswer as unknown as ChatResponse["report"];
          }
        }

        return {
          answer: content,
          chatId: String(raw?._id ?? raw?.chatId ?? ""),
          sources: Array.isArray(raw?.sources) ? raw.sources : [],
          report,
        };
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to get answer";
        toast.error(msg);
        return null;
      } finally {
        setChatLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchDocuments();
    fetchChatHistory();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchDocuments, fetchChatHistory]);

  return {
    documents,
    chatHistory,
    setChatHistory,
    loading,
    uploading,
    chatLoading,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    sendChatMessage,
  };
}
