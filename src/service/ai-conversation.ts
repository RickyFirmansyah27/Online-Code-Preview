/* ──────────────────────────────────────────────────────────────────────
   ai-conversation.ts
   ──────────────────────────────────────────────────────────────────────
   useConversationAi hook for generic chat with fallback model support.
   ────────────────────────────────────────────────────────────────────── */

import { useState, useCallback, useMemo } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { apiPost } from "./axios-client";
import systemPrompt from "@/lib/system-prompt";
import { FALLBACK_MODEL_ID } from "./model-types";
import {
  ChatMessage,
  ChatMessageContent,
  ApiMessageContent,
  ApiChatMessage,
  ChatRequest,
  ApiResponse,
  ConversationContext,
} from "./ai-types";
import { BASE_PATH, buildApiMessages, containsImage, DEFAULT_QUERY_OPTIONS, getHeaders, handleFallback } from "./ai-service";

/* ------------------------------------------------------------------ */
/* Hook: useConversationAi                                         */
/* ------------------------------------------------------------------ */

export const useConversationAi = (
  model: string,
  name: string,
  memoryLimit: number = 6
): {
  mutation: UseMutationResult<ApiResponse, unknown, string | ChatMessageContent[], unknown>;
  conversationContext: ConversationContext;
  resetConversation: () => void;
} => {
  /* ---- Conversation state ------------------------------------------------ */

  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(() => [
    {
      role: "system",
      content: systemPrompt(name),
    },
  ]);

  const [fallbackActive, setFallbackActive] = useState(false);

  const conversationContext: ConversationContext = useMemo(
    () => ({
      messages: conversationHistory,
      addMessage: (msg) => setConversationHistory((prev) => [...prev, msg]),
      clearMessages: () => {
        setFallbackActive(false);
        setConversationHistory([
          {
            role: "system",
            content: systemPrompt(name),
          },
        ]);
      },
    }),
    [conversationHistory, name]
  );

  /* ---- Mutation ----------------------------------------------------------- */

  const mutation = useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: async (content: string | ChatMessageContent[]) => {
      const userMessage: ChatMessage = { role: "user", content };
      const fullHistory = [...conversationHistory, userMessage];

      // Truncate history: keep system prompt + last N pairs
      const truncateHistory = (history: ChatMessage[], limit: number): ChatMessage[] => {
        const systemMsg = history[0]; // Always keep system prompt
        const pairs = history.slice(1);
        const maxMessages = limit * 2; // user + assistant per pair
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

      const effectiveModel = fallbackActive ? FALLBACK_MODEL_ID : model;

      const finalMessages = fallbackActive
        ? apiMessages.map((msg) =>
          typeof msg.content === "string"
            ? msg
            : {
              ...msg,
              content: (msg.content as ApiMessageContent[])
                .filter((c) => c.type === "text")
                .map((c) => c.text ?? "")
                .join(" "),
            }
        )
        : apiMessages;

      // Calculate max_tokens based on estimated input tokens
      const MAX_CONTEXT = 32000;
      const RESPONSE_BUFFER = 4000;
      const SAFETY_MARGIN = 500;
      const estimatedInput = estimateTokens(finalMessages);
      const maxResponseTokens = Math.max(
        1000, // minimum response tokens
        Math.min(RESPONSE_BUFFER, MAX_CONTEXT - estimatedInput - SAFETY_MARGIN)
      );

      const payload: ChatRequest = {
        model: effectiveModel,
        messages: finalMessages,
        temperature: 0.3,
        top_p: 0.9,
        stream: false,
        max_tokens: maxResponseTokens,
      };

      const hasImageInContent = containsImage(content);

      // Check if any message in history contains an image
      const hasImageInHistory = updatedHistory.some(msg =>
        Array.isArray(msg.content) && msg.content.some(c => c.type === "image")
      );

      const hasImage = hasImageInContent || hasImageInHistory;

      // Choose the vision model if any image exists in content or history
      const completionPayload = hasImage
        ? { ...payload, model: "qwen/qwen3-vl-235b-a22b-instruct" }
        : payload;

      let response;
      try {
        response = await apiPost(`${BASE_PATH}/completions`, completionPayload, {
          ...getHeaders(),
        });
      } catch (error) {
        response = await handleFallback(
          error,
          payload,
          hasImage,
          FALLBACK_MODEL_ID,
          setFallbackActive
        );
      }

      // Update history with assistant reply
      if (response?.data?.choices?.[0]?.message) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.data.choices[0].message.content,
        };
        setConversationHistory((prev) => [...prev, userMessage, assistantMessage]);
      }

      return response;
    },
    onError: (error) => console.error("Conversation AI Error:", error),
  });

  /* ---- Public API -------------------------------------------------------- */

  const resetConversation = useCallback(() => {
    setFallbackActive(false);
    setConversationHistory([
      {
        role: "system",
        content: systemPrompt(name),
      },
    ]);
  }, [name]);

  return {
    mutation,
    conversationContext,
    resetConversation,
  };
};