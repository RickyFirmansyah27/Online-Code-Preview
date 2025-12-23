
/* ──────────────────────────────────────────────────────────────────────
   coding-assistant.ts
   ──────────────────────────────────────────────────────────────────────
   useCodingAssistant hook for specialised coding help with language-specific prompts.
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
import systemPrompt from "../lib/system-prompt";

/* ------------------------------------------------------------------ */
/* Hook: useCodingAssistant                                         */
/* ------------------------------------------------------------------ */

export const useCodingAssistant = (
  model: string,
  memoryLimit: number = 6
) => {
  const baseSystemPrompt = systemPrompt(model);


  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(() => [
    { role: "system", content: baseSystemPrompt },
  ]);

  const resetConversation = useCallback(() => {
    setConversationHistory([{ role: "system", content: baseSystemPrompt }]);
  }, [baseSystemPrompt]);

  const mutation = useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: async (content: string) => {
      const userMessage: ChatMessage = { role: "user", content };
      const fullHistory = [...conversationHistory, userMessage];

      // Truncate history: keep system prompt + last N pairs
      const truncateHistory = (history: ChatMessage[], limit: number): ChatMessage[] => {
        const systemMsg = history[0];
        const pairs = history.slice(1);
        const maxMessages = limit * 2;
        const truncated = pairs.slice(-maxMessages);
        return [systemMsg, ...truncated];
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

      const updatedHistory = truncateHistory(fullHistory, memoryLimit);
      const apiMessages = buildApiMessages(updatedHistory);

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
        top_p: 0.75,
        stream: false,
        max_tokens: maxResponseTokens,
      };

      let response;
      try {
        response = await apiPost(`${BASE_PATH}/completions`, payload, {
          ...getHeaders(),
        });
      } catch (error) {
        const axiosError = error as {
          code?: string;
          response?: { status?: number };
          message?: string;
        };
        console.error("Coding Assistant Error:", {
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