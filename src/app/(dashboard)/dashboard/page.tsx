"use client";

import { useState } from "react";
import api from "@/lib/axios";

export default function DashboardPage() {
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResponse(null);
    setStatus(null);

    try {
      const res = await api.get("/shops");
      setStatus(res.status);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      const resStatus = err.response?.status ?? "Network Error";
      const body = err.response?.data ?? { message: err.message };
      setStatus(resStatus);
      setResponse(JSON.stringify(body, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Backend Connection"}
      </button>

      {status !== null && (
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium">Status:</span>
            <span
              className={`px-2 py-1 rounded text-sm font-mono ${
                status >= 200 && status < 300
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status}
            </span>
          </div>

          <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}
