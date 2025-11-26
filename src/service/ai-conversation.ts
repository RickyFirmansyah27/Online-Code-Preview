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
  name: string
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
      const updatedHistory = [...conversationHistory, userMessage];

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

      const payload: ChatRequest = {
        model: effectiveModel,
        messages: finalMessages,
        temperature: 0.3,
        top_p: 0.9,
        stream: false,
      };

      const hasImage = containsImage(content);

      // Choose the model for image messages
      const completionPayload = hasImage
        ? { ...payload, model: "mistralai/mistral-large-2407-instruct:free" }
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