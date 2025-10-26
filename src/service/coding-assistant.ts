
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
} from "./ai-types";
import { BASE_PATH, buildApiMessages, DEFAULT_QUERY_OPTIONS, getHeaders } from "./ai-service";

/* ------------------------------------------------------------------ */
/* Hook: useCodingAssistant                                         */
/* ------------------------------------------------------------------ */

export const useCodingAssistant = (
  model: string,
  programmingLanguage?: string
) => {
  const systemPrompt = `You are a senior software engineer and coding mentor specializing in ${programmingLanguage ?? "multiple programming languages"}.

  Your responses should:
  1. Provide working, production‑ready code with comprehensive error handling, industry best practices, and performance considerations
  2. Offer testing suggestions

  Format your responses with proper code blocks and be concise but thorough.`;

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
      const updatedHistory = [...conversationHistory, userMessage];

      const apiMessages = buildApiMessages(updatedHistory);

      const payload: ChatRequest = {
        model,
        messages: apiMessages,
        temperature: 0.3,
        max_tokens: 10000,
        top_p: 0.75,
        stream: false,
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