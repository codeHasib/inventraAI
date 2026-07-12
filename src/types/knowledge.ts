export type DocumentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface KnowledgeDocument {
  _id: string;
  shopId: string;
  fileName: string;
  fileType: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  extractedText: string;
  status: DocumentStatus;
  errorMessage?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSource {
  documentId?: string;
  fileName?: string;
  chunk?: string;
  score?: number;
}

// --- Report types (supports both backend formats) ---

export interface ReportSectionItem {
  header: string;
  content: string;
  priority?: "High" | "Medium" | "Low";
}

export interface ReportData {
  title?: string;
  summary?: string;
  sections?: ReportSectionItem[];
  recommendations?: string[];
  chartData?: Record<string, unknown>[];
}

// --- Chat message (content can be string or object with .report) ---

export interface ChatMessageContent {
  report?: ReportData;
  [key: string]: unknown;
}

export interface ChatMessage {
  role: "user" | "ai";
  content: string | ChatMessageContent;
  chatId?: string;
  report?: ReportData;
  sources?: ChatSource[];
  createdAt?: string;
}

export interface ChatResponse {
  answer: string | ChatMessageContent;
  chatId?: string;
  sources: ChatSource[];
  report?: ReportData;
}

// --- Resolver ---

export function isReportContent(
  content: string | ChatMessageContent,
): content is ChatMessageContent {
  return (
    typeof content === "object" &&
    content !== null &&
    "report" in content &&
    typeof (content as ChatMessageContent).report === "object"
  );
}

export function resolveAiContent(
  content: string | ChatMessageContent,
  report?: ReportData,
): { report: ReportData | null; text: string } {
  // Already-parsed report prop takes priority
  if (report) {
    const text =
      typeof content === "string"
        ? content
        : String((content as ReportData).summary ?? "");
    return { report, text };
  }

  // Object content with .report inside it
  if (isReportContent(content)) {
    return { report: content.report!, text: content.report!.summary ?? "" };
  }

  // String content — try JSON.parse
  if (typeof content === "string") {
    if (content.trim() === "") {
      return { report: null, text: "Error: Received empty response from AI" };
    }

    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        if (isReportContent(parsed)) {
          return { report: parsed.report!, text: parsed.report!.summary ?? "" };
        }
        if (parsed.report && typeof parsed.report === "object") {
          return { report: parsed.report as ReportData, text: parsed.summary ?? "" };
        }
        if (parsed.title || parsed.sections || parsed.recommendations) {
          return { report: parsed as ReportData, text: parsed.summary ?? "" };
        }
      }
    } catch {
      // not JSON — plain text
    }

    return { report: null, text: content };
  }

  return { report: null, text: "Error: Received empty response from AI" };
}
