/* ──────────────────────────────────────────────────────────────────────
   index.ts
   ──────────────────────────────────────────────────────────────────────
   Main exports for the AI service modules.
   ────────────────────────────────────────────────────────────────────── */

// Export all hooks from their respective modules
export { useConversationAi } from "./ai-conversation";
export { useCodingAssistant } from "./coding-assistant";
export { useCodeAnalyzer } from "./code-analyzer";

// Export all types
export type {
  ChatMessageContent,
  ChatMessage,
  ApiMessageContent,
  ApiChatMessage,
  ChatRequest,
  ApiResponse,
  ConversationContext,
} from "./ai-types";