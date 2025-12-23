/* ──────────────────────────────────────────────────────────────────────
   code-analyzer.ts
   ──────────────────────────────────────────────────────────────────────
   useCodeAnalyzer hook for code analysis with conversation history.
   ────────────────────────────────────────────────────────────────────── */

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiPost } from "./axios-client";
import {
  ChatMessage,
  ChatRequest,
  ApiChatMessage,
} from "./ai-types";
import { BASE_PATH, buildApiMessages, DEFAULT_QUERY_OPTIONS, getHeaders } from "./ai-service";
import { debuggingPrompt } from "@/lib/debuging-prompt";
/* ------------------------------------------------------------------ */
/* Hook: useCodeAnalyzer                                            */
/* ------------------------------------------------------------------ */

export const useCodeAnalyzer = (model: string, memoryLimit: number = 6) => {
  const systemPrompt = debuggingPrompt(model);

  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(() => [
    { role: "system", content: systemPrompt },
  ]);

  const resetConversation = useCallback(() => {
    setConversationHistory([{ role: "system", content: systemPrompt }]);
  }, [systemPrompt]);

  const mutation = useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: async (content: string) => {
      const userMessage: ChatMessage = { role: "user", content };
      const fullHistory = [...conversationHistory, userMessage];

      // Check if any message in history contains an image
      const hasImageInHistory = fullHistory.some(msg =>
        Array.isArray(msg.content) && msg.content.some(c => c.type === "image")
      );

      // Smart memory limit: reduce to 4 pairs max when images exist
      const IMAGE_MEMORY_LIMIT = 4;
      const effectiveMemoryLimit = hasImageInHistory
        ? Math.min(memoryLimit, IMAGE_MEMORY_LIMIT)
        : memoryLimit;

      // Truncate history: keep system prompt + last N pairs
      const truncateHistory = (history: ChatMessage[], limit: number): ChatMessage[] => {
        const systemMsg = history[0];
        const pairs = history.slice(1);
        const maxMessages = limit * 2;
        const truncated = pairs.slice(-maxMessages);
        return [systemMsg, ...truncated];
      };

      // Strip old images: keep only the last user image
      const stripOldImages = (history: ChatMessage[]): ChatMessage[] => {
        let lastImageIndex = -1;

        for (let i = history.length - 1; i >= 0; i--) {
          const msg = history[i];
          if (msg.role === "user" && Array.isArray(msg.content) &&
            msg.content.some(c => c.type === "image")) {
            lastImageIndex = i;
            break;
          }
        }

        return history.map((msg, index) => {
          if (index === lastImageIndex) return msg;
          if (!Array.isArray(msg.content)) return msg;

          const hasImage = msg.content.some(c => c.type === "image");
          if (!hasImage) return msg;

          const textOnly = msg.content.filter(c => c.type === "text");
          return {
            ...msg,
            content: textOnly.length > 0 ? textOnly : [{ type: "text" as const, content: "[Image removed from history]" }]
          };
        });
      };

      // Estimate tokens (rough: 4 chars ≈ 1 token)
      const estimateTokens = (messages: ApiChatMessage[]): number => {
        return messages.reduce((total, msg) => {
          const content = typeof msg.content === "string"
            ? msg.content
            : JSON.stringify(msg.content);
          return total + Math.ceil(content.length / 4);
        }, 0);
      };

      // Apply truncation first, then strip old images
      const truncatedHistory = truncateHistory(fullHistory, effectiveMemoryLimit);
      const optimizedHistory = hasImageInHistory
        ? stripOldImages(truncatedHistory)
        : truncatedHistory;

      const apiMessages = buildApiMessages(optimizedHistory);

      // Calculate max_tokens based on estimated input
      const MAX_CONTEXT = 32000;
      const RESPONSE_BUFFER = 4000;
      const SAFETY_MARGIN = 500;
      const estimatedInput = estimateTokens(apiMessages);
      const maxResponseTokens = Math.max(
        1000,
        Math.min(RESPONSE_BUFFER, MAX_CONTEXT - estimatedInput - SAFETY_MARGIN)
      );

      const payload: ChatRequest = {
        model,
        messages: apiMessages,
        temperature: 0.3,
        top_p: 0.7,
        stream: false,
        max_tokens: maxResponseTokens,
      };

      let response;
      try {
        response = await apiPost(`${BASE_PATH}/completions`, payload, { ...getHeaders() });
      } catch (error) {
        const axiosError = error as {
          code?: string;
          response?: { status?: number };
          message?: string;
        };
        console.error("Code Analyzer Error:", {
          message: axiosError.message || 'Unknown error',
          code: axiosError.code,
          status: axiosError.response?.status,
        });
        throw error;
      }

      if (response?.data?.choices?.[0]?.message) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.data.choices[0].message.content,
        };
        setConversationHistory((prev) => [...prev, userMessage, assistantMessage]);
      }

      return response;
    },
  });

  return {
    mutation,
    resetConversation,
  };
};
