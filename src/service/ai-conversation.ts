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
  ApiChatMessage,
  ApiMessageContent,
  ChatRequest,
  ApiResponse,
  ConversationContext,
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

/**
 * Detect whether a message contains an image.
 */
const containsImage = (
  content: string | ChatMessageContent[]
): boolean => {
  if (Array.isArray(content)) {
    return content.some((c) => c.type === "image");
  }
  return false;
};

/**
 * Handle fallback logic for a failed request.
 * Returns the new response or throws the original error.
 */
const handleFallback = async (
  originalError: unknown,
  payload: ChatRequest,
  hasImage: boolean,
  fallbackModel: string,
  setFallbackActive: (active: boolean) => void
) => {
  const axiosError = originalError as {
    response?: { status?: number };
  };
  const statusCode = axiosError.response?.status;

  // Only activate fallback for certain error codes
  const shouldActivateFallback = statusCode
    ? [400, 429, 500].includes(statusCode)
    : false;

  const fallbackPayload = { ...payload, model: fallbackModel };

  try {
    return await apiPost(`${BASE_PATH}/completions`, fallbackPayload, {
      ...getHeaders(),
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
    });
  } catch (fallbackError) {
    if (shouldActivateFallback) {
      setFallbackActive(true);
    }
    console.error("Fallback AI API Error:", fallbackError);
    throw fallbackError;
  }
};

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
  getLastResponse: () => string | ChatMessageContent[] | null;
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
        max_tokens: 10_000,
        top_p: 0.9,
        stream: false,
      };

      const hasImage = containsImage(content);

      // Choose the model for image messages
      const vercelPayload = hasImage
        ? { ...payload, model: "meta-llama/llama-4-maverick:free" }
        : payload;

      let response;
      try {
        response = await apiPost(`${BASE_PATH}/completions`, vercelPayload, {
          ...getHeaders(),
        });
      } catch (error) {
        // Try fallback (Groq) if the request failed
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

  const getLastResponse = useCallback(() => {
    const last = conversationHistory[conversationHistory.length - 1];
    return last?.role === "assistant" ? last.content : null;
  }, [conversationHistory]);

  return {
    mutation,
    conversationContext,
    resetConversation,
    getLastResponse,
  };
};