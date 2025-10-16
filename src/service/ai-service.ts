/* ------------------------------------------------------------------ */
/* ai-client.ts – Clean, type‑safe helper for the OpenRouter API      */
/* ------------------------------------------------------------------ */

import { apiPost } from "./axios-client";
import {
  ChatMessage,
  ChatMessageContent,
  ApiChatMessage,
  ApiMessageContent,
  ChatRequest,
} from "./ai-types";

/* ------------------------------------------------------------------ */
/* Constants                                                        */
/* ------------------------------------------------------------------ */

export const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
} as const;

export const BASE_PATH = "/v1/chat" as const;
  
/* ------------------------------------------------------------------ */
/* Helper Functions                                                */
/* ------------------------------------------------------------------ */

/**
 * Build the headers used for every request.
 * Centralises the `Authorization` header so it can’t be duplicated.
 */
export const getHeaders = (): Record<string, string> => {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_OPENROUTER_API_KEY is missing from environment variables."
    );
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://online-code-preview.vercel.app",
    "X-Title": "Online Code Editor",
  };
};

/**
 * Convert a local `ChatMessage` array into the format expected by the API.
 */
export const buildApiMessages = (
  messages: ChatMessage[]
): ApiChatMessage[] => {
  return messages.map((msg) => {
    // Plain‑text message
    if (typeof msg.content === "string") {
      return { role: msg.role, content: msg.content };
    }

    // Multimodal message – split text and images
    const textParts = msg.content
      .filter((c) => c.type === "text")
      .map((c) => c.content)
      .join(" ")
      .trim();

    const imageUrls = msg.content
      .filter((c) => c.type === "image")
      .map((c) => c.content);

    // Build the API‑specific content array
    const apiContent: ApiMessageContent[] = [];

    if (textParts) {
      apiContent.push({ type: "text", text: textParts });
    }

    imageUrls.forEach((url) => {
      apiContent.push({ type: "image_url", image_url: { url } });
    });

    return { role: msg.role, content: apiContent };
  });
};

/**
 * Detect whether a message contains an image.
 */
export const containsImage = (
  content: string | ChatMessageContent[]
): content is ChatMessageContent[] => {
  return Array.isArray(content) && content.some((c) => c.type === "image");
};

/**
 * Send a POST request to the chat endpoint.
 * Centralises the request logic so it can be reused by the fallback helper.
 */
const postChat = async (
  payload: ChatRequest,
  headers?: Record<string, string>
) => {
  if (!payload.model) {
    throw new Error("ChatRequest.model is required.");
  }

  return await apiPost(`${BASE_PATH}/completions`, payload, {
    ...getHeaders(),
    ...headers,
  });
};

/**
 * Handle fallback logic for a failed request.
 * Returns the new response or throws the original error.
 */
export const handleFallback = async (
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

  const shouldActivateFallback = statusCode
    ? [400, 429, 500].includes(statusCode)
    : false;

  const fallbackPayload = { ...payload, model: fallbackModel };

  try {
    return await postChat(fallbackPayload);
  } catch (fallbackError) {
    if (shouldActivateFallback) {
      setFallbackActive(true);
    }
    console.error("Fallback AI API Error:", fallbackError);
    throw fallbackError;
  }
};

/* ------------------------------------------------------------------ */
/* Exported API – convenient grouping of helpers                     */
/* ------------------------------------------------------------------ */

export const chatApi = {
  getHeaders,
  buildApiMessages,
  containsImage,
  handleFallback,
  postChat,
};
