
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
  ApiChatMessage,
  ApiMessageContent,
  ChatRequest,
} from "./ai-types";

/* ------------------------------------------------------------------ */
/* Constants                                                        */
/* ------------------------------------------------------------------ */

const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
};

const BASE_PATH = "/v1/chat";

/* ------------------------------------------------------------------ */
/* Helper Functions                                                */
/* ------------------------------------------------------------------ */

/**
 * Build the headers used for every request.
 */
const getHeaders = (): Record<string, string> => ({
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://online-code-preview.vercel.app",
  "X-Title": "Online Code Editor",
});

/**
 * Convert a local `ChatMessage` array into the format expected by the API.
 */
const buildApiMessages = (
  messages: ChatMessage[]
): ApiChatMessage[] => {
  return messages.map((msg) => {
    if (typeof msg.content === "string") {
      return { role: msg.role, content: msg.content };
    }

    // Multimodal content – split text and images
    const textParts = msg.content
      .filter((c) => c.type === "text")
      .map((c) => c.content)
      .join(" ");
    const imageParts = msg.content
      .filter((c) => c.type === "image")
      .map((c) => c.content);

    if (imageParts.length === 0) {
      return { role: msg.role, content: textParts };
    }

    const apiContent: ApiMessageContent[] = [];
    if (textParts.trim()) {
      apiContent.push({ type: "text", text: textParts });
    }
    imageParts.forEach((url) => {
      apiContent.push({ type: "image_url", image_url: { url } });
    });

    return { role: msg.role, content: apiContent };
  });
};

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
        max_tokens: 10_000,
        top_p: 0.95,
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
          request: {
            model: payload.model,
            messages: payload.messages.slice(0, 2),
            temperature: payload.temperature,
          },
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