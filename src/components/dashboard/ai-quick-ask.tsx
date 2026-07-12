"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Send } from "lucide-react";

export default function AiQuickAsk() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/dashboard/ai-hub?query=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-sm dark:from-blue-500/10 dark:via-purple-500/10 dark:to-blue-500/10" />
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-slate-600"
      >
        <Sparkles className="h-5 w-5 shrink-0 text-blue-500" />
        <input
          type="text"
          placeholder="Ask AI about your business..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none dark:text-white dark:placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
