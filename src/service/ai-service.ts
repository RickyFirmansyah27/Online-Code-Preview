/* ──────────────────────────────────────────────────────────────────────
   useChat.ts
   ──────────────────────────────────────────────────────────────────────
   A set of React hooks that wrap the OpenRouter / Groq API for
   conversational AI.  The hooks expose a mutation (via react‑query)
   and a small conversation context that keeps the chat history in
   component state.

   The file is intentionally split into three public hooks:
   • useConversationAi – generic chat with fallback model
   • useCodingAssistant – specialised prompt for coding help
   • useCodeAnalyzer – single‑shot code analysis
   ──────────────────────────────────────────────────────────────────────
*/

import { useState, useCallback } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { apiPost } from "./axios-client";
import { FALLBACK_MODEL_ID } from "./model-types";

/* ------------------------------------------------------------------ */
/* Types & Interfaces                                               */
/* ------------------------------------------------------------------ */

interface ChatMessageContent {
  type: "text" | "image";
  content: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string | ChatMessageContent[];
}

interface ApiMessageContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

interface ApiChatMessage {
  role: "user" | "assistant" | "system";
  content: string | ApiMessageContent[];
}

interface ChatRequest {
  model: string;
  messages: ApiChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

interface ApiResponse {
  data?: {
    choices?: Array<{
      message?: {
        content?: string | null;
      };
    }>;
  };
}

interface ConversationContext {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
}

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

  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([
    {
      role: "system",
      content: `You are ${name} model ai assistant . Always provide:
        ... (system prompt omitted for brevity) ...`,
    },
  ]);

  const [fallbackActive, setFallbackActive] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const conversationContext: ConversationContext = {
    messages: conversationHistory,
    addMessage: (msg) => setConversationHistory((prev) => [...prev, msg]),
    clearMessages: () => {
      setFallbackActive(false);
      setConversationHistory([
        {
          role: "system",
          content: `You are an expert coding assistant. Always provide:
            1. Clear, well-commented code solutions
            3. Best practices and potential optimisations
            4. Error handling considerations
            5. Testing suggestions when applicable

            Format your responses with proper code blocks and be concise but thorough.`,
        },
      ]);
    },
  };

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

  const resetConversation = useCallback(() => conversationContext.clearMessages(), [conversationContext]);

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

  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([
    { role: "system", content: systemPrompt },
  ]);

  const conversationContext = {
    clearMessages: () =>
      setConversationHistory([{ role: "system", content: systemPrompt }]),
  };

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
    resetConversation: conversationContext.clearMessages,
  };
};

/* ------------------------------------------------------------------ */
/* Hook: useCodeAnalyzer                                            */
/* ------------------------------------------------------------------ */

export const useCodeAnalyzer = (model: string) => {
  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: async (code: string) => {
      const analysisPrompt = `Analyze the following code and provide:
      - Diagnosing Core Failure
      - Unpacking the Error's Source
      - Troubleshooting Case Flow
      - Identifying the Case Issue
      - Resolving the Case Error
      - Addressing Case Constancy
      - Implementing Case Checks
      - Implementing Edge Case Handling
      - Implementing Edge Case Logic
      - Adapting Logic
      - Refining the Approach
      - Refining the Solution

      Code to analyze:
      \`\`\`
      ${code}
      \`\`\``;

      const payload: ChatRequest = {
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a code review expert. Provide thorough, constructive analysis focusing on code quality, security, and performance",
          },
          { role: "user", content: analysisPrompt },
        ] as ApiChatMessage[],
        temperature: 0.3,
        max_tokens: 10_000,
        top_p: 0.9,
        stream: false,
      };

      return await apiPost(`${BASE_PATH}/completions`, payload, {
        ...getHeaders(),
      });
    },
  });
};
