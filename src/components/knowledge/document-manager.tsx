"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Trash2, FileText, Loader2, AlertCircle } from "lucide-react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Skeleton from "@/components/ui/skeleton";
import type { KnowledgeDocument, DocumentStatus } from "@/types/knowledge";

interface DocumentManagerProps {
  documents: KnowledgeDocument[];
  loading: boolean;
  uploading: boolean;
  onUpload: (file: File) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
];

const ACCEPTED_EXTENSIONS = ".pdf,.docx,.txt,.csv";

const STATUS_MAP: Record<DocumentStatus, { label: string; variant: "warning" | "success" | "danger" | "default" }> = {
  PENDING: { label: "Pending", variant: "warning" },
  PROCESSING: { label: "Processing", variant: "warning" },
  COMPLETED: { label: "Ready", variant: "success" },
  FAILED: { label: "Failed", variant: "danger" },
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DocumentManager({
  documents,
  loading,
  uploading,
  onUpload,
  onDelete,
}: DocumentManagerProps) {
  const [dragOver, setDragOver] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      for (const file of Array.from(files)) {
        if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|docx|txt|csv)$/i)) {
          continue;
        }
        if (file.size > 20 * 1024 * 1024) {
          continue;
        }
        await onUpload(file);
      }
    },
    [onUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="flex h-full flex-col p-4">
      <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Documents
      </h3>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
          dragOver
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
            : "border-zinc-300 hover:border-emerald-400 hover:bg-zinc-50 dark:border-white/10 dark:hover:border-emerald-500 dark:hover:bg-white/[0.02]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <Loader2 className="mb-2 h-8 w-8 animate-spin text-emerald-500" />
        ) : (
          <Upload className="mb-2 h-8 w-8 text-zinc-400 dark:text-zinc-500" />
        )}
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {uploading ? "Uploading..." : "Drop files here or click to upload"}
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          PDF, DOCX, TXT, CSV &middot; Max 20 MB
        </p>
      </div>

      {/* Document List */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg p-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="mb-2 h-8 w-8 text-zinc-300 dark:text-zinc-600" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No documents uploaded yet
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => {
              const statusInfo = STATUS_MAP[doc.status] ?? STATUS_MAP.PENDING;
              return (
                <div
                  key={doc._id}
                  className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50/50 px-3 py-2.5 transition-colors hover:bg-zinc-100/50 dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                    <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatDate(doc.createdAt)}
                      {doc.status === "FAILED" && doc.errorMessage && (
                        <span className="ml-1 inline-flex items-center gap-1 text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {doc.errorMessage}
                        </span>
                      )}
                    </p>
                  </div>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    disabled={deletingId === doc._id}
                    className="shrink-0 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 disabled:opacity-50"
                    aria-label="Delete document"
                  >
                    {deletingId === doc._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
