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
      const raw = res?.data;
      if (Array.isArray(raw)) {
        setChatHistory(
          raw.map((m: Record<string, unknown>) => {
            // Preserve object content if backend sends it
            const rawContent = m.content ?? m.message;
            const content: string | ChatMessageContent =
              typeof rawContent === "object" && rawContent !== null
                ? (rawContent as ChatMessageContent)
                : String(rawContent ?? "");

            return {
              role: (m.role === "user" ? "user" : "ai") as "user" | "ai",
              content,
              report: m.report as ChatResponse["report"] | undefined,
              sources: Array.isArray(m.sources) ? m.sources : undefined,
              createdAt: m.createdAt as string | undefined,
            };
          }),
        );
      }
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

        // DEBUG: log the full API envelope
        console.log("FRONTEND DEBUG - API envelope:", res);
        console.log("FRONTEND DEBUG - res.data:", res?.data);
        console.log("FRONTEND DEBUG - res.data.data:", res?.data?.data);

        const raw = res?.data?.data ?? res?.data;

        // DEBUG: log what we extracted
        console.log("FRONTEND DEBUG - raw answer:", raw?.answer);
        console.log("FRONTEND DEBUG - raw report:", raw?.report);
        console.log(
          "FRONTEND DEBUG - answer type:",
          typeof raw?.answer,
          Array.isArray(raw?.answer) ? "(array)" : "",
        );

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

        const result: ChatResponse = {
          answer: content,
          sources: Array.isArray(raw?.sources) ? raw.sources : [],
          report,
        };

        console.log("FRONTEND DEBUG - final result:", result);
        return result;
      } catch (err: unknown) {
        console.error("FRONTEND DEBUG - API error:", err);
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
