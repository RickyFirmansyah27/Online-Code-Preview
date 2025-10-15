/* ──────────────────────────────────────────────────────────────────────
   ai-types.ts
   ──────────────────────────────────────────────────────────────────────
   Shared types and interfaces used across all AI service modules.
   ────────────────────────────────────────────────────────────────────── */

export interface ChatMessageContent {
  type: "text" | "image";
  content: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string | ChatMessageContent[];
}

export interface ApiMessageContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

export interface ApiChatMessage {
  role: "user" | "assistant" | "system";
  content: string | ApiMessageContent[];
}

export interface ChatRequest {
  model: string;
  messages: ApiChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export interface ApiResponse {
  data?: {
    choices?: Array<{
      message?: {
        content?: string | null;
      };
    }>;
  };
}

export interface ConversationContext {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
}